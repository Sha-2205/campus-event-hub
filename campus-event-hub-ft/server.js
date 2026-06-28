import express from 'express';
import fs from 'fs';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { Server } from 'socket.io';

const PORT = 3000;
const DB_FILE = path.join(process.cwd(), 'db.json');

// --- DATABASE STATE & PERSISTENCE HELPER ---
const DEFAULT_DB = {
  users: [
    {
      id: 'user1',
      email: 'harshavivek05@gmail.com',
      password: 'password', // For simple authentication in campus environment
      name: 'Harsha Vivek',
      major: 'Computer Science & AI',
      bio: 'Full-stack builder passionate about campus communities, hackathons, and web automation.',
      skills: ['React', 'JavaScript', 'Tailwind CSS', 'Node.js', 'Express', 'APIs'],
      interests: ['Hackathons', 'Artificial Intelligence', 'Product Design', 'Open Source'],
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 'user2',
      email: 'sarah.smith@campus.edu',
      password: 'password',
      name: 'Sarah Smith',
      major: 'Software Engineering',
      bio: 'Junior CS student focusing on frontend UX/UI and reactive web ecosystems.',
      skills: ['React', 'Figma', 'UI Design', 'CSS', 'JavaScript'],
      interests: ['Hackathons', 'UX Design', 'Campus Meetups', 'Gaming'],
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 'user3',
      email: 'alex.jones@campus.edu',
      password: 'password',
      name: 'Alex Jones',
      major: 'Data Science',
      bio: 'Data analyst and python developer. Love extracting insights from student activity metrics.',
      skills: ['Python', 'SQL', 'Data Analytics', 'Pandas', 'Machine Learning'],
      interests: ['AI & Ethics', 'Statistics', 'Hackathons', 'Board Games'],
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 'user4',
      email: 'emily.chen@campus.edu',
      password: 'password',
      name: 'Emily Chen',
      major: 'Digital Media & Design',
      bio: 'Creative designer specializing in responsive visuals, branding, and motion design.',
      skills: ['Figma', 'Illustrator', 'Branding', 'CSS Animations', 'Typography'],
      interests: ['Product Design', 'Digital Art', 'Campus Arts', 'Photography'],
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 'user5',
      email: 'marcus.vance@campus.edu',
      password: 'password',
      name: 'Marcus Vance',
      major: 'Cybersecurity',
      bio: 'Ethical hacker and server admin. I run local servers and protect network pipelines.',
      skills: ['Linux', 'Docker', 'Network Security', 'Node.js', 'PostgreSQL'],
      interests: ['Cybersecurity', 'Open Source', 'Self-Hosting', 'DevOps'],
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
    }
  ],
  events: [
    {
      id: 'event1',
      title: 'Mega Campus Hackathon 2026',
      description: 'The ultimate 48-hour student sprint! Form dynamic cross-disciplinary teams, build innovative web/mobile apps, pitch to top judges, and win up to $5,000 in gear and cash.',
      creatorId: 'user2',
      date: '2026-07-15T09:00:00.000Z',
      location: 'Innovation Hall, Main Campus',
      category: 'Technology',
      capacity: 150,
      registeredUsers: ['user1', 'user2', 'user3', 'user4'],
      cancelled: false
    },
    {
      id: 'event2',
      title: 'AI Engineering Workshop: Gemini API',
      description: 'Learn to leverage Google\'s advanced generative AI SDK directly inside your full-stack applications. Hands-on coding of conversational interfaces, function calling, and multimodality.',
      creatorId: 'user1',
      date: '2026-07-02T14:00:00.000Z',
      location: 'Science Center, Auditorium B',
      category: 'Workshop',
      capacity: 80,
      registeredUsers: ['user1', 'user3', 'user5'],
      cancelled: false
    },
    {
      id: 'event3',
      title: 'Campus Design Sprint: UI Redesign',
      description: 'A dedicated interactive sprint to pitch modern user interface concepts for our university student dashboard. Work closely with product design mentors and present interactive Figma wireframes.',
      creatorId: 'user4',
      date: '2026-07-10T10:00:00.000Z',
      location: 'Arts Annex, Room 204',
      category: 'Design',
      capacity: 40,
      registeredUsers: ['user4', 'user1'],
      cancelled: false
    },
    {
      id: 'event4',
      title: 'Cybersecurity Capture the Flag (CTF)',
      description: 'Test your security skills in a 6-hour Jeopardy-style hacking event! Categories include reverse engineering, web exploitation, digital forensics, and cryptography.',
      creatorId: 'user5',
      date: '2026-07-22T12:00:00.000Z',
      location: 'Tech Lab 12',
      category: 'Competition',
      capacity: 60,
      registeredUsers: ['user5', 'user1', 'user3'],
      cancelled: false
    }
  ],
  teams: [
    {
      id: 'team1',
      name: 'Byte Busters',
      eventId: 'event1',
      description: 'Building a intelligent student campus navigator using React, Tailwind CSS, and full-stack API integration. Seeking a dedicated developer with design sensibilities!',
      creatorId: 'user2',
      members: ['user2', 'user3'],
      pendingRequests: ['user1', 'user4']
    },
    {
      id: 'team2',
      name: 'Creative Pioneers',
      eventId: 'event1',
      description: 'Design-led squad building a high-fidelity mockup of the future student event space. Focused on interactive wireframes, custom graphics, and smooth motion layout animations.',
      creatorId: 'user4',
      members: ['user4'],
      pendingRequests: []
    },
    {
      id: 'team3',
      name: 'AI Scheduler Labs',
      eventId: 'event2',
      description: 'Developing highly tailored automated calendar and task recommendation algorithms utilizing Gemini API model chains.',
      creatorId: 'user1',
      members: ['user1', 'user5'],
      pendingRequests: []
    }
  ],
  chat: {
    'team1': [
      { id: 'msg1', senderId: 'user2', senderName: 'Sarah Smith', senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face', content: 'Hey team! Welcome to the Byte Busters workspace. Excited to build this project with you!', timestamp: '2026-06-24T09:00:00.000Z', reactions: { '👍': ['user3'] } },
      { id: 'msg2', senderId: 'user3', senderName: 'Alex Jones', senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', content: 'Hey Sarah! Excited as well. I have some initial database schemas ready for our backend. We should secure some frontend assistance though!', timestamp: '2026-06-24T09:05:00.000Z', reactions: { '🔥': ['user2'] } },
      { id: 'msg3', senderId: 'user2', senderName: 'Sarah Smith', senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face', content: 'Definitely. I saw a couple of pending requests in the dashboard. Let\'s evaluate them after class!', timestamp: '2026-06-24T09:10:00.000Z', reactions: {} }
    ],
    'team2': [
      { id: 'msg1', senderId: 'user4', senderName: 'Emily Chen', senderAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face', content: 'Starting the UX design research deck here. Feel free to join!', timestamp: '2026-06-24T10:00:00.000Z', reactions: {} }
    ],
    'team3': [
      { id: 'msg1', senderId: 'user1', senderName: 'Harsha Vivek', senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face', content: 'Hey Marcus, welcome! Let\'s map out how we\'re configuring the Gemini developer API key.', timestamp: '2026-06-24T08:30:00.000Z', reactions: { '👍': ['user5'] } },
      { id: 'msg2', senderId: 'user5', senderName: 'Marcus Vance', senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face', content: 'Perfect. I will setup a node proxy on port 3000 so the credentials never leak client-side.', timestamp: '2026-06-24T08:35:00.000Z', reactions: { '❤️': ['user1'] } }
    ]
  }
};

// Sync database state from memory to db.json
function loadDatabase() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Failed to load local DB, falling back to mock data:", err);
  }
  fs.writeFileSync(DB_FILE, JSON.stringify(DEFAULT_DB, null, 2), 'utf8');
  return JSON.parse(JSON.stringify(DEFAULT_DB));
}

let db = loadDatabase();
if (!db.sessions) {
  db.sessions = {};
  saveDatabase();
}

function saveDatabase() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
  } catch (err) {
    console.error("Failed to persist DB to file:", err);
  }
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // Simple Mock Session Store from persisted database
  let sessions = db.sessions;

  // Middlewares
  const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    let userId = sessions[token];
    if (!userId && token && token.startsWith('session_user_')) {
      const parts = token.split('_');
      if (parts.length >= 3) {
        const potentialUserId = parts[1] + '_' + parts[2];
        const exists = db.users.some(u => u.id === potentialUserId);
        if (exists) {
          userId = potentialUserId;
          sessions[token] = userId;
          saveDatabase();
        }
      }
    }

    if (!userId) {
      return res.status(403).json({ message: 'Session expired or invalid' });
    }
    
    req.user = db.users.find(u => u.id === userId);
    if (!req.user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    next();
  };

  // ==========================================
  // AUTH MODULE
  // ==========================================

  // POST /api/auth/register
  app.post('/api/auth/register', (req, res) => {
    const { email, password, name, major } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Missing required parameters: email, password, name' });
    }

    const exists = db.users.some(u => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const newUser = {
      id: 'user_' + Date.now(),
      email,
      password,
      name,
      major: major || 'Undeclared',
      bio: '',
      skills: [],
      interests: [],
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face`
    };

    db.users.push(newUser);
    const token = 'session_' + newUser.id + '_' + Math.random().toString(36).substr(2, 10);
    sessions[token] = newUser.id;
    saveDatabase();

    res.status(201).json({ token, user: { id: newUser.id, email: newUser.email, name: newUser.name, major: newUser.major } });
  });

  // POST /api/auth/login
  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials. Please try again.' });
    }

    const token = 'session_' + user.id + '_' + Math.random().toString(36).substr(2, 10);
    sessions[token] = user.id;
    saveDatabase();

    res.json({ token, user: { id: user.id, email: user.email, name: user.name, major: user.major } });
  });

  // POST /api/auth/logout
  app.post('/api/auth/logout', (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token) {
      delete sessions[token];
      saveDatabase();
    }
    res.json({ message: 'Logged out successfully' });
  });

  // GET /api/auth/me
  app.get('/api/auth/me', authenticateToken, (req, res) => {
    res.json({ user: { id: req.user.id, email: req.user.email, name: req.user.name, major: req.user.major } });
  });

  // ==========================================
  // PROFILE MODULE
  // ==========================================

  // GET /api/profile/users/all
  app.get('/api/profile/users/all', authenticateToken, (req, res) => {
    const safeUsers = db.users.map(({ password, ...rest }) => rest);
    res.json(safeUsers);
  });

  // GET /api/profile/me/profile
  app.get('/api/profile/me/profile', authenticateToken, (req, res) => {
    res.json(req.user);
  });

  // PUT /api/profile/update
  app.put('/api/profile/update', authenticateToken, (req, res) => {
    const { name, major, bio, avatar } = req.body;
    const user = db.users.find(u => u.id === req.user.id);
    if (name) user.name = name;
    if (major !== undefined) user.major = major;
    if (bio !== undefined) user.bio = bio;
    if (avatar) user.avatar = avatar;

    saveDatabase();
    res.json(user);
  });

  // PUT /api/profile/skills
  app.put('/api/profile/skills', authenticateToken, (req, res) => {
    const { skills } = req.body;
    if (!Array.isArray(skills)) {
      return res.status(400).json({ message: 'skills must be an array' });
    }
    const user = db.users.find(u => u.id === req.user.id);
    user.skills = skills;
    saveDatabase();
    res.json(user);
  });

  // PUT /api/profile/interests
  app.put('/api/profile/interests', authenticateToken, (req, res) => {
    const { interests } = req.body;
    if (!Array.isArray(interests)) {
      return res.status(400).json({ message: 'interests must be an array' });
    }
    const user = db.users.find(u => u.id === req.user.id);
    user.interests = interests;
    saveDatabase();
    res.json(user);
  });

  // GET /api/profile/search/skills
  app.get('/api/profile/search/skills', authenticateToken, (req, res) => {
    const query = req.query.query ? req.query.query.toString().toLowerCase() : '';
    if (!query) {
      return res.json([]);
    }
    const matchingUsers = db.users.filter(u => 
      u.skills.some(s => s.toLowerCase().includes(query))
    ).map(({ password, ...rest }) => rest);
    res.json(matchingUsers);
  });

  // GET /api/profile/stats
  app.get('/api/profile/stats', authenticateToken, (req, res) => {
    // Total users count, highly-demanded skills, interests breakdown
    const totalUsers = db.users.length;
    const allSkills = db.users.flatMap(u => u.skills);
    const skillCounts = {};
    allSkills.forEach(s => { skillCounts[s] = (skillCounts[s] || 0) + 1; });
    const topSkills = Object.entries(skillCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const allInterests = db.users.flatMap(u => u.interests);
    const interestCounts = {};
    allInterests.forEach(i => { interestCounts[i] = (interestCounts[i] || 0) + 1; });
    const topInterests = Object.entries(interestCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    res.json({ totalUsers, topSkills, topInterests });
  });

  // GET /api/profile/:id
  app.get('/api/profile/:id', authenticateToken, (req, res) => {
    const user = db.users.find(u => u.id === req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User profile not found' });
    }
    const { password, ...safeProfile } = user;
    res.json(safeProfile);
  });

  // ==========================================
  // EVENTS MODULE
  // ==========================================

  // GET /api/events
  app.get('/api/events', authenticateToken, (req, res) => {
    const filterCategory = req.query.category;
    let list = db.events;
    if (filterCategory) {
      list = list.filter(e => e.category.toLowerCase() === filterCategory.toString().toLowerCase());
    }
    res.json(list);
  });

  // GET /api/events/user/registered
  app.get('/api/events/user/registered', authenticateToken, (req, res) => {
    const registered = db.events.filter(e => e.registeredUsers.includes(req.user.id));
    res.json(registered);
  });

  // GET /api/events/stats/dashboard
  app.get('/api/events/stats/dashboard', authenticateToken, (req, res) => {
    const activeEvents = db.events.filter(e => !e.cancelled).length;
    const registrationsCount = db.events.reduce((acc, e) => acc + e.registeredUsers.length, 0);
    const categoriesCount = {};
    db.events.forEach(e => {
      categoriesCount[e.category] = (categoriesCount[e.category] || 0) + 1;
    });
    res.json({ activeEvents, registrationsCount, categories: categoriesCount });
  });

  // GET /api/events/:id
  app.get('/api/events/:id', authenticateToken, (req, res) => {
    const event = db.events.find(e => e.id === req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  });

  // POST /api/events/create
  app.post('/api/events/create', authenticateToken, (req, res) => {
    const { title, description, date, location, category, capacity } = req.body;
    if (!title || !description || !date || !location || !category) {
      return res.status(400).json({ message: 'All parameters are required except capacity.' });
    }

    const newEvent = {
      id: 'event_' + Date.now(),
      title,
      description,
      creatorId: req.user.id,
      date,
      location,
      category,
      capacity: Number(capacity) || 100,
      registeredUsers: [req.user.id],
      cancelled: false
    };

    db.events.push(newEvent);
    saveDatabase();
    res.status(201).json(newEvent);
  });

  // PUT /api/events/:id
  app.put('/api/events/:id', authenticateToken, (req, res) => {
    const event = db.events.find(e => e.id === req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    if (event.creatorId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized. Only event creator can modify.' });
    }

    const { title, description, date, location, category, capacity } = req.body;
    if (title) event.title = title;
    if (description) event.description = description;
    if (date) event.date = date;
    if (location) event.location = location;
    if (category) event.category = category;
    if (capacity) event.capacity = Number(capacity);

    saveDatabase();
    res.json(event);
  });

  // DELETE /api/events/:id
  app.delete('/api/events/:id', authenticateToken, (req, res) => {
    const index = db.events.findIndex(e => e.id === req.params.id);
    if (index === -1) return res.status(404).json({ message: 'Event not found' });
    if (db.events[index].creatorId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized.' });
    }
    db.events.splice(index, 1);
    saveDatabase();
    res.json({ message: 'Event deleted successfully.' });
  });

  // POST /api/events/:id/register
  app.post('/api/events/:id/register', authenticateToken, (req, res) => {
    const event = db.events.find(e => e.id === req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    if (event.cancelled) return res.status(400).json({ message: 'Cannot register for a cancelled event.' });

    if (event.registeredUsers.includes(req.user.id)) {
      return res.json(event); // already registered
    }

    if (event.registeredUsers.length >= event.capacity) {
      return res.status(400).json({ message: 'Event is fully booked.' });
    }

    event.registeredUsers.push(req.user.id);
    saveDatabase();
    res.json(event);
  });

  // POST /api/events/:id/unregister
  app.post('/api/events/:id/unregister', authenticateToken, (req, res) => {
    const event = db.events.find(e => e.id === req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    
    event.registeredUsers = event.registeredUsers.filter(u => u !== req.user.id);
    saveDatabase();
    res.json(event);
  });

  // GET /api/events/:id/attendees
  app.get('/api/events/:id/attendees', authenticateToken, (req, res) => {
    const event = db.events.find(e => e.id === req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    
    const attendees = db.users.filter(u => event.registeredUsers.includes(u.id))
      .map(({ password, ...rest }) => rest);
    res.json(attendees);
  });

  // POST /api/events/:id/cancel
  app.post('/api/events/:id/cancel', authenticateToken, (req, res) => {
    const event = db.events.find(e => e.id === req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    if (event.creatorId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized.' });
    }
    event.cancelled = true;
    saveDatabase();
    res.json(event);
  });

  // ==========================================
  // TEAMS MODULE
  // ==========================================

  // GET /api/teams
  app.get('/api/teams', authenticateToken, (req, res) => {
    const eventId = req.query.eventId;
    let list = db.teams;
    if (eventId) {
      list = list.filter(t => t.eventId === eventId);
    }
    res.json(list);
  });

  // GET /api/teams/user/my-teams
  app.get('/api/teams/user/my-teams', authenticateToken, (req, res) => {
    const myTeams = db.teams.filter(t => t.members.includes(req.user.id));
    res.json(myTeams);
  });

  // GET /api/teams/stats/dashboard
  app.get('/api/teams/stats/dashboard', authenticateToken, (req, res) => {
    const totalTeams = db.teams.length;
    const avgTeamSize = totalTeams > 0 
      ? Number((db.teams.reduce((acc, t) => acc + t.members.length, 0) / totalTeams).toFixed(1))
      : 0;
    res.json({ totalTeams, avgTeamSize });
  });

  // GET /api/teams/find-users/by-skills
  app.get('/api/teams/find-users/by-skills', authenticateToken, (req, res) => {
    // Return sorted list of users based on matching skills
    const user = db.users.find(u => u.id === req.user.id);
    if (!user) return res.json([]);

    const mySkills = user.skills || [];
    
    // Sort other users by overlap with current user's skills
    const matchResults = db.users
      .filter(u => u.id !== user.id)
      .map(u => {
        const overlap = u.skills.filter(s => mySkills.some(ms => ms.toLowerCase() === s.toLowerCase())).length;
        const { password, ...safeUser } = u;
        return { ...safeUser, matchCount: overlap };
      })
      .sort((a, b) => b.matchCount - a.matchCount);

    res.json(matchResults);
  });

  // GET /api/teams/:id
  app.get('/api/teams/:id', authenticateToken, (req, res) => {
    const team = db.teams.find(t => t.id === req.params.id);
    if (!team) return res.status(404).json({ message: 'Team not found' });
    res.json(team);
  });

  // POST /api/teams/create
  app.post('/api/teams/create', authenticateToken, (req, res) => {
    const { name, eventId, description, capacity, requiredSkills, tags, objective } = req.body;
    if (!name || !eventId) {
      return res.status(400).json({ message: 'Name and EventId are required.' });
    }

    const parseArray = (val) => {
      if (Array.isArray(val)) return val.map(s => String(s).trim()).filter(Boolean);
      if (typeof val === 'string') return val.split(',').map(s => s.trim()).filter(Boolean);
      return [];
    };

    const newTeam = {
      id: 'team_' + Date.now(),
      name,
      eventId,
      description: description || '',
      creatorId: req.user.id,
      members: [req.user.id],
      pendingRequests: [],
      capacity: Number(capacity) || 5,
      requiredSkills: parseArray(requiredSkills),
      tags: parseArray(tags),
      objective: typeof objective === 'string' ? objective.trim() : ''
    };

    db.teams.push(newTeam);
    
    // Auto-create chat buffer
    db.chat[newTeam.id] = [
      {
        id: 'welcome_' + Date.now(),
        senderId: 'system',
        senderName: 'System Bot',
        senderAvatar: '',
        content: `Team "${name}" workspace has been initialized. Welcome to the chat room!`,
        timestamp: new Date().toISOString(),
        reactions: {}
      }
    ];

    saveDatabase();
    res.status(201).json(newTeam);
  });

  // PUT /api/teams/:id
  app.put('/api/teams/:id', authenticateToken, (req, res) => {
    const team = db.teams.find(t => t.id === req.params.id);
    if (!team) return res.status(404).json({ message: 'Team not found' });
    if (team.creatorId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized. Only team leads can edit.' });
    }

    const { name, eventId, description, capacity, requiredSkills, tags, objective } = req.body;
    
    const parseArray = (val) => {
      if (Array.isArray(val)) return val.map(s => String(s).trim()).filter(Boolean);
      if (typeof val === 'string') return val.split(',').map(s => s.trim()).filter(Boolean);
      return [];
    };

    if (name) team.name = name;
    if (eventId) team.eventId = eventId;
    if (description) team.description = description;
    if (capacity !== undefined) team.capacity = Number(capacity) || 5;
    if (requiredSkills !== undefined) team.requiredSkills = parseArray(requiredSkills);
    if (tags !== undefined) team.tags = parseArray(tags);
    if (objective !== undefined) team.objective = typeof objective === 'string' ? objective.trim() : '';

    saveDatabase();
    res.json(team);
  });

  // DELETE /api/teams/:id
  app.delete('/api/teams/:id', authenticateToken, (req, res) => {
    const index = db.teams.findIndex(t => t.id === req.params.id);
    if (index === -1) return res.status(404).json({ message: 'Team not found' });
    if (db.teams[index].creatorId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized.' });
    }

    delete db.chat[db.teams[index].id];
    db.teams.splice(index, 1);
    saveDatabase();
    res.json({ message: 'Team deleted successfully.' });
  });

  // POST /api/teams/:id/request-join
  app.post('/api/teams/:id/request-join', authenticateToken, (req, res) => {
    const team = db.teams.find(t => t.id === req.params.id);
    if (!team) return res.status(404).json({ message: 'Team not found' });
    
    if (team.members.includes(req.user.id)) {
      return res.status(400).json({ message: 'You are already a member of this team.' });
    }

    if (team.members.length >= (team.capacity || 5)) {
      return res.status(400).json({ message: 'This team is already at maximum capacity.' });
    }

    if (team.pendingRequests.includes(req.user.id)) {
      return res.json({ message: 'Join request already pending.', team });
    }

    team.pendingRequests.push(req.user.id);
    saveDatabase();
    res.json(team);
  });

  // POST /api/teams/:teamId/accept-request/:userId
  app.post('/api/teams/:teamId/accept-request/:userId', authenticateToken, (req, res) => {
    const team = db.teams.find(t => t.id === req.params.teamId);
    if (!team) return res.status(404).json({ message: 'Team not found' });
    if (team.creatorId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized. Only team leads can approve requests.' });
    }

    if (team.members.length >= (team.capacity || 5)) {
      return res.status(400).json({ message: 'Team has reached its maximum member capacity limit.' });
    }

    // Remove from pending
    team.pendingRequests = team.pendingRequests.filter(uid => uid !== req.params.userId);
    
    // Add to members
    if (!team.members.includes(req.params.userId)) {
      team.members.push(req.params.userId);
    }

    // Push system message
    const approvedUser = db.users.find(u => u.id === req.params.userId);
    if (approvedUser) {
      db.chat[team.id].push({
        id: 'sys_' + Date.now(),
        senderId: 'system',
        senderName: 'System Bot',
        senderAvatar: '',
        content: `${approvedUser.name} has joined the team!`,
        timestamp: new Date().toISOString(),
        reactions: {}
      });
    }

    saveDatabase();
    res.json(team);
  });

  // POST /api/teams/:teamId/reject-request/:userId
  app.post('/api/teams/:teamId/reject-request/:userId', authenticateToken, (req, res) => {
    const team = db.teams.find(t => t.id === req.params.teamId);
    if (!team) return res.status(404).json({ message: 'Team not found' });
    if (team.creatorId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized.' });
    }

    team.pendingRequests = team.pendingRequests.filter(uid => uid !== req.params.userId);
    saveDatabase();
    res.json(team);
  });

  // GET /api/teams/:id/members
  app.get('/api/teams/:id/members', authenticateToken, (req, res) => {
    const team = db.teams.find(t => t.id === req.params.id);
    if (!team) return res.status(404).json({ message: 'Team not found' });
    
    const members = db.users.filter(u => team.members.includes(u.id))
      .map(({ password, ...rest }) => rest);
    res.json(members);
  });

  // GET /api/teams/:id/pending-requests
  app.get('/api/teams/:id/pending-requests', authenticateToken, (req, res) => {
    const team = db.teams.find(t => t.id === req.params.id);
    if (!team) return res.status(404).json({ message: 'Team not found' });
    
    const pending = db.users.filter(u => team.pendingRequests.includes(u.id))
      .map(({ password, ...rest }) => rest);
    res.json(pending);
  });

  // DELETE /api/teams/:teamId/members/:userId
  app.delete('/api/teams/:teamId/members/:userId', authenticateToken, (req, res) => {
    const team = db.teams.find(t => t.id === req.params.teamId);
    if (!team) return res.status(404).json({ message: 'Team not found' });
    
    // Only lead can kick, or a member can leave themselves
    if (team.creatorId !== req.user.id && req.user.id !== req.params.userId) {
      return res.status(403).json({ message: 'Unauthorized to remove members.' });
    }

    if (team.creatorId === req.params.userId) {
      return res.status(400).json({ message: 'Team creator/lead cannot leave. Transfer lead or delete team.' });
    }

    team.members = team.members.filter(uid => uid !== req.params.userId);

    // Push system message
    const leftUser = db.users.find(u => u.id === req.params.userId);
    if (leftUser) {
      db.chat[team.id].push({
        id: 'sys_' + Date.now(),
        senderId: 'system',
        senderName: 'System Bot',
        senderAvatar: '',
        content: `${leftUser.name} has left the team.`,
        timestamp: new Date().toISOString(),
        reactions: {}
      });
    }

    saveDatabase();
    res.json(team);
  });

  // ==========================================
  // CHAT MODULE
  // ==========================================

  // GET /api/chat/:teamId/history
  app.get('/api/chat/:teamId/history', authenticateToken, (req, res) => {
    const team = db.teams.find(t => t.id === req.params.teamId);
    if (!team) return res.status(404).json({ message: 'Team workspace not found' });
    
    if (!team.members.includes(req.user.id)) {
      return res.status(403).json({ message: 'You are not a member of this team workspace.' });
    }

    const messages = db.chat[req.params.teamId] || [];
    res.json(messages);
  });

  // POST /api/chat/:teamId/send
  app.post('/api/chat/:teamId/send', authenticateToken, (req, res) => {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ message: 'Content is required.' });
    }

    const team = db.teams.find(t => t.id === req.params.teamId);
    if (!team) return res.status(404).json({ message: 'Team not found' });
    
    if (!team.members.includes(req.user.id)) {
      return res.status(403).json({ message: 'Unauthorized. Not in team.' });
    }

    const newMsg = {
      id: 'msg_' + Date.now(),
      senderId: req.user.id,
      senderName: req.user.name,
      senderAvatar: req.user.avatar || '',
      content,
      timestamp: new Date().toISOString(),
      reactions: {}
    };

    if (!db.chat[req.params.teamId]) {
      db.chat[req.params.teamId] = [];
    }

    db.chat[req.params.teamId].push(newMsg);
    saveDatabase();

    const io = req.app.get('io');
    if (io) {
      io.to(req.params.teamId).emit('message-received', newMsg);
    }

    res.status(201).json(newMsg);
  });

  // PUT /api/chat/:teamId/messages/:messageId
  app.put('/api/chat/:teamId/messages/:messageId', authenticateToken, (req, res) => {
    const { content } = req.body;
    const messages = db.chat[req.params.teamId] || [];
    const message = messages.find(m => m.id === req.params.messageId);

    if (!message) return res.status(404).json({ message: 'Message not found' });
    if (message.senderId !== req.user.id) {
      return res.status(403).json({ message: 'Cannot edit another users message.' });
    }

    message.content = content;
    message.edited = true;
    saveDatabase();

    const io = req.app.get('io');
    if (io) {
      io.to(req.params.teamId).emit('message-edited', message);
    }

    res.json(message);
  });

  // DELETE /api/chat/:teamId/messages/:messageId
  app.delete('/api/chat/:teamId/messages/:messageId', authenticateToken, (req, res) => {
    const messages = db.chat[req.params.teamId] || [];
    const index = messages.findIndex(m => m.id === req.params.messageId);

    if (index === -1) return res.status(404).json({ message: 'Message not found' });
    if (messages[index].senderId !== req.user.id && db.teams.find(t => t.id === req.params.teamId).creatorId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to delete this message.' });
    }

    const messageId = req.params.messageId;
    messages.splice(index, 1);
    saveDatabase();

    const io = req.app.get('io');
    if (io) {
      io.to(req.params.teamId).emit('message-deleted', messageId);
    }

    res.json({ message: 'Message deleted successfully.' });
  });

  // POST /api/chat/:teamId/messages/:messageId/react
  app.post('/api/chat/:teamId/messages/:messageId/react', authenticateToken, (req, res) => {
    const { reaction } = req.body; // e.g. "👍", "❤️", "🔥", "😂"
    if (!reaction) return res.status(400).json({ message: 'Reaction character is required.' });

    const messages = db.chat[req.params.teamId] || [];
    const message = messages.find(m => m.id === req.params.messageId);
    if (!message) return res.status(404).json({ message: 'Message not found' });

    if (!message.reactions) {
      message.reactions = {};
    }

    if (!message.reactions[reaction]) {
      message.reactions[reaction] = [];
    }

    const userList = message.reactions[reaction];
    if (userList.includes(req.user.id)) {
      // Toggle off
      message.reactions[reaction] = userList.filter(uid => uid !== req.user.id);
      if (message.reactions[reaction].length === 0) {
        delete message.reactions[reaction];
      }
    } else {
      // Toggle on
      userList.push(req.user.id);
    }

    saveDatabase();

    const io = req.app.get('io');
    if (io) {
      io.to(req.params.teamId).emit('message-reacted', message);
    }

    res.json(message);
  });

  // GET /api/chat/:teamId/stats
  app.get('/api/chat/:teamId/stats', authenticateToken, (req, res) => {
    const messages = db.chat[req.params.teamId] || [];
    const totalMessages = messages.length;
    
    const senderCounts = {};
    messages.forEach(m => {
      if (m.senderId !== 'system') {
        senderCounts[m.senderName] = (senderCounts[m.senderName] || 0) + 1;
      }
    });

    res.json({ totalMessages, senderCounts });
  });

  // ==========================================
  // VITE DEVELOPMENT OR PRODUCTION BUNDLE
  // ==========================================
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`Campus Event Hub local Full-Stack Server running on port ${PORT}`);
  });

  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  app.set('io', io);

  io.on('connection', (socket) => {
    socket.on('join-room', (teamId) => {
      socket.join(teamId);
    });

    socket.on('leave-room', (teamId) => {
      socket.leave(teamId);
    });
  });
}

startServer();
