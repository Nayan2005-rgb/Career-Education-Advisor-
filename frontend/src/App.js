import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import CareerDetail from './pages/CareerDetail';
import SchoolFinderPage from './pages/SchoolFinder';
import GovtResidentialSchoolFinderPage from './pages/GovtResidentialSchoolFinder';
import CollegeFinderPage from './pages/CollegeFinder';
import CourseFinderPage from './pages/CourseFinder';
import EntranceExamFinderPage from './pages/EntranceExamFinder';

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const location = useLocation();

  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem('token'));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  const PrivateRoute = ({ children }) =>
    isAuthenticated ? children : <Navigate to="/login" replace />;

  return (
    <>
      {location.pathname !== '/login' && location.pathname !== '/register' && (
        <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
      )}
      <main className={location.pathname === '/' ? 'container landing-container' : 'container'}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login onLogin={() => setIsAuthenticated(true)} />} />
          <Route path="/register" element={<Register onRegister={() => setIsAuthenticated(true)} />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/career/:careerTitle"
            element={
              <PrivateRoute>
                <CareerDetail />
              </PrivateRoute>
            }
          />
          <Route path="/school-finder" element={<SchoolFinderPage />} />
          <Route path="/govt-residential-school-finder" element={<GovtResidentialSchoolFinderPage />} />
          <Route path="/college-finder" element={<CollegeFinderPage />} />
          <Route path="/course-finder" element={<CourseFinderPage />} />
          <Route path="/entrance-exam-finder" element={<EntranceExamFinderPage />} />
        </Routes>
      </main>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
