import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback
} from 'react';

import { chatService } from '../api/chatService';
import { useAuth } from './AuthContext';
import { useApp } from './AppContext';

const ChatContext = createContext(null);

export function ChatProvider({ children }) {
  const { user } = useAuth();
  const { showToast } = useApp();

  const [activeTeamId, setActiveTeamId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [connected, setConnected] = useState(false);

  // Initialize socket
  useEffect(() => {
    if (!user) return;

    const socket = chatService.initSocket();

    const onConnect = () => {
      console.log('✅ Socket Connected');
      setConnected(true);
    };

    const onDisconnect = () => {
      console.log('❌ Socket Disconnected');
      setConnected(false);
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    setConnected(socket.connected);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      chatService.disconnect();
    };
  }, [user]);

  // Team room socket listeners
  useEffect(() => {
    if (!activeTeamId || !user) return;

    const socket = chatService.getSocket();
    if (!socket) return;

    chatService.joinTeamRoom(activeTeamId);

    // Debug all socket events
    socket.onAny((event, ...args) => {
      console.log('📡 Socket Event:', event, args);
    });

    // New message received
    const handleMessageReceived = (msg) => {
      console.log('🔥 New Message:', msg);

      setMessages((prev) => {
        const exists = prev.some(
          (m) => m._id === msg._id
        );

        if (exists) return prev;

        return [...prev, msg];
      });
    };

    // Message edited
    const handleMessageEdited = (editedMsg) => {
      setMessages((prev) =>
        prev.map((m) =>
          m._id === editedMsg.messageId
            ? {
                ...m,
                content: editedMsg.content,
                isEdited: true,
                editedAt: editedMsg.editedAt
              }
            : m
        )
      );
    };

    // Message deleted
    const handleMessageDeleted = ({ messageId }) => {
      setMessages((prev) =>
        prev.filter((m) => m._id !== messageId)
      );
    };

    // Message reacted
    const handleMessageReacted = (updatedMsg) => {
      setMessages((prev) =>
        prev.map((m) =>
          m._id === updatedMsg._id ? updatedMsg : m
        )
      );
    };

    socket.on('receive_message', handleMessageReceived);
    socket.on('message_edited', handleMessageEdited);
    socket.on('message_deleted', handleMessageDeleted);
    socket.on('message_reacted', handleMessageReacted);

    return () => {
      chatService.leaveTeamRoom(activeTeamId);

      socket.off('receive_message', handleMessageReceived);
      socket.off('message_edited', handleMessageEdited);
      socket.off('message_deleted', handleMessageDeleted);
      socket.off('message_reacted', handleMessageReacted);
    };
  }, [activeTeamId, user]);

  // Load chat history
  const selectTeamRoom = useCallback(async (teamId) => {
  console.log("📌 Selecting Team:", teamId);

  setActiveTeamId(teamId);

  if (!teamId) {
    console.log("❌ Team ID is null, clearing messages");
    setMessages([]);
    return;
  }

  try {
    setLoading(true);

    const history = await chatService.getHistory(teamId);

    console.log("📜 Loaded History:", history);

    setMessages(history);

  } catch (err) {
    console.error(err);
    showToast('Could not load chat history.', 'error');
  } finally {
    setLoading(false);
  }
}, [showToast]);
  const loadStats = useCallback(
    async (teamId) => {
      if (!teamId) return;

      try {
        const chatStats =
          await chatService.getChatStats(teamId);

        setStats(chatStats.stats || chatStats);
      } catch (err) {
        showToast(
          'Could not fetch workspace communication metrics.',
          'error'
        );
      }
    },
    [showToast]
  );

  const sendNewMessage = useCallback(
    async (teamId, content) => {
      try {
        return await chatService.sendMessage(
          teamId,
          content
        );
      } catch (err) {
        showToast('Message delivery failed.', 'error');
        throw err;
      }
    },
    [showToast]
  );

  const editTeamMessage = useCallback(
    async (teamId, messageId, content) => {
      try {
        await chatService.editMessage(
          teamId,
          messageId,
          content
        );
      } catch (err) {
        showToast(
          'Could not update message content.',
          'error'
        );
        throw err;
      }
    },
    [showToast]
  );

  const deleteTeamMessage = useCallback(
    async (teamId, messageId) => {
      try {
        await chatService.deleteMessage(
          teamId,
          messageId
        );
      } catch (err) {
        showToast('Failed to delete message.', 'error');
        throw err;
      }
    },
    [showToast]
  );

  const reactToTeamMessage = useCallback(
    async (teamId, messageId, reaction) => {
      try {
        await chatService.reactToMessage(
          teamId,
          messageId,
          reaction
        );
      } catch (err) {
        showToast(
          'Failed to process reaction.',
          'error'
        );
      }
    },
    [showToast]
  );

  return (
    <ChatContext.Provider
      value={{
        activeTeamId,
        messages,
        loading,
        stats,
        connected,
        selectTeamRoom,
        sendNewMessage,
        editTeamMessage,
        deleteTeamMessage,
        reactToTeamMessage,
        loadStats
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);

  if (!context) {
    throw new Error(
      'useChat must be used inside a ChatProvider'
    );
  }

  return context;
}