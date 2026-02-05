import { Link, useNavigate, Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { useState } from "react";

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const { Login } = useAuth()

    const navigate = useNavigate()

    const submitHandler = async (e) => {
        e.preventDefault()
        try {
            const data = await Login(email, password)
            if (data.token) {
                navigate('/profile')
            }
        } catch (error) {
            console.log(error)
        }
    }

    const { isLoggedIn } = useAuth();

    if (isLoggedIn) {
        return <Navigate to="/profile" replace />;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-semibold text-center mb-6">
                    Login
                </h2>

                <form className="space-y-4" onSubmit={submitHandler}>
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            placeholder="Enter email"
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
                            placeholder="Enter password"
                            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
                    >
                        Login
                    </button>
                </form>

                <p className="text-sm text-center mt-4">
                    Don’t have an account?{" "}
                    <span className="text-blue-600 cursor-pointer">
                        <Link to="/register" >Register</Link>
                    </span>
                </p>
            </div>
        </div>
    );
};

export default Login;
