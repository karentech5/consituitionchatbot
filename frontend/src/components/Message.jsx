import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const Message = ({ text, sender, timestamp }) => {
  const isUser = sender === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6 items-end gap-3 group animate-bubble`}>

      {/* Bot avatar (left side, only for bot) */}
      {!isUser && (
        <div
          className="flex-shrink-0 w-10 h-10 rounded-xl overflow-hidden border-2 border-[#003893]/20 shadow-sm transition-transform group-hover:scale-105"
          title="Nepal Constitution Bot"
        >
          <img
            src="/constitution.webp"
            alt="Bot"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Bubble + timestamp column */}
      <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[82%]`}>
        {/* Sender label */}
        <span className="text-[11px] font-bold mb-1.5 px-1 text-gray-500 uppercase tracking-widest opacity-70">
          {isUser ? 'You' : '🇳🇵 Constitution Bot'}
        </span>

        {/* Message bubble */}
        <div
          className={`
            px-5 py-3.5 rounded-2xl text-[15px] leading-relaxed shadow-md
            ${isUser
              ? 'bg-gradient-to-br from-[#DC143C] to-[#b31031] text-white rounded-br-none'
              : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none prose prose-slate prose-sm max-w-none'
            }
          `}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap">{text}</p>
          ) : (
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({node, ...props}) => <p className="mb-3 last:mb-0" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc ml-4 mb-3" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal ml-4 mb-3" {...props} />,
                li: ({node, ...props}) => <li className="mb-1" {...props} />,
                h1: ({node, ...props}) => <h1 className="text-lg font-bold mb-2 border-b pb-1" {...props} />,
                h2: ({node, ...props}) => <h2 className="text-md font-bold mb-2" {...props} />,
                strong: ({node, ...props}) => <strong className="font-bold text-[#003893]" {...props} />,
              }}
            >
              {text}
            </ReactMarkdown>
          )}
        </div>

        {/* Timestamp */}
        {timestamp && (
          <span className="text-[10px] font-medium text-gray-400 mt-1.5 px-1 italic">
            {timestamp}
          </span>
        )}
      </div>

      {/* User avatar (right side, only for user) */}
      {isUser && (
        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center shadow-md border border-gray-300 transition-transform group-hover:scale-105">
          <span className="text-white text-sm font-black">U</span>
        </div>
      )}
    </div>
  );
};

export default Message;
