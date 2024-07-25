/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import AuthContext from "./AuthContext";
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const authState = localStorage.getItem("isAuthenticated");
    if (authState) {
      setIsAuthenticated(JSON.parse(authState));
    }

  }, []);

  const login = () => {
    setIsAuthenticated(true);
    localStorage.setItem("isAuthenticated", true);
  };

  const logout = async () => {
    setIsAuthenticated(false);
    localStorage.removeItem("isAuthenticated");
    await supabase.auth.signOut();
    navigate('/login');
  };


  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};


export default AuthProvider;
