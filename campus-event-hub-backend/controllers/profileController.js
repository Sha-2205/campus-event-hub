import User from '../models/User.js';


export const getUserProfile = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: ' User not found',
      });
    }

    res.status(200).json({
      success: true,
      user: user.getPublicProfile(),
    });
  } catch (error) {
    next(error);
  }
};


export const getMyProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      user: user.getPublicProfile(),
    });
  } catch (error) {
    next(error);
  }
};


export const updateProfile = async (req, res, next) => {
  try {
    console.log("UPDATE PROFILE BODY:", req.body);

    const { name, bio, department, year, profileImage } = req.body;

    // Find user
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: ' User not found',
      });
    }

    if (name) user.name = name.trim();
    if (bio) user.bio = bio.trim();
    if (department) user.department = department;
    if (year) user.year = parseInt(year);
    if (profileImage) user.profileImage = profileImage;

    await user.save();

    console.log(` Profile updated for user: ${user.email}`);
    res.status(200).json({
      success: true,
      message: ' Profile updated successfully',
      user: user.getPublicProfile(),
    });
  } catch (error) {
    next(error);
  }
};


export const updateSkills = async (req, res, next) => {
  try {
    const { skills } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: ' User not found',
      });
    }

    // Clean and set skills
    user.skills = skills.map((skill) => skill.trim().toLowerCase());

    await user.save();

    console.log(` Skills updated for user: ${user.email}`);
    res.status(200).json({
      success: true,
      message: ' Skills updated successfully',
      skills: user.skills,
    });
  } catch (error) {
    next(error);
  }
};


export const updateInterests = async (req, res, next) => {
  try {
    const { interests } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: ' User not found',
      });
    }

    // Clean and set interests
    user.interests = interests.map((interest) => interest.trim().toLowerCase());

    await user.save();

    console.log(`Interests updated for user: ${user.email}`);
    res.status(200).json({
      success: true,
      message: 'Interests updated successfully',
      interests: user.interests,
    });
  } catch (error) {
    next(error);
  }
};


export const getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, skills, department } = req.query;

    // Build filter object
    const filter = { isActive: true };

    // Search by name or email
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    
    if (department) {
      filter.department = department;
    }

    if (skills) {
      const skillsArray = Array.isArray(skills) ? skills : [skills];
      filter.skills = { $in: skillsArray };
    }

  
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    // Get total count
    const total = await User.countDocuments(filter);

    // Get users
    const users = await User.find(filter)
      .select('-password')
      .limit(limitNum)
      .skip(skip)
      .sort({ createdAt: -1 });

    
    const formattedUsers = users.map((user) => user.getPublicProfile());

    res.status(200).json({
      success: true,
      message: ' Users retrieved successfully',
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum),
      },
      users: formattedUsers,
    });
  } catch (error) {
    next(error);
  }
};


export const searchBySkills = async (req, res, next) => {
  try {
    const { skills, limit = 10 } = req.query;

    if (!skills) {
      return res.status(400).json({
        success: false,
        message: ' Skills parameter is required',
      });
    }

    const skillsArray = Array.isArray(skills) ? skills : [skills];

    const users = await User.find({
      skills: { $in: skillsArray },
      isActive: true,
    })
      .select('-password')
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const formattedUsers = users.map((user) => user.getPublicProfile());

    res.status(200).json({
      success: true,
      message: ' Users found with matching skills',
      count: formattedUsers.length,
      users: formattedUsers,
    });
  } catch (error) {
    next(error);
  }
};


export const getUserStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({ isActive: true });
    const verifiedUsers = await User.countDocuments({ isVerified: true });

    // Get popular skills
    const skillStats = await User.aggregate([
      { $match: { isActive: true } },
      { $unwind: '$skills' },
      { $group: { _id: '$skills', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

   
    const departmentStats = await User.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        verifiedUsers,
        activeUsers: totalUsers,
        popularSkills: skillStats,
        departmentDistribution: departmentStats,
      },
    });
  } catch (error) {
    next(error);
  }
};