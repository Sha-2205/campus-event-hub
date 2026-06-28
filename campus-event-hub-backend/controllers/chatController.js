import Message from '../models/Message.js';
import Team from '../models/Team.js';
import User from '../models/user.js';

export const getChatHistory = async (req, res, next) => {
  try {
    const { teamId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({
        success: false,
        message: ' Team not found',
      });
    }
    
    if (!team.members.includes(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: ' You are not a member of this team',
      });
    }

   
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    
    const total = await Message.countDocuments({
      teamId,
      isDeleted: false,
    });

    // Get messages
    const messages = await Message.find({
      teamId,
      isDeleted: false,
    })
      .populate('senderId', 'name email profileImage')
      .limit(limitNum)
      .skip(skip)
      .sort('-createdAt');

    const formattedMessages = messages
      .reverse()
      .map((msg) => msg.getPublicMessage());

    res.status(200).json({
      success: true,
      message: 'Chat history retrieved',
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum),
      },
      messages: formattedMessages,
    });
  } catch (error) {
    next(error);
  }
}


export const sendMessage = async (req, res, next) => {
  try {
    const { teamId } = req.params;
    const { content, messageType = 'text' } = req.body;

    // Verify team exists
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found',
      });
    }

    
    if (!team.members.includes(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'You are not a member of this team',
      });
    }

    
    const sender = await User.findById(req.user.id);

    
    const message = await Message.create({
      teamId,
      senderId: req.user.id,
      senderName: sender.name,
      senderProfileImage: sender.profileImage,
      content,
      messageType,
    });

    console.log(` Message sent in team: ${teamId}`);
    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: message.getPublicMessage(),
    });
  } catch (error) {
    next(error);
  }
};


export const editMessage = async (req, res, next) => {
  try {
    const { teamId, messageId } = req.params;
    const { content } = req.body;

   
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({
        success: false,
        message: ' Team not found',
      });
    }

   
    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: ' Message not found',
      });
    }

    
    if (message.senderId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: ' You can only edit your own messages',
      });
    }

   
    message.content = content;
    message.isEdited = true;
    message.editedAt = new Date();
    await message.save();

    console.log(`Message edited: ${messageId}`);
    res.status(200).json({
      success: true,
      message: 'Message edited successfully',
      data: message.getPublicMessage(),
    });
  } catch (error) {
    next(error);
  }
};


export const deleteMessage = async (req, res, next) => {
  try {
    const { teamId, messageId } = req.params;

    // Verify team exists
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({
        success: false,
        message: ' Team not found',
      });
    }

  
    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: ' Message not found',
      });
    }

    
    if (message.senderId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: ' You can only delete your own messages',
      });
    }

    
    message.isDeleted = true;
    await message.save();

    console.log(` Message deleted: ${messageId}`);
    res.status(200).json({
      success: true,
      message: ' Message deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};


export const addReaction = async (req, res, next) => {
  try {
    const { teamId, messageId } = req.params;
    const { emoji } = req.body;

    // Get message
    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: ' Message not found',
      });
    }

   
    const reactionIndex = message.reactions.findIndex(
      (r) => r.emoji === emoji
    );

    if (reactionIndex > -1) {
   
      if (!message.reactions[reactionIndex].users.includes(req.user.id)) {
        message.reactions[reactionIndex].users.push(req.user.id);
      }
    } else {
    
      message.reactions.push({
        emoji,
        users: [req.user.id],
      });
    }

    await message.save();

    console.log(` Reaction added to message: ${messageId}`);
    res.status(200).json({
      success: true,
      message: ' Reaction added',
      data: message.getPublicMessage(),
    });
  } catch (error) {
    next(error);
  }
};


export const getChatStats = async (req, res, next) => {
  try {
    const { teamId } = req.params;

    // Verify team exists
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({
        success: false,
        message: ' Team not found',
      });
    }

    
    const totalMessages = await Message.countDocuments({
      teamId,
      isDeleted: false,
    });

    const messagesByUser = await Message.aggregate([
      {
        $match: { teamId: new mongoose.Types.ObjectId(teamId), isDeleted: false },
      },
      {
        $group: {
          _id: '$senderId',
          count: { $sum: 1 },
          name: { $first: '$senderName' },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    const messagesByDate = await Message.aggregate([
      {
        $match: { teamId: new mongoose.Types.ObjectId(teamId), isDeleted: false },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: -1 } },
      { $limit: 30 },
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalMessages,
        totalMessagesThisWeek: await Message.countDocuments({
          teamId,
          isDeleted: false,
          createdAt: {
            $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        }),
        messagesByUser,
        messagesByDate,
      },
    });
  } catch (error) {
    next(error);
  }
};