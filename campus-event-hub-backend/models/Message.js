import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      required: [true, ' Team ID is required'],
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, ' Sender ID is required'],
    },
    senderName: {
      type: String,
      required: [true, ' Sender name is required'],
    },
    senderProfileImage: {
      type: String,
      default: null,
    },
    content: {
      type: String,
      required: [true, ' Message content is required'],
      trim: true,
      minlength: [1, 'Message cannot be empty'],
      maxlength: [1000, ' Message cannot exceed 1000 characters'],
    },
    messageType: {
      type: String,
      enum: ['text', 'image', 'file', 'system'],
      default: 'text',
    },
    attachments: {
      type: [
        {
          url: String,
          type: String, // 'image', 'file', etc
          name: String,
        },
      ],
      default: [],
    },
    isEdited: {
      type: Boolean,
      default: false,
    },
    editedAt: {
      type: Date,
      default: null,
    },
    reactions: {
      type: [
        {
          emoji: String,
          users: [mongoose.Schema.Types.ObjectId],
        },
      ],
      default: [],
    },
    readBy: {
      type: [mongoose.Schema.Types.ObjectId],
      default: [],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);


messageSchema.index({ teamId: 1, createdAt: -1 });
messageSchema.index({ senderId: 1 });
messageSchema.index({ createdAt: -1 });


messageSchema.methods.getPublicMessage = function () {
  return {
    _id: this._id,
    teamId: this.teamId,
    senderId: this.senderId,
    senderName: this.senderName,
    senderProfileImage: this.senderProfileImage,
    content: this.content,
    messageType: this.messageType,
    attachments: this.attachments,
    isEdited: this.isEdited,
    editedAt: this.editedAt,
    reactions: this.reactions,
    readBy: this.readBy,
    createdAt: this.createdAt,
  };
};

const Message = mongoose.model('Message', messageSchema);
export default Message;