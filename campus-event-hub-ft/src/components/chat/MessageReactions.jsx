import React from 'react';

export default function MessageReactions({
  messageId,
  reactions = {},
  userId,
  onToggleReaction
}) {
  return (
    <div className="flex items-center gap-1.5 flex-wrap mt-1 select-none">
      {Object.entries(reactions).map(([emoji, userList]) => {

        // Ensure userList is always an array
        const users = Array.isArray(userList) ? userList : [];

        // Skip if no reactions
        if (users.length === 0) return null;

        const userReacted = users.includes(userId);

        return (
          <button
            key={emoji}
            id={`reaction-badge-${messageId}-${emoji}`}
            onClick={() => onToggleReaction(messageId, emoji)}
            className={`flex items-center gap-1.5 px-2 py-0.5 rounded-lg border text-xs font-bold transition-all hover:scale-105 cursor-pointer
              ${
                userReacted
                  ? 'bg-indigo-600/15 border-indigo-500/30 text-indigo-400'
                  : 'bg-slate-900/60 border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-600'
              }
            `}
          >
            <span>{emoji}</span>
            <span>{users.length}</span>
          </button>
        );
      })}
    </div>
  );
}