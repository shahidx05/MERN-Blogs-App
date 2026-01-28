import React, { createContext, useContext, useEffect, useState } from 'react'
import { register, login } from '../services/api.js'

const AuthContext = createContext({})

export const useAuth = () => {
    return useContext(AuthContext)
}

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token') || localStorage.getItem('token'))

    const Register = async (name, username, email, password) => {
        await register(name, username, email, password)
    }
    
    const Login = async (email, password) => {
        const data = await login(email, password)
        if (data.token) {
            localStorage.setItem("token", data.token);
            setToken(data.token);
        }
        return data
    }

    const Logout = () => {
        localStorage.removeItem("token");
        setToken(null);
    };

    const value = {
        Register,
        Login,
        token,
        isLoggedIn: !!token,
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext