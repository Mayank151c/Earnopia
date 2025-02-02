import React, { useState, useEffect } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import Loading from "./Loading";
import API from "../config";

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios
      .get(API.BASE_URL("/auth"), { withCredentials: true })
      .then((res) => {
        setIsAuthenticated(res.data.isAuthenticated);
      })
      .catch(() => {
        setIsAuthenticated(false);
      })
      .finally(() => {
        setIsLoading(false); // ✅ Stop loading after API call
      });
  }, []); // ✅ Runs only once on mount

  if (isLoading) return <Loading />; // ✅ Prevent redirect while checking auth

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
