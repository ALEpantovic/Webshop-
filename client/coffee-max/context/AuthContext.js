import { createContext, useEffect, useState } from "react"; // Import useState here

export const AuthContext = createContext();

export const AuthContexProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    typeof window !== 'undefined' ? JSON.parse(localStorage.getItem("user")) || null : null
  );

  const login = async (inputs) => {
    const res = await axios.post("/backend/auth/login", inputs);
    setCurrentUser(res.data);

    // Fetch and store the user's role
    const roleRes = await axios.get("/backend/get-role"); // Replace with your endpoint
    const role = roleRes.data.role;
    setCurrentUser((prevUser) => ({ ...prevUser, role }));
  };

  const logout = async (inputs) => {
    await axios.post("/backend/auth/logout");
    setCurrentUser(null);
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
