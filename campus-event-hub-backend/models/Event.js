import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, ' Event title is required'],
      trim: true,
      minlength: [3, ' Title must be at least 3 characters'],
      maxlength: [100, ' Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, ' Event description is required'],
      minlength: [10, ' Description must be at least 10 characters'],
      maxlength: [1000, ' Description cannot exceed 1000 characters'],
    },
    eventDate: {
      type: Date,
      required: [true, ' Event date is required'],
      validate: {
        validator: function (v) {
          return v > new Date();
        },
        message: ' Event date must be in the future',
      },
    },
    eventTime: {
      type: String,
      required: [true, ' Event time is required'],
      match: [/^([0-1][0-9]|2[0-3]):([0-5][0-9])$/, ' Invalid time format (HH:MM)'],
    },
    location: {
      type: String,
      required: [true, ' Event location is required'],
      trim: true,
      minlength: [3, ' Location must be at least 3 characters'],
      maxlength: [100, ' Location cannot exceed 100 characters'],
    },
    category: {
      type: String,
      enum: {
        values: [
          'Technical',
          'Sports',
          'Cultural',
          'Academic',
          'Social',
          'Workshop',
          'Seminar',
          'Competition',
          'Other',
        ],
        message: ' Invalid category',
      },
      required: [true, ' Event category is required'],
    },
    capacity: {
      type: Number,
      required: [true, 'Event capacity is required'],
      min: [1, ' Capacity must be at least 1'],
      max: [5000, ' Capacity cannot exceed 5000'],
    },
    requiredSkills: {
      type: [String],
      default: [],
      validate: {
        validator: function (v) {
          return v.length <= 10;
        },
        message: ' Maximum 10 required skills allowed',
      },
    },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: function (v) {
          return v.length <= 10;
        },
        message: ' Maximum 10 tags allowed',
      },
    },
    image: {
      type: String,
      default: null,
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, ' Organizer is required'],
    },
    registeredUsers: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'User',
      default: [],
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    isCancelled: {
      type: Boolean,
      default: false,
    },
    cancellationReason: {
      type: String,
      default: null,
    },
    attendanceCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for available seats
eventSchema.virtual('availableSeats').get(function () {
  return this.capacity - this.registeredUsers.length;
});

// Virtual for is full
eventSchema.virtual('isFull').get(function () {
  return this.registeredUsers.length >= this.capacity;
});

// Index for faster queries
eventSchema.index({ title: 'text', description: 'text' });
eventSchema.index({ eventDate: 1 });
eventSchema.index({ category: 1 });
eventSchema.index({ organizer: 1 });
eventSchema.index({ createdAt: -1 });

// Method to get public event info
eventSchema.methods.getPublicEvent = function () {
  return {
    _id: this._id,
    title: this.title,
    description: this.description,
    eventDate: this.eventDate,
    eventTime: this.eventTime,
    location: this.location,
    category: this.category,
    capacity: this.capacity,
    registeredCount: this.registeredUsers.length,
    availableSeats: this.availableSeats,
    isFull: this.isFull,
    requiredSkills: this.requiredSkills,
    tags: this.tags,
    image: this.image,
    organizer: this.organizer,
    isPublished: this.isPublished,
    isCancelled: this.isCancelled,
    createdAt: this.createdAt,
  };
};

const Event = mongoose.model('Event', eventSchema);
export default Event;