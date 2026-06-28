import React, { useState } from 'react';
import { Edit2, Trash2, Check, X } from 'lucide-react';
import Button from '../common/Button';
import MessageReactions from './MessageReactions';

export default function MessageBubble({
  msg,
  userId,
  isLead,
  onEdit,
  onDelete,
  onToggleReaction
}) {
  // Support both senderId object and string
  const senderId =
    typeof msg.senderId === 'object'
      ? msg.senderId?._id || msg.senderId?.id
      : msg.senderId;

  const isMe = senderId === userId;
  const isSystem = senderId === 'system';

  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(msg.content || '');

  const handleSave = () => {
    if (!editText.trim()) return;

    onEdit(msg._id || msg.id, editText);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditText(msg.content || '');
    setIsEditing(false);
  };

  if (isSystem) {
    return (
      <div className="flex justify-center my-1 w-full">
        <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-900/60 text-indigo-400 border border-indigo-500/10 px-3 py-1 rounded-full">
          {msg.content}
        </span>
      </div>
    );
  }

  return (
    <div
      id={`message-${msg._id || msg.id}`}
      className={`flex gap-3.5 max-w-[85%] group relative ${
        isMe
          ? 'self-end flex-row-reverse text-right'
          : 'self-start text-left'
      }`}
    >
      {/* Avatar */}
      <div className="shrink-0">
        <img
  src={
    msg.senderProfileImage ||
    msg.senderAvatar ||
    msg.senderId?.profileImage ||
    'https://ui-avatars.com/api/?name=' +
      encodeURIComponent(msg.senderName || 'User')
  }
  alt={msg.senderName || 'User'}
  className="h-10 w-10 rounded-xl object-cover ring-2 ring-indigo-500/10 shadow-md"
  referrerPolicy="no-referrer"
/>
      </div>

      <div className="flex flex-col gap-1 w-full min-w-0">

        {/* Username + Time */}
        <div
          className={`flex items-center gap-2 ${
            isMe ? 'justify-end' : 'justify-start'
          }`}
        >
          <span className="text-xs font-bold text-slate-200">
            {msg.senderName || 'Unknown User'}
          </span>

          <span className="text-[10px] text-slate-500">
            {msg.createdAt
              ? new Date(msg.createdAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })
              : ''}
          </span>

          {(msg.isEdited || msg.edited) && (
            <span className="text-[9px] text-slate-500 italic">
              (edited)
            </span>
          )}
        </div>

        {/* Message Box */}
        <div
          className={`rounded-2xl p-3 text-sm break-words ${
            isMe
              ? 'bg-indigo-600/20 border border-indigo-500/30 rounded-tr-none'
              : 'bg-slate-900/50 border border-slate-800 rounded-tl-none'
          }`}
        >
          {isEditing ? (
            <div className="space-y-2">
              <textarea
                rows={2}
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-sm"
              />

              <div className="flex justify-end gap-2">
                <Button
                  size="sm"
                  icon={Check}
                  onClick={handleSave}
                >
                  Save
                </Button>

                <Button
                  size="sm"
                  variant="secondary"
                  icon={X}
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <p>{msg.content}</p>
          )}
        </div>

        {/* Reactions */}
        <MessageReactions
          messageId={msg._id || msg.id}
          reactions={msg.reactions || {}}
          userId={userId}
          onToggleReaction={onToggleReaction}
        />

        {/* Actions */}
        {!isEditing && (
          <div
            className={`opacity-0 group-hover:opacity-100 absolute top-2 flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-xl p-1 transition-all z-10 ${
              isMe ? '-left-24' : '-right-24'
            }`}
          >
            {['👍', '❤️', '🔥', '😂'].map((emoji) => (
              <button
                key={emoji}
                onClick={() =>
                  onToggleReaction(msg._id || msg.id, emoji)
                }
                className="p-1 hover:scale-125 transition"
              >
                {emoji}
              </button>
            ))}

            {(isMe || isLead) && (
              <>
                {isMe && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-1 text-slate-400 hover:text-white"
                  >
                    <Edit2 size={14} />
                  </button>
                )}

                <button
                  onClick={() =>
                    onDelete(msg._id || msg.id)
                  }
                  className="p-1 text-slate-400 hover:text-red-400"
                >
                  <Trash2 size={14} />
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}