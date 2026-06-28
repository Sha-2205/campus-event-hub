import React, { useEffect, useRef } from 'react';
import { ChevronLeft, Info, Hash } from 'lucide-react';
import Button from '../common/Button';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';

export default function ChatWindow({
  activeTeam,
  messages = [],
  userId,
  loading,
  connected,
  onSendMessage,
  onEditMessage,
  onDeleteMessage,
  onToggleReaction,
  onViewBoard,
  onBackToChannels,
}) {
  console.log("MESSAGES IN CHATWINDOW:", messages);
console.log("MESSAGES LENGTH:", messages.length);
  const scrollRef = useRef(null);
  console.log("MESSAGES IN CHATWINDOW:", messages);

  // DEBUG LOG
  console.log('ChatWindow Messages:', messages);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-slate-950/20 border border-slate-900 rounded-2xl p-6 min-h-[45vh]">
        <div className="h-8 w-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-slate-500 font-semibold mt-3">
          Connecting to workspace secure streams...
        </p>
      </div>
    );
  }

  if (!activeTeam) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-slate-950/20 border border-slate-900 border-dashed rounded-2xl p-8 text-center min-h-[45vh]">
        <div className="h-12 w-12 rounded-full bg-slate-900/50 flex items-center justify-center text-slate-600 mb-3">
          <Info className="w-6 h-6" />
        </div>

        <h3 className="text-sm font-bold text-slate-300">
          No Channel Selected
        </h3>

        <p className="text-xs text-slate-500 mt-1.5 max-w-sm leading-relaxed">
          Select a project squad channel from the channels sidebar list to initialize secure campus message logs.
        </p>
      </div>
    );
  }

  const isLead =
    activeTeam.creatorId === userId ||
    activeTeam.leaderId === userId;

  return (
    <div className="flex-1 flex flex-col h-full bg-transparent relative min-w-0">

      {/* HEADER */}
      <div className="flex items-center justify-between p-4 bg-slate-900/40 border border-slate-900 rounded-2xl mb-4 shrink-0">

        <div className="flex items-center gap-3">
          {onBackToChannels && (
            <Button
              id="btn-back-to-channels"
              variant="outline"
              size="sm"
              onClick={onBackToChannels}
              icon={ChevronLeft}
              className="md:hidden p-1.5 rounded-lg shrink-0"
            >
              Channels
            </Button>
          )}

          <div className="text-left truncate">
            <h1 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
              <Hash className="w-4 h-4 text-indigo-400 shrink-0" />
              <span className="truncate">
                {activeTeam.name || activeTeam.teamName}
              </span>
            </h1>

            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5 flex items-center gap-1.5">
              👥 {activeTeam.members?.length || 0} members active

              <span
                className={`inline-block h-1.5 w-1.5 rounded-full ${
                  connected ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
              />
            </p>
          </div>
        </div>

        <Button
          id="btn-goto-team-details"
          variant="secondary"
          size="sm"
          onClick={() =>
            onViewBoard &&
            onViewBoard(activeTeam._id || activeTeam.id)
          }
          className="text-xs py-1.5 shrink-0"
        >
          View Board
        </Button>
      </div>

      {/* MESSAGE AREA */}
      <div className="flex-1 overflow-y-auto bg-slate-950/40 border border-slate-900/80 rounded-2xl p-4 md:p-6 mb-4 flex flex-col gap-4 min-h-0">

        {messages && messages.length > 0 ? (
          messages.map((msg, index) => (
            <MessageBubble
              key={msg._id || msg.id || index}
              msg={msg}
              userId={userId}
              isLead={isLead}
              onEdit={onEditMessage}
              onDelete={onDeleteMessage}
              onToggleReaction={onToggleReaction}
            />
          ))
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-16">
            <p className="text-slate-500 font-semibold italic text-xs">
              Welcome to the beginning of the #
              {activeTeam.name || activeTeam.teamName}
              {' '}channel conversation log.
            </p>

            <p className="text-[10px] text-slate-600 mt-1 max-w-xs leading-relaxed">
              Formulate project scopes, delegate roles, and collaborate with your teammates.
            </p>
          </div>
        )}

        <div ref={scrollRef} />
      </div>

      {/* INPUT */}
      <MessageInput
        placeholder={`Message #${
          activeTeam.name || activeTeam.teamName
        }...`}
        onSendMessage={onSendMessage}
      />
    </div>
  );
}