import axios from 'axios';

// Create a custom axios instance with relative paths for perfect cross-origin/sandbox routing
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL|| 'https://campus-event-hub-75ml.onrender.com' ,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach the bearer session token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('campus_event_hub_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    // Normalize outgoing requests (e.g., map major/year, confirmPassword, etc.)
    if (config.data && typeof config.data === 'object') {
      const normalizePayload = (obj) => {
        if (obj === null || obj === undefined) return obj;
        if (Array.isArray(obj)) return obj.map(normalizePayload);
        if (typeof obj === 'object') {
          const newObj = { ...obj };
          if ('major' in newObj && !('department' in newObj)) {
            let dept = 'OTHER';
            const val = String(newObj.major).toUpperCase();
            if (val.includes('COMPUTER') || val.includes('CSE') || val.includes('SOFTWARE') || val.includes('IT')) {
              dept = 'CSE';
            } else if (val.includes('ECE') || val.includes('ELECTRONIC') || val.includes('COMMUNICATION')) {
              dept = 'ECE';
            } else if (val.includes('MECH') || val.includes('ME ')) {
              dept = 'ME';
            } else if (val.includes('CIVIL') || val.includes('CE ')) {
              dept = 'CE';
            } else if (val.includes('ELECTRI') || val.includes('EE ')) {
              dept = 'EE';
            } else if (val.includes('BIOTECH') || val.includes('BIO')) {
              dept = 'BIOTECH';
            }
            newObj.department = dept;
          }
          if ('avatar' in newObj && !('profileImage' in newObj)) {
            newObj.profileImage = newObj.avatar;
          }
          if ('date' in newObj && typeof newObj.date === 'string') {
            const dateStr = newObj.date;
            if (dateStr.includes('T')) {
              const parts = dateStr.split('T');
              newObj.date = parts[0]; // e.g. "2026-07-15"
              const timePart = parts[1];
              if (timePart) {
                newObj.time = timePart.split('.')[0].substring(0, 5); // e.g. "09:00"
              } else {
                newObj.time = '00:00';
              }
            } else if (!('time' in newObj)) {
              newObj.time = '00:00';
            }
          }
          if (!('year' in newObj)) {
            newObj.year = '3';
          }
          if ('password' in newObj && !('confirmPassword' in newObj)) {
            newObj.confirmPassword = newObj.password;
          }
          return newObj;
        }
        return obj;
      };
      config.data = normalizePayload(config.data);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle auth errors, session timeouts, and generic alerts
api.interceptors.response.use(
  (response) => {
    // Helper to recursively normalize any _id into id and vice-versa
    const normalizeIds = (obj) => {
      if (obj === null || obj === undefined) return obj;
      if (Array.isArray(obj)) {
        return obj.map(normalizeIds);
      }
      if (typeof obj === 'object') {
        const newObj = {};
        for (const key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            newObj[key] = normalizeIds(obj[key]);
          }
        }
        if ('_id' in newObj && !('id' in newObj)) {
          newObj.id = newObj._id;
        } else if ('id' in newObj && !('_id' in newObj)) {
          newObj._id = newObj.id;
        }
        if ('leader' in newObj && !('creatorId' in newObj)) {
          newObj.creatorId = typeof newObj.leader === 'object' && newObj.leader !== null ? (newObj.leader.id || newObj.leader._id || newObj.leader) : newObj.leader;
        }
        if ('organizer' in newObj && !('creatorId' in newObj)) {
          newObj.creatorId = typeof newObj.organizer === 'object' && newObj.organizer !== null ? (newObj.organizer.id || newObj.organizer._id || newObj.organizer) : newObj.organizer;
        }
        if ('department' in newObj && !('major' in newObj)) {
          const dept = newObj.department;
          let major = 'General Science';
          if (dept === 'CSE') major = 'Computer Science & Engineering';
          else if (dept === 'ECE') major = 'Electronics & Communication Engineering';
          else if (dept === 'ME') major = 'Mechanical Engineering';
          else if (dept === 'CE') major = 'Civil Engineering';
          else if (dept === 'EE') major = 'Electrical Engineering';
          else if (dept === 'BIOTECH') major = 'Biotechnology';
          else if (dept === 'OTHER') major = 'General Science';
          newObj.major = major;
        }
        if ('date' in newObj && 'time' in newObj && newObj.time) {
          const d = newObj.date;
          const t = newObj.time;
          if (typeof d === 'string' && typeof t === 'string') {
            const dateOnly = d.includes('T') ? d.split('T')[0] : d;
            const cleanTime = t.substring(0, 5); // e.g. "14:00"
            newObj.date = `${dateOnly}T${cleanTime}:00`;
          }
        }
        if ('profileImage' in newObj && !('avatar' in newObj)) {
          newObj.avatar = newObj.profileImage;
        }
        if ('senderProfileImage' in newObj && !('senderAvatar' in newObj)) {
          newObj.senderAvatar = newObj.senderProfileImage;
        }
        if ('joinRequests' in newObj && !('pendingRequests' in newObj)) {
          if (Array.isArray(newObj.joinRequests)) {
            newObj.pendingRequests = newObj.joinRequests.map(req => {
              if (req && typeof req === 'object') {
                if (req.userId) {
                  const userObj = typeof req.userId === 'object' ? req.userId : { id: req.userId, _id: req.userId };
                  return {
                    ...userObj,
                    id: userObj.id || userObj._id,
                    _id: userObj._id || userObj.id,
                    message: req.message,
                    status: req.status,
                    requestedAt: req.requestedAt
                  };
                }
                return req;
              }
              return req;
            });
          }
        }
        if ('userId' in newObj && typeof newObj.userId === 'object' && newObj.userId !== null) {
          const userObj = newObj.userId;
          Object.assign(newObj, {
            ...userObj,
            id: userObj.id || userObj._id,
            _id: userObj._id || userObj.id
          });
        }
        return newObj;
      }
      return obj;
    };

    // Helper to unpack Mongoose wrapper objects into the payloads expected by the frontend
    const unpackPayload = (data) => {
      if (data && typeof data === 'object' && !Array.isArray(data)) {
        if ('token' in data && 'user' in data) {
          return data;
        }
        const keys = ['user', 'event', 'team', 'events', 'teams', 'users', 'messages', 'stats', 'skills', 'interests', 'attendees', 'requests', 'members'];
        for (const key of keys) {
          if (key in data) {
            return data[key];
          }
        }
      }
      return data;
    };

    if (response.data) {
      response.data = normalizeIds(response.data);
      response.data = unpackPayload(response.data);
    }
    return response;
  },
  (error) => {
    if (error.response) {
      const { status } = error.response;
      
      // If 401 Unauthorized or 403 Forbidden is returned, we clear expired tokens
      if (status === 401 || status === 403) {
        localStorage.removeItem('campus_event_hub_token');
        localStorage.removeItem('campus_event_hub_user');
        
        // Redirect to login page if we are not already there
        if (!window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/register')) {
          window.location.href = '/login?expired=true';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
