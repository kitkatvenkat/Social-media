import { createContext, useState, useEffect } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";

// Create Context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // State for user authentication
  const [user, setUser] = useState(null);

  // Check if user is logged in on page reload
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedUser = jwtDecode(token);
      setUser(decodedUser);
    }
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const res = await axios.post("http://localhost:4000/api/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      setUser(jwtDecode(res.data.token));
    } catch (error) {
      console.error("Login failed:", error.response.data);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
