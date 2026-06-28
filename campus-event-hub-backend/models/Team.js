import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, ' Team name is required'],
      trim: true,
      minlength: [3, ' Team name must be at least 3 characters'],
      maxlength: [50, ' Team name cannot exceed 50 characters'],
      unique: true,
    },
    description: {
      type: String,
      required: [true, ' Team description is required'],
      minlength: [10, ' Description must be at least 10 characters'],
      maxlength: [500, ' Description cannot exceed 500 characters'],
    },
    requiredSkills: {
      type: [String],
      required: [true, ' Required skills must be specified'],
      validate: {
        validator: function (v) {
          return v.length >= 1 && v.length <= 10;
        },
        message: 'Team must require between 1 and 10 skills',
      },
    },
    maxMembers: {
      type: Number,
      required: [true, ' Maximum members is required'],
      min: [2, 'Team must have at least 2 members'],
      max: [20, ' Team cannot exceed 20 members'],
    },
    leader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, ' Team leader is required'],
    },
    members: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'User',
      default: [],
      validate: {
        validator: function (v) {
          return v.length <= this.maxMembers;
        },
        message: 'Team members cannot exceed max members',
      },
    },
    joinRequests: {
      type: [
        {
          userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
          },
          status: {
            type: String,
            enum: ['pending', 'accepted', 'rejected'],
            default: 'pending',
          },
          message: {
            type: String,
            maxlength: 200,
          },
          requestedAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],
      default: [],
    },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: function (v) {
          return v.length <= 10;
        },
        message: 'Maximum 10 tags allowed',
      },
    },
    objective: {
      type: String,
      maxlength: [300, 'Objective cannot exceed 300 characters'],
      default: '',
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'completed'],
      default: 'active',
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

teamSchema.virtual('availableSeats').get(function () {
  return this.maxMembers - this.members.length;
});

teamSchema.virtual('isFull').get(function () {
  return this.members.length >= this.maxMembers;
});


teamSchema.virtual('pendingRequestsCount').get(function () {
  return this.joinRequests.filter((req) => req.status === 'pending').length;
});

teamSchema.index({ name: 'text', description: 'text' });
teamSchema.index({ requiredSkills: 1 });
teamSchema.index({ leader: 1 });
teamSchema.index({ status: 1 });
teamSchema.index({ createdAt: -1 });


teamSchema.methods.getPublicTeam = function () {
  return {
    _id: this._id,
    name: this.name,
    description: this.description,
    requiredSkills: this.requiredSkills,
    maxMembers: this.maxMembers,
    memberCount: this.members.length,
    availableSeats: this.availableSeats,
    isFull: this.isFull,
    leader: this.leader,
    tags: this.tags,
    objective: this.objective,
    status: this.status,
    isPublic: this.isPublic,
    pendingRequestsCount: this.pendingRequestsCount,
    createdAt: this.createdAt,
  };
};


teamSchema.methods.addMember = async function (userId) {
  if (!this.members.includes(userId)) {
    this.members.push(userId);
  }
  return await this.save();
};


teamSchema.methods.removeMember = async function (userId) {
  this.members = this.members.filter(
    (memberId) => memberId.toString() !== userId.toString()
  );
  return await this.save();
};

const Team = mongoose.model('Team', teamSchema);
export default Team;