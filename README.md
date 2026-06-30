 🎓 Campus Event Hub

A full-stack MERN-based Campus Event Management & Collaboration Platform that allows students to create events, form teams, chat in real-time, and build profiles for collaboration.

Live Demo: https://campus-event-hub-three.vercel.app
Features
Authentication

* User Registration & Login (JWT-based)
* Secure password hashing (bcrypt)
* Protected routes & middleware authentication

 Events
* Create, view, and manage campus events
* Join events and track participation

 Teams
* Create teams for events/projects
* Join team requests system
* Member management

 Real-time Chat
* Socket.IO based live messaging
* Instant updates between users

User Profiles
* Profile creation with skills & interests
* Public profile viewing
* Profile update functionality

 Dashboard
* Personalized dashboard overview
* User activity tracking
* Event & team insights
  
 Tech Stack

 Frontend
* React.js
* Tailwind CSS
* Axios
* React Router DOM
* Lucide Icons

Backend
* Node.js
* Express.js
* MongoDB + Mongoose
* JWT Authentication
* Socket.IO
* bcryptjs
* dotenv

Deployment
* Frontend: Vercel / Netlify
* Backend: Render
* Database: MongoDB Atlas

 Project Structure

campus-event-hub/
│
├── campus-event-hub-backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── validators/
│   ├── server.js
│
├── campus-event-hub-frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── api/
│   │   ├── App.jsx
│   │   └── main.jsx
│
└── README.md

Installation & Setup

 Clone repository

git clone  https://github.com/Sha-2205/campus-event-hub.git
cd campus-event-hub

Backend setup

cd campus-event-hub-backend
npm install

Create .env file:

PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
NODE_ENV=development

Run backend:

npm run dev

 Frontend setup

cd campus-event-hub-frontend
npm install
npm run dev

---

 Environment Variables

 Backend .env

PORT
MONGO_URI
JWT_SECRET
JWT_EXPIRE
NODE_ENV

---

 API Endpoints

 Auth

* POST /api/auth/register
* POST /api/auth/login
* GET /api/auth/me
* POST /api/auth/logout

 Profile

* GET /api/profile/me
* PUT /api/profile/update

 Events

* GET /api/events
* POST /api/events/create

 Teams

* POST /api/teams/create
* GET /api/teams


 Real-Time Features

* Socket.IO connection for chat
* Live user presence updates
* Instant message broadcasting



 Key Learnings

* JWT authentication flow
* MERN full-stack integration
* Socket.IO real-time communication
* REST API design
* State management with React Context


 Future Improvements

* Notifications system
* Event recommendation system
* File sharing in chat
* Admin dashboard
* Email verification

---

 Author

Harsha Vivek
MERN Stack Developer

---

 License

This project is licensed under the MIT License.

* make it more “ATS / resume recruiter optimized”
* add badges (MongoDB, Express, React, Node)
* or convert it into a fancy GitHub README with banners + screenshots

Just tell 👍
