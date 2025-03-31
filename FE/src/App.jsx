import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './components/signup/signup.jsx';
import Login from './components/login/login.jsx';
import Projects from './components/project/project.jsx';
import Logout from './components/logout/logout.jsx';
import { AuthProvider, useAuth } from './components/context/AuthContext.jsx'; // Import the necessary context
import './App.css';

const PrivateRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();  // Use the hook to check authentication state
    return isAuthenticated ? children : <Navigate to="/login" />;
};

const App = () => {
    return (
        <AuthProvider>  {/* Wrap your app in AuthProvider */}
            <Router>  {/* ✅ Wrap everything inside BrowserRouter */}
                <Routes>
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/login" element={<Login />} />
                    <Route
                        path="/projects"
                        element={
                            <PrivateRoute>
                                <Projects />
                                <Logout />
                            </PrivateRoute>
                        }
                    />
                    <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;
