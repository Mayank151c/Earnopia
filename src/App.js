import React from "react";
import { HashRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import AuthPage from "./components/Auth";
import HomePage from "./components/Home";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<AuthPage isSignUp={false} />} />
        <Route path="/signup" element={<AuthPage isSignUp={true} />} />
        <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
