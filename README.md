# One-Stop Personalized Career & Education Advisor

A full-stack web application that helps students discover suitable career paths and
educational programs based on their interests, skills, academic background, and
personality traits — all in one place.

## Tech Stack
- **Frontend:** React (Create React App), React Router, Axios
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Auth:** JWT-based authentication
- **Recommendation Engine:** Rule-based weighted scoring (pluggable, can be swapped for an ML model later)

## Features
- User registration & login (JWT auth)
- Interactive career/education assessment (interests, skills, subjects, personality)
- Personalized recommendations (careers + relevant courses/degrees)
- Dashboard to view profile, past assessments, and saved recommendations
- Admin-editable career/course dataset (JSON-based, easy to extend)

## Project Structure
```
career-education-advisor/
├── backend/
│   ├── config/            # DB connection config
│   ├── controllers/       # Route logic (auth, assessment, recommendation)
│   ├── data/               # Career & course dataset used by recommendation engine
│   ├── middleware/         # JWT auth middleware
│   ├── models/              # Mongoose schemas (User, Assessment, CareerPath)
│   ├── routes/              # Express route definitions
│   ├── utils/               # Recommendation engine logic
│   ├── server.js            # App entry point
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/      # Navbar, AssessmentForm, Recommendations, etc.
│   │   ├── pages/            # Home, Login, Register, Dashboard, Profile
│   │   ├── services/          # Axios API wrapper
│   │   ├── styles/             # CSS
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── README.md
```

## Getting Started

### 1. Backend Setup
```bash
cd backend
npm install
cp .env.example .env   # then fill in MONGO_URI and JWT_SECRET
npm run dev             # starts server with nodemon on http://localhost:5000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm start                # starts React dev server on http://localhost:3000
```

### 3. Environment Variables (backend/.env)
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/career_advisor
JWT_SECRET=your_jwt_secret_here
```

## API Overview
| Method | Endpoint                     | Description                          |
|--------|-------------------------------|---------------------------------------|
| POST   | /api/auth/register             | Register a new user                   |
| POST   | /api/auth/login                | Login, returns JWT                    |
| GET    | /api/auth/me                   | Get logged-in user profile (protected)|
| POST   | /api/assessment                | Submit assessment answers (protected) |
| GET    | /api/assessment/history         | Get user's past assessments (protected)|
| POST   | /api/recommendation             | Get career recommendations (protected)|

## Extending the Recommendation Engine
The scoring logic lives in `backend/utils/recommendationEngine.js` and the career/course
dataset lives in `backend/data/careers.json`. To add more careers or tune weights, edit
these two files — no other code changes are required. This is also the natural place to
later swap in a trained ML model (e.g., a scikit-learn/TensorFlow model served via a
Python microservice, or a Node ML library) without touching the rest of the app.

## Next Steps / Ideas
- Add resume/skill-gap analysis
- Integrate real course/college data via an external API
- Add email notifications for assessment results
- Add an admin panel to manage the careers dataset via UI
