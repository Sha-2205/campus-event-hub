import Message from '../models/Message.js';
import User from '../models/user.js';
import jwt from 'jsonwebtoken';

const activeUsers = new Map();

export const initializeSocket = (io) => {
 
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error('❌ No token provided'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch (error) {
      next(new Error('❌ Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(` User connected: ${socket.userId}`);

    // Join team chat room
    socket.on('join_team', async (teamId) => {
      try {
        const roomName = `team_${teamId}`;
        socket.join(roomName);

    
        const user = await User.findById(socket.userId);

        
        if (!activeUsers.has(roomName)) {
          activeUsers.set(roomName, []);
        }
        const roomUsers = activeUsers.get(roomName);
        if (!roomUsers.find((u) => u._id === socket.userId)) {
          roomUsers.push({
            _id: socket.userId,
            name: user.name,
            profileImage: user.profileImage,
          });
        }

      
        io.to(roomName).emit('user_joined', {
          userId: socket.userId,
          userName: user.name,
          userProfileImage: user.profileImage,
          activeUsers: activeUsers.get(roomName),
        });

        console.log(`✅ ${user.name} joined room: ${roomName}`);
      } catch (error) {
        console.error('Error joining team:', error);
      }
    });

    
    socket.on('leave_team', (teamId) => {
      const roomName = `team_${teamId}`;
      socket.leave(roomName);

      
      const roomUsers = activeUsers.get(roomName);
      if (roomUsers) {
        const userIndex = roomUsers.findIndex((u) => u._id === socket.userId);
        if (userIndex > -1) {
          roomUsers.splice(userIndex, 1);
        }
      }

      io.to(roomName).emit('user_left', {
        userId: socket.userId,
        activeUsers: roomUsers || [],
      });

      console.log(` User ${socket.userId} left room: ${roomName}`);
    });

    
    socket.on('send_message', async (data) => {
      try {
        const { teamId, content } = data;
        const roomName = `team_${teamId}`;

       
        const user = await User.findById(socket.userId);

     
        const message = await Message.create({
          teamId,
          senderId: socket.userId,
          senderName: user.name,
          senderProfileImage: user.profileImage,
          content,
          messageType: 'text',
        });

       
        io.to(roomName).emit('receive_message', {
          _id: message._id,
          teamId,
          senderId: socket.userId,
          senderName: user.name,
          senderProfileImage: user.profileImage,
          content,
          messageType: 'text',
          createdAt: message.createdAt,
        });

        console.log(` Message sent in room: ${roomName}`);
      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('message_error', {
          message: ' Failed to send message',
        });
      }
    });

    
    socket.on('typing', (data) => {
      const { teamId } = data;
      const roomName = `team_${teamId}`;

      socket.to(roomName).emit('user_typing', {
        userId: socket.userId,
        userName: data.userName,
      });
    });

    
    socket.on('stop_typing', (data) => {
      const { teamId } = data;
      const roomName = `team_${teamId}`;

      socket.to(roomName).emit('user_stop_typing', {
        userId: socket.userId,
      });
    });


    socket.on('edit_message', async (data) => {
      try {
        const { messageId, content, teamId } = data;
        const roomName = `team_${teamId}`;

        
        const message = await Message.findByIdAndUpdate(
          messageId,
          {
            content,
            isEdited: true,
            editedAt: new Date(),
          },
          { new: true }
        );

       
        io.to(roomName).emit('message_edited', {
          messageId,
          content,
          isEdited: true,
          editedAt: message.editedAt,
        });

        console.log(` Message edited: ${messageId}`);
      } catch (error) {
        console.error('Error editing message:', error);
      }
    });

    
    socket.on('delete_message', async (data) => {
      try {
        const { messageId, teamId } = data;
        const roomName = `team_${teamId}`;

       
        await Message.findByIdAndUpdate(messageId, {
          isDeleted: true,
        });

        
        io.to(roomName).emit('message_deleted', {
          messageId,
        });

        console.log(`✅ Message deleted: ${messageId}`);
      } catch (error) {
        console.error('Error deleting message:', error);
      }
    });

   
    socket.on('disconnect', () => {
      console.log(`✅ User disconnected: ${socket.userId}`);

      // Remove from all active user lists
      activeUsers.forEach((users, room) => {
        const index = users.findIndex((u) => u._id === socket.userId);
        if (index > -1) {
          users.splice(index, 1);
          io.to(room).emit('user_left', {
            userId: socket.userId,
            activeUsers: users,
          });
        }
      });
    });
  });
};

export { activeUsers };