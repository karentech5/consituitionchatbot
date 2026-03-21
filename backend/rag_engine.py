import os
import threading
from pathlib import Path
from dotenv import load_dotenv

# --- INITIALIZATION ---
load_dotenv()

from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_community.retrievers import BM25Retriever

# 2026 Specific: Legacy components moved to langchain_classic
from langchain_classic.retrievers import EnsembleRetriever 
from langchain_classic.chains import create_retrieval_chain
from langchain_classic.chains.combine_documents import create_stuff_documents_chain

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate

# --- CONFIGURATION ---
BASE_DIR = Path(__file__).parent
PDF_PATH = BASE_DIR / "consituition of nepal.pdf"
DB_PATH = str(BASE_DIR / "chroma_db")

# Singleton pattern globals
_rag_chain = None
_init_lock = threading.Lock()

def _build_rag_chain():
    """Builds the RAG pipeline once and caches it."""
    print("🔄 Initializing RAG Engine...")
    
    if not os.getenv("GOOGLE_API_KEY"):
        raise ValueError("GOOGLE_API_KEY is missing from your .env file.")

    # 1. Load and Split
    loader = PyPDFLoader(str(PDF_PATH))
    docs = loader.load()
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=150)
    chunks = text_splitter.split_documents(docs)

    # 2. Embeddings (Local CPU-based)
    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

    # 3. Vector Storage (Semantic Search)
    if os.path.exists(DB_PATH) and os.listdir(DB_PATH):
        print("📁 Loading existing vector store...")
        vectorstore = Chroma(persist_directory=DB_PATH, embedding_function=embeddings)
    else:
        print("✨ Creating new vector store...")
        vectorstore = Chroma.from_documents(
            documents=chunks, 
            embedding=embeddings, 
            persist_directory=DB_PATH
        )
    
    vector_retriever = vectorstore.as_retriever(search_kwargs={"k": 4})

    # 4. BM25 (Keyword Search)
    bm25_retriever = BM25Retriever.from_documents(chunks)
    bm25_retriever.k = 4

    # 5. Hybrid Ensemble (Combining both)
    hybrid_retriever = EnsembleRetriever(
        retrievers=[bm25_retriever, vector_retriever],
        weights=[0.3, 0.7] # 30% Keywords, 70% Semantic
    )

    # 6. LLM & Prompt
    llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=0.3)
    
    system_prompt = (
        "You are an expert assistant on the Constitution of Nepal (2015). "
        "Answer the user's question accurately using ONLY the provided context. "
        "If the answer is not in the context, say you don't know.\n\n"
        "Context:\n{context}"
    )
    
    prompt = ChatPromptTemplate.from_messages([
        ("system", system_prompt),
        ("human", "{input}"),
    ])

    # 7. Final Assembly
    combine_docs_chain = create_stuff_documents_chain(llm, prompt)
    print("✅ RAG Pipeline ready.")
    return create_retrieval_chain(hybrid_retriever, combine_docs_chain)

def get_answer(query: str) -> str:
    """Thread-safe public function to get answers."""
    global _rag_chain
    
    if _rag_chain is None:
        with _init_lock:
            if _rag_chain is None:
                _rag_chain = _build_rag_chain()

    result = _rag_chain.invoke({"input": query})
    return result.get("answer", "I encountered an error processing that request.")

# --- TEST ---
if __name__ == "__main__":
    response = get_answer("What is the summary of the fundamental rights?")
    print(f"\nAnswer: {response}")