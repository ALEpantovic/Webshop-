import axios from "axios";
import React, { useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const Login = () => {
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  });
  const [err, setError] = useState(null);

  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8800/backend/auth/login", inputs);
      const token = response.data.token;
      localStorage.setItem('token', token);
      console.log(response.data)
      console.log("Client JWT Token:", token);
      console.log("Login successful:", response.data);
      window.location.href = "/";
    } catch (err) {
      console.error("Login error:", err);
  
      if (err.response && err.response.data) {
        setError(err.response.data);
      } else {
        setError("An error occurred during login. Please try again.");
      }
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <form className="space-y-4">
          <input
            required
            type="text"
            placeholder="Username"
            name="username"
            onChange={handleChange}
            className="block w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
          />
          <input
            required
            type="password"
            placeholder="Password"
            name="password"
            onChange={handleChange}
            className="block w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-200"
          >
            Login
          </button>
          {err && <p className="text-red-500">{err.error}</p>}
          <span className="text-gray-600">
           <br/> <br/>  Don't have an account? <a href="/register">Register</a>
          </span>
        </form>
      </div>
    </div>
  );
  };

export default Login;
