import Team from '../models/Team.js';
import User from '../models/user.js';

export const createTeam = async (req, res, next) => {
  try {
    const {
      name,
      description,
      requiredSkills,
      maxMembers,
      tags,
      objective,
      isPublic,
    } = req.body;

    // Check if team name already exists
    const existingTeam = await Team.findOne({ name });
    if (existingTeam) {
      return res.status(400).json({
        success: false,
        message: ' Team name already exists',
      });
    }

    // Create team with leader as member
    const team = await Team.create({
      name,
      description,
      requiredSkills: requiredSkills.map((skill) => skill.toLowerCase()),
      maxMembers,
      tags: tags || [],
      objective: objective || '',
      isPublic: isPublic !== undefined ? isPublic : true,
      leader: req.user.id,
      members: [req.user.id],
    });
    console.log(` Team created: ${name} by ${req.user.id}`);
    res.status(201).json({
      success: true,
      message: ' Team created successfully',
      team: team.getPublicTeam(),
    });
  } catch (error) {
    next(error);
  }
};


export const getAllTeams = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, skills, status = 'active' } =
      req.query;

   
    const filter = { isPublic: true, status };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (skills) {
      const skillsArray = Array.isArray(skills) ? skills : [skills];
      filter.requiredSkills = { $in: skillsArray };
    }

    // Pagination
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    // Count total
    const total = await Team.countDocuments(filter);

    // Get teams
    const teams = await Team.find(filter)
      .populate('leader', 'name email profileImage')
      .limit(limitNum)
      .skip(skip)
      .sort('-createdAt');

    const formattedTeams = teams.map((team) => team.getPublicTeam());

    res.status(200).json({
      success: true,
      message: ' Teams retrieved successfully',
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum),
      },
      teams: formattedTeams,
    });
  } catch (error) {
    next(error);
  }
};


export const getTeamById = async (req, res, next) => {
  try {
    const team = await Team.findById(req.params.id)
      .populate('leader', 'name email profileImage department')
      .populate('members', 'name email profileImage department skills');

    if (!team) {
      return res.status(404).json({
        success: false,
        message: ' Team not found',
      });
    }

    res.status(200).json({
      success: true,
      team: team.getPublicTeam(),
      members: team.members,
    });
  } catch (error) {
    next(error);
  }
};


export const updateTeam = async (req, res, next) => {
  try {
    const { name, description, maxMembers, objective, tags, isPublic } =
      req.body;

    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found',
      });
    }

    
    if (team.leader.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: ' Only team leader can update team',
      });
    }

    
    if (name) {
     
      const existingTeam = await Team.findOne({ name, _id: { $ne: team._id } });
      if (existingTeam) {
        return res.status(400).json({
          success: false,
          message: ' Team name already exists',
        });
      }
      team.name = name;
    }
    if (description) team.description = description;
    if (maxMembers) team.maxMembers = maxMembers;
    if (objective) team.objective = objective;
    if (tags) team.tags = tags;
    if (isPublic !== undefined) team.isPublic = isPublic;

    await team.save();

    console.log(` Team updated: ${team.name}`);
    res.status(200).json({
      success: true,
      message: ' Team updated successfully',
      team: team.getPublicTeam(),
    });
  } catch (error) {
    next(error);
  }
};


export const deleteTeam = async (req, res, next) => {
  try {
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: ' Team not found',
      });
    }

    // Check if user is leader
    if (team.leader.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: ' Only team leader can delete team',
      });
    }

    await Team.findByIdAndDelete(req.params.id);

    console.log(` Team deleted: ${team.name}`);
    res.status(200).json({
      success: true,
      message: 'Team deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};


export const sendJoinRequest = async (req, res, next) => {
  try {
    const { message } = req.body;
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: ' Team not found',
      });
    }

  
    if (team.members.includes(req.user.id)) {
      return res.status(400).json({
        success: false,
        message: ' You are already a member of this team',
      });
    }
    console.log("Team:", team);
console.log("Join Requests:", team.joinRequests);
console.log("User:", req.user);
  const existingRequest = (team.joinRequests || []).find(
  (request) =>
    request.userId &&
    request.userId.toString() === req.user.id &&
    request.status === 'pending'
);

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: ' You have already sent a request to this team',
      });
    }

    
    team.joinRequests.push({
      userId: req.user.id,
      message: message || '',
      status: 'pending',
    });

    await team.save();

    console.log(` Join request sent for team: ${team.name}`);
    res.status(200).json({
      success: true,
      message: ' Join request sent successfully',
      team: team.getPublicTeam(),
    });
  } catch (error) {
    next(error);
  }
};


export const acceptJoinRequest = async (req, res, next) => {
  try {
    const { teamId, userId } = req.params;
    const team = await Team.findById(teamId);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: ' Team not found',
      });
    }

    // Check if user is leader
    if (team.leader.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: ' Only team leader can accept requests',
      });
    }

    if (team.isFull) {
      return res.status(400).json({
        success: false,
        message: ' Team is full. Cannot add more members',
      });
    }

    // Find and update request
    const requestIndex = team.joinRequests.findIndex(
      (req) => req.userId.toString() === userId && req.status === 'pending'
    );

    if (requestIndex === -1) {
      return res.status(404).json({
        success: false,
        message: ' Join request not found',
      });
    }

    team.joinRequests[requestIndex].status = 'accepted';
    team.members.push(userId);
    await team.save();

    console.log(
      ` Join request accepted for team: ${team.name}, user: ${userId}`
    );
    res.status(200).json({
      success: true,
      message: ' Join request accepted',
      team: team.getPublicTeam(),
    });
  } catch (error) {
    next(error);
  }
};


export const rejectJoinRequest = async (req, res, next) => {
  try {
    const { teamId, userId } = req.params;
    const team = await Team.findById(teamId);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: ' Team not found',
      });
    }

    // Check if user is leader
    if (team.leader.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: ' Only team leader can reject requests',
      });
    }

  
    const requestIndex = team.joinRequests.findIndex(
      (req) => req.userId.toString() === userId && req.status === 'pending'
    );

    if (requestIndex === -1) {
      return res.status(404).json({
        success: false,
        message: ' Join request not found',
      });
    }

    team.joinRequests[requestIndex].status = 'rejected';
    await team.save();

    console.log(
      `Join request rejected for team: ${team.name}, user: ${userId}`
    );
    res.status(200).json({
      success: true,
      message: ' Join request rejected',
      team: team.getPublicTeam(),
    });
  } catch (error) {
    next(error);
  }
};


export const getUserTeams = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    // Pagination
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const total = await Team.countDocuments({
      members: req.user.id,
    });

    const teams = await Team.find({
      members: req.user.id,
    })
      .populate('leader', 'name email')
      .limit(limitNum)
      .skip(skip)
      .sort('-createdAt');

    const formattedTeams = teams.map((team) => team.getPublicTeam());

    res.status(200).json({
      success: true,
      message: ' Your teams retrieved successfully',
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum),
      },
      teams: formattedTeams,
    });
  } catch (error) {
    next(error);
  }
};

export const getTeamMembers = async (req, res, next) => {
  try {
    const team = await Team.findById(req.params.id).populate(
      'members',
      'name email profileImage department skills'
    );

    if (!team) {
      return res.status(404).json({
        success: false,
        message: ' Team not found',
      });
    }

    res.status(200).json({
      success: true,
      message: ' Team members retrieved',
      memberCount: team.members.length,
      members: team.members,
    });
  } catch (error) {
    next(error);
  }
};


export const removeMember = async (req, res, next) => {
  try {
    const { teamId, userId } = req.params;
    const team = await Team.findById(teamId);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: ' Team not found',
      });
    }

    // Check if user is leader
    if (team.leader.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: ' Only team leader can remove members',
      });
    }

    // Cannot remove leader
    if (team.leader.toString() === userId) {
      return res.status(400).json({
        success: false,
        message: ' Cannot remove team leader',
      });
    }

    // Check if member exists
    if (!team.members.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: '❌ User is not a member of this team',
      });
    }

    await team.removeMember(userId);

    console.log(` Member removed from team: ${team.name}`);
    res.status(200).json({
      success: true,
      message: ' Member removed successfully',
      team: team.getPublicTeam(),
    });
  } catch (error) {
    next(error);
  }
};


export const findUsersBySkills = async (req, res, next) => {
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
      .select('name email profileImage department skills')
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      message: 'Users found with matching skills',
      count: users.length,
      users: users.map((user) => ({
        _id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
        department: user.department,
        skills: user.skills,
      })),
    });
  } catch (error) {
    next(error);
  }
};


export const getTeamStats = async (req, res, next) => {
  try {
    const totalTeams = await Team.countDocuments({ status: 'active' });
    const totalMembers = await Team.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: null, totalMembers: { $sum: { $size: '$members' } } } },
    ]);

    // Get popular skills required
    const skillStats = await Team.aggregate([
      { $match: { status: 'active' } },
      { $unwind: '$requiredSkills' },
      { $group: { _id: '$requiredSkills', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    
    const largestTeams = await Team.find({ status: 'active' })
      .select('name members')
      .sort({ 'members': -1 })
      .limit(5)
      .lean();

    res.status(200).json({
      success: true,
      stats: {
        totalTeams,
        totalMembers: totalMembers[0]?.totalMembers || 0,
        averageMembersPerTeam:
          totalMembers[0]?.totalMembers && totalTeams
            ? Math.round(totalMembers[0].totalMembers / totalTeams)
            : 0,
        popularSkills: skillStats,
        largestTeams: largestTeams.map((team) => ({
          name: team.name,
          memberCount: team.members.length,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};


export const getPendingRequests = async (req, res, next) => {
  try {
    const team = await Team.findById(req.params.id).populate(
      'joinRequests.userId',
      'name email profileImage department skills'
    );

    if (!team) {
      return res.status(404).json({
        success: false,
        message: ' Team not found',
      });
    }

    // Check if user is leader
    if (team.leader.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Only team leader can view requests',
      });
    }

    const pendingRequests = team.joinRequests.filter(
      (req) => req.status === 'pending'
    );

    res.status(200).json({
      success: true,
      message: ' Pending requests retrieved',
      count: pendingRequests.length,
      requests: pendingRequests,
    });
  } catch (error) {
    next(error);
  }
};