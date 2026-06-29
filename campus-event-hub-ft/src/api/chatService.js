import { io } from 'socket.io-client';
import api from './axios';

let socket = null;

export const chatService = {
initSocket() {
  if (!socket) {

    const token =
      localStorage.getItem('campus_event_hub_token') ||
      localStorage.getItem('token');

    socket = io('https://campus-event-hub-75ml.onrender.com', {
      auth: {
        token
      },
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000
    });

    socket.on('connect', () => {
      console.log('✅ Socket connected:', socket.id);
    });

    socket.on('connect_error', (err) => {
      console.log('❌ Socket Error:', err.message);
    });

    console.log('Socket.io connection established');
  }

  return socket;
},

  getSocket() {
    if (!socket) {
      return this.initSocket();
    }
    return socket;
  },

  joinTeamRoom(teamId) {
    const s = this.getSocket();

    if (s && teamId) {
      s.emit('join_team', teamId);
      console.log('Joined room:', teamId);
    }
  },

  leaveTeamRoom(teamId) {
    const s = this.getSocket();

    if (s && teamId) {
      s.emit('leave_team', teamId);
    }
  },

  disconnect() {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
  },
async getHistory(teamId) {
  const res = await api.get(`/api/chat/${teamId}/history`);

  console.log("📜 Chat History Response:", res.data);

  return Array.isArray(res.data)
    ? res.data
    : res.data.messages || [];
},

  // LIVE MESSAGE SEND
  async sendMessage(teamId, content) {
    const s = this.getSocket();

    if (!s) throw new Error('Socket not connected');

    s.emit('send_message', {
      teamId,
      content
    });

    return true;
  },

  async editMessage(teamId, messageId, content) {
    const s = this.getSocket();

    s.emit('edit_message', {
      teamId,
      messageId,
      content
    });
  },

  async deleteMessage(teamId, messageId) {
    const s = this.getSocket();

    s.emit('delete_message', {
      teamId,
      messageId
    });
  },

  async reactToMessage(teamId, messageId, emoji) {
    const res = await api.post(
      `/api/chat/${teamId}/messages/${messageId}/react`,
      { emoji }
    );

    return res.data;
  },

  async getChatStats(teamId) {
    const res = await api.get(`/api/chat/${teamId}/stats`);
    return res.data;
  }
};