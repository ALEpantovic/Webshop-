import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthContexProvider = ({ children }) => {
 const [currentUser, setCurrentUser] = useState(
    typeof window !== 'undefined' ? JSON.parse(localStorage.getItem("user")) || null : null
 );

 const login = async (inputs) => {
    try {
      const res = await axios.post("/backend/auth/login", inputs);
      setCurrentUser(res.data);
      const roleRes = await axios.get("/backend/get-role");
      const role = roleRes.data.role;
      setCurrentUser((prevUser) => ({ ...prevUser, role }));
    } catch (error) {
      console.error("Login error:", error);
    }
 };

 const logout = async () => {
    try {
      await axios.post("/backend/auth/logout");
      setCurrentUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
 };

 useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem("user", JSON.stringify(currentUser));
    }
 }, [currentUser]);

 return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
 );
};
