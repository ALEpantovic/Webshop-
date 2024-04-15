import React, { useState } from "react";
import axios from "axios";

const Register = () => {
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
    ime_prezime: "",
    telefon: "",
    grad_adresa: "",
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null); 
      
      if (!inputs.username || !inputs.email || !inputs.password) {
        setError("All fields are required.");
        return;
      }
      
      const response = await axios.post(
        "http://localhost:8800/backend/auth/register",
        inputs
      );
      
      console.log("Register successful:", response.data);
      window.location.href = "/";
    } catch (err) {
      console.log(inputs.username,inputs.email,inputs.password)
      console.error("Registration error:", err); 
      setError("An error occurred during registration. Please try again.");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Registracija</h1>
        <form className="space-y-4">
          <input
            required
            type="text"
            placeholder="Korisničko ime"
            name="username"
            onChange={handleChange}
            className="block w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
          />
          <input
            required
            type="email"
            placeholder="Email"
            name="email"
            onChange={handleChange}
            className="block w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
          />
          <input
            required
            type="password"
            placeholder="Lozinka"
            name="password"
            onChange={handleChange}
            className="block w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
          />
          <input
            required
            type="text"
            placeholder="Ime i prezime"
            name="ime_prezime"
            onChange={handleChange}
            className="block w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
          />
          <input
            required
            type="text"
            placeholder="Broj telefona"
            name="telefon"
            onChange={handleChange}
            className="block w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
          />
          <input
            required
            type="text"
            placeholder="Grad i adresa"
            name="grad_adresa"
            onChange={handleChange}
            className="block w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-200"
          >
            Registracija
          </button>
          {error && <p className="text-red-500">{error}</p>}
          <span className="text-gray-600">
           <br/><br/>  Imate nalog? <a href="/login">Login</a>
          </span>
        </form>
      </div>
    </div>
  );
};

export default Register;
