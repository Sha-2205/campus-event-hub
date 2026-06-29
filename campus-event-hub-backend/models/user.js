import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, ' Please provide a name'],
      trim: true,
      minlength: [2, ' Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, ' Password must be at least 6 characters'],
      select: false, // Don't return password by default
    },
    department: {
      type: String,
      enum: {
        values: ['CSE', 'ECE', 'ME', 'CE', 'EE', 'BIOTECH', 'OTHER'],
        message: 'Invalid department',
      },
      required: [true, ' Please specify your department'],
    },
    year: {
      type: Number,
      enum: {
        values: [1, 2, 3, 4],
        message: ' Year must be 1, 2, 3, or 4',
      },
      required: [true, ' Please specify your year'],
    },
    skills: {
      type: [String],
      default: [],
      validate: {
        validator: function (v) {
          return v.length <= 10;
        },
        message: 'You can add a maximum of 10 skills',
      },
    },
    interests: {
      type: [String],
      default: [],
      validate: {
        validator: function (v) {
          return v.length <= 10;
        },
        message: 'You can add a maximum of 10 interests',
      },
    },
    bio: {
      type: String,
      maxlength: [500, ' Bio cannot exceed 500 characters'],
      default: '',
      trim: true,
    },
    profileImage: {
      type: String,
      default: null,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);


userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};


userSchema.methods.getLoginProfile = function () {
  return {
    _id: this._id,
    name: this.name,
    email: this.email,
    department: this.department,
    year: this.year,
  };
};


userSchema.methods.getPublicProfile = function () {
  return {
    _id: this._id,
    name: this.name,
    email: this.email,
    department: this.department,
    year: this.year,
    skills: this.skills,
    interests: this.interests,
    bio: this.bio,
    profileImage: this.profileImage,
    isVerified: this.isVerified,
  };
};



userSchema.index({ createdAt: -1 });
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;