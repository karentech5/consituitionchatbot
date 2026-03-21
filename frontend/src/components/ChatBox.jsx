// ChatBox.jsx
// Main chat interface. Manages all messages, input state, and bot responses.
// Now includes:
// - Welcome card with constitution image
// - Timestamped messages
// - Richer input toolbar styling

import { useState, useRef, useEffect } from 'react';
import Message from './Message';

// Helper: format current time as HH:MM AM/PM
const getTimestamp = () => {
  return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

// A set of varied placeholder responses to feel more natural
const DUMMY_RESPONSES = [
  'This is a placeholder response from the Nepal Constitution chatbot. Once connected to a backend, I will answer your questions about the Constitution of Nepal accurately.',
  'The Constitution of Nepal 2015 is the fundamental law of Nepal, replacing the Interim Constitution of 2007. It establishes Nepal as a federal democratic republic.',
  'Great question! The Constitution of Nepal contains 272 Articles, 35 Parts, and 9 Schedules. It was promulgated on 20 September 2015.',
  'According to the Constitution, Nepal is a Federal Democratic Republic. The country is divided into 7 provinces, each with its own government.',
  'I am currently running in demo mode. Please connect me to a backend to get accurate constitutional information.',
];

let responseIndex = 0;

const ChatBox = () => {
  // ── State ──────────────────────────────────────────────────────────
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);

  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // ── Send message handler ──────────────────────────────────────────
  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isTyping) return;

    // Hide the welcome card once chat starts
    setShowWelcome(false);

    // Add user message
    const timestamp = getTimestamp();
    const userMsg = { id: Date.now(), text: trimmed, sender: 'user', timestamp };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    // Auto-resize textarea back to 1 row
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    // Simulate bot typing then respond from real backend
    setIsTyping(true);
    try {
      const response = await fetch('http://localhost:8001/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed }),
      });

      if (!response.ok) {
        throw new Error('Backend failed to respond');
      }

      const data = await response.json();
      const botMsg = {
        id: Date.now() + 1,
        text: data.answer || "I'm sorry, I couldn't process that.",
        sender: 'bot',
        timestamp: getTimestamp()
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMsg = {
        id: Date.now() + 1,
        text: "Error: Unable to connect to the Nepal Constitution Backend. Please ensure the server is running and your API key is configured.",
        sender: 'bot',
        timestamp: getTimestamp()
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto-grow textarea height
  const handleInput = (e) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
  };

  // Suggested questions for quick access
  const suggestions = [
    'What is Article 1?',
    'How many articles does it have?',
    'What are fundamental rights?',
    'How many provinces are there?',
  ];

  // ── Render ────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col flex-1 max-w-3xl w-full mx-auto px-3 sm:px-5 py-3 gap-3 overflow-hidden">

      {/* ── Scrollable message area ── */}
      <div className="flex-1 overflow-y-auto chat-scroll min-h-0 px-1">

        {/* Welcome Card — shown before first message */}
        {showWelcome && (
          <div className="flex flex-col items-center text-center py-6 px-4 gap-4">
            <img
              src="/constitution.webp"
              alt="Nepal Constitution"
              className="w-32 h-32 object-cover rounded-2xl shadow-lg"
              style={{ boxShadow: '0 6px 30px rgba(220,20,60,0.2)' }}
            />
            <div>
              <h2 className="text-xl font-bold text-gray-800">Namaste 🙏</h2>
              <p className="text-gray-500 text-sm mt-1 max-w-sm">
                I'm your Nepal Constitution assistant. Ask me anything about Nepal's
                Constitution of 2015 — its articles, rights, policies and more.
              </p>
            </div>

            {/* Suggestion chips */}
            <div className="flex flex-wrap justify-center gap-2 mt-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => { setInput(s); textareaRef.current?.focus(); }}
                  className="px-4 py-2 bg-white border border-[#003893]/20 text-[#003893] text-xs font-medium rounded-full hover:bg-[#003893] hover:text-white transition-all duration-200 shadow-sm"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chat messages */}
        {messages.map((msg) => (
          <Message key={msg.id} text={msg.text} sender={msg.sender} timestamp={msg.timestamp} />
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start mb-4 items-end gap-2">
            <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-[#003893]/30 shadow flex-shrink-0">
              <img src="/constitution.webp" alt="Bot typing" className="w-full h-full object-cover" />
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm flex items-center gap-1">
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* ── Input container ── */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
        {/* Input row */}
        <div className="flex items-end gap-2 px-4 py-3">
          <textarea
            ref={textareaRef}
            className="flex-1 resize-none outline-none text-sm text-gray-800 placeholder-gray-400 leading-relaxed"
            style={{ maxHeight: '120px', minHeight: '24px' }}
            rows={1}
            placeholder="Ask about the Nepal Constitution..."
            value={input}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            aria-label="Message input"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="flex-shrink-0 bg-gradient-to-br from-[#DC143C] to-[#a30f2b] hover:from-[#c01030] hover:to-[#8a0920] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-all duration-200 shadow-sm"
            aria-label="Send message"
          >
            Send ↑
          </button>
        </div>

        {/* Footer note */}
        <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-t border-gray-100">
          <span className="text-[11px] text-gray-400">Enter to send · Shift+Enter for new line</span>
          <span className="text-[11px] text-gray-400">Demo mode</span>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
