import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const { Register } = useAuth()

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const res = await Register(name, username, email, password);

      if (res.token) {
        navigate("/profile");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Register
        </h2>

        <form className="space-y-4"  onSubmit={submitHandler}>
          <div>
            <label className="block text-sm font-medium mb-1">
              Name
            </label>
            <input
              type="text"
              placeholder="Your name"
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Userame
            </label>
            <input
              type="text"
              placeholder="Your username"
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="Your email"
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Create password"
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
          >
            Register
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <span className="text-blue-600 cursor-pointer">
            <Link to="/login">Login</Link>
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;