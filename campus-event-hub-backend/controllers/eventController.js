import Event from '../models/Event.js';
import User from '../models/user.js';

export const createEvent = async (req, res, next) => {
  try {
    const {
      title,
      description,
      eventDate,
      eventTime,
      location,
      category,
      capacity,
      requiredSkills,
      tags,
      image,
    } = req.body;

    
    const event = await Event.create({
      title,
      description,
      eventDate,
      eventTime,
      location,
      category,
      capacity,
      requiredSkills: requiredSkills || [],
      tags: tags || [],
      image,
      organizer: req.user.id,
    });

    console.log(`Event created: ${title} by ${req.user.id}`);
    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      event: event.getPublicEvent(),
    });
  } catch (error) {
    next(error);
  }
};


export const getAllEvents = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, category, search, sortBy = '-eventDate' } =
      req.query;

  
    const filter = { isPublished: true, isCancelled: false };

    if (category) {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

   
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    // Count total
    const total = await Event.countDocuments(filter);

    // Get events
    const events = await Event.find(filter)
      .populate('organizer', 'name email profileImage')
      .limit(limitNum)
      .skip(skip)
      .sort(sortBy);

    const formattedEvents = events.map((event) => event.getPublicEvent());

    res.status(200).json({
      success: true,
      message: 'Events retrieved successfully',
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum),
      },
      events: formattedEvents,
    });
  } catch (error) {
    next(error);
  }
};


export const getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id).populate(
      'organizer',
      'name email profileImage department'
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    res.status(200).json({
      success: true,
      event: event.getPublicEvent(),
    });
  } catch (error) {
    next(error);
  }
};


export const updateEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      eventDate,
      eventTime,
      location,
      category,
      capacity,
      requiredSkills,
      tags,
      image,
    } = req.body;

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

   
    if (event.organizer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this event',
      });
    }

  
    if (title) event.title = title;
    if (description) event.description = description;
    if (eventDate) event.eventDate = eventDate;
    if (eventTime) event.eventTime = eventTime;
    if (location) event.location = location;
    if (category) event.category = category;
    if (capacity) event.capacity = capacity;
    if (requiredSkills) event.requiredSkills = requiredSkills;
    if (tags) event.tags = tags;
    if (image) event.image = image;

    await event.save();

    console.log(`Event updated: ${event.title}`);
    res.status(200).json({
      success: true,
      message: ' Event updated successfully',
      event: event.getPublicEvent(),
    });
  } catch (error) {
    next(error);
  }
};


export const deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: ' Event not found',
      });
    }

    // Check if user is organizer
    if (event.organizer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: ' Not authorized to delete this event',
      });
    }

    await Event.findByIdAndDelete(req.params.id);

    console.log(` Event deleted: ${event.title}`);
    res.status(200).json({
      success: true,
      message: 'Event deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};


export const registerForEvent = async (req, res, next) => {
  try {
    console.log("=== REGISTER DEBUG ===");
    console.log("Event ID:", req.params.id);
    console.log("User:", req.user);

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: ' Event not found',
      });
    }

    
    if (event.isCancelled) {
      return res.status(400).json({
        success: false,
        message: ' This event has been cancelled',
      });
    }

  
    if (event.registeredUsers.includes(req.user.id)) {
      return res.status(400).json({
        success: false,
        message: ' You are already registered for this event',
      });
    }

  
    if (event.isFull) {
      return res.status(400).json({
        success: false,
        message: ' Event is full. No more registrations allowed',
      });
    }

    
   event.registeredUsers.push(req.user.id);
    await event.save();

    console.log("Saved registeredUsers:", event.registeredUsers);

    console.log(`User registered for event: ${event.title}`);
    res.status(200).json({
      success: true,
      message: ' Registered for event successfully',
      event: event.getPublicEvent(),
    });
  } catch (error) {
    next(error);
  }
};

export const unregisterFromEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

  
    if (!event.registeredUsers.includes(req.user.id)) {
      return res.status(400).json({
        success: false,
        message: ' You are not registered for this event',
      });
    }

    
    event.registeredUsers = event.registeredUsers.filter(
      (userId) => userId.toString() !== req.user.id
    );
    await event.save();

    console.log(` User unregistered from event: ${event.title}`);
    res.status(200).json({
      success: true,
      message: ' Unregistered from event successfully',
      event: event.getPublicEvent(),
    });
  } catch (error) {
    next(error);
  }
};

export const getUserRegisteredEvents = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    // Pagination
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const total = await Event.countDocuments({
      registeredUsers: req.user.id,
      isCancelled: false,
    });
    console.log("Logged in user:", req.user.id);

const testEvents = await Event.find({});
console.log(
  "All events registeredUsers:",
  testEvents.map(e => ({
    title: e.title,
    users: e.registeredUsers
  }))
);

    const events = await Event.find({
      registeredUsers: req.user.id,
      isCancelled: false,
    })
      .populate('organizer', 'name email')
      .limit(limitNum)
      .skip(skip)
      .sort('-eventDate');

    const formattedEvents = events.map((event) => event.getPublicEvent());

    res.status(200).json({
      success: true,
      message: ' Registered events retrieved successfully',
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum),
      },
      events: formattedEvents,
    });
  } catch (error) {
    next(error);
  }
};


export const getEventAttendees = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id).populate(
      'registeredUsers',
      'name email department profileImage'
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: ' Event not found',
      });
    }

    res.status(200).json({
      success: true,
      message: ' Event attendees retrieved successfully',
      attendeeCount: event.registeredUsers.length,
      attendees: event.registeredUsers,
    });
  } catch (error) {
    next(error);
  }
};


export const cancelEvent = async (req, res, next) => {
  try {
    const { cancellationReason } = req.body;
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: ' Event not found',
      });
    }

  
    if (event.organizer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: ' Not authorized to cancel this event',
      });
    }

    event.isCancelled = true;
    event.cancellationReason = cancellationReason;
    await event.save();

    console.log(`Event cancelled: ${event.title}`);
    res.status(200).json({
      success: true,
      message: ' Event cancelled successfully',
      event: event.getPublicEvent(),
    });
  } catch (error) {
    next(error);
  }
};

export const getEventStats = async (req, res, next) => {
  try {
    const totalEvents = await Event.countDocuments({
      isPublished: true,
      isCancelled: false,
    });
    const cancelledEvents = await Event.countDocuments({ isCancelled: true });

   
    const categoryStats = await Event.aggregate([
      { $match: { isPublished: true, isCancelled: false } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    
    const popularEvents = await Event.find({
      isPublished: true,
      isCancelled: false,
    })
      .select('title registeredUsers')
      .sort({ registeredUsers: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      stats: {
        totalEvents,
        cancelledEvents,
        activeEvents: totalEvents - cancelledEvents,
        categoryDistribution: categoryStats,
        popularEvents: popularEvents.map((event) => ({
          title: event.title,
          registeredCount: event.registeredUsers.length,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};