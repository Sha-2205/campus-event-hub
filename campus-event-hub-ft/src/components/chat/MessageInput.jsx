import React, { useState, useRef } from 'react';
import { Send, Smile } from 'lucide-react';
import Button from '../common/Button';

export default function MessageInput({
  placeholder = "Send a message...",
  onSendMessage
}) {
  const [text, setText] = useState('');
  const [showEmojis, setShowEmojis] = useState(false);
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSendMessage(text);
    setText('');
    setShowEmojis(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const appendEmoji = (emoji) => {
    setText((prev) => prev + emoji);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const emojis = ['👍', '❤️', '🔥', '😂', '🎉', '🚀', '💯', '👏', '🤔', '👀', '💡', '✨'];

  return (
    <div className="flex flex-col gap-2 shrink-0 relative w-full">
      {/* Emoji picker drawer */}
      {showEmojis && (
        <div className="absolute bottom-16 left-2 bg-slate-900 border border-slate-800 rounded-2xl p-3 shadow-2xl flex flex-wrap gap-2 max-w-[280px] z-50 animate-fade-in text-left">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest w-full mb-1">
            ⚡ Quick Emojis
          </p>
          {emojis.map((emoji) => (
            <button
              key={emoji}
              type="button"
              id={`picker-emoji-${emoji}`}
              onClick={() => appendEmoji(emoji)}
              className="text-lg hover:scale-125 transition-transform p-1 rounded hover:bg-slate-800 cursor-pointer"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex gap-2.5 items-end">
        <div className="relative flex-1 flex items-center bg-slate-950/40 border border-slate-850 rounded-xl px-3 py-1.5 focus-within:border-indigo-500 transition-all">
          <button
            type="button"
            id="chat-emoji-toggle"
            onClick={() => setShowEmojis(!showEmojis)}
            className={`p-2 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-900/60 transition-colors cursor-pointer shrink-0 ${
              showEmojis ? 'text-indigo-400' : ''
            }`}
            title="Add emoji"
          >
            <Smile className="w-5 h-5" />
          </button>

          <textarea
            ref={inputRef}
            rows={1}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full bg-transparent border-none text-slate-100 text-sm py-2 px-1 outline-none resize-none placeholder:text-slate-600 font-medium max-h-[120px] scrollbar-none"
            style={{ height: 'auto' }}
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          icon={Send}
          id="btn-send-chat-input"
          className="shrink-0 rounded-xl h-[48px] px-5"
          disabled={!text.trim()}
        >
          Send
        </Button>
      </form>
    </div>
  );
}
