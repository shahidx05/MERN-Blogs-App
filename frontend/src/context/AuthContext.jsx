/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from 'react'
import { register, login, getMe} from '../services/api.js'

const AuthContext = createContext({})

export const useAuth = () => {
    return useContext(AuthContext)
}

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token') || localStorage.getItem('token'))
    const [user, setUser] = useState(null)

    const fetchUserProfile = async () => {
        try {
            if (token) {
                const data = await getMe()
                setUser(data)
            }
        } catch (error) {
            setUser(null)
            Logout();
            console.log("error", error)
        }
    }

    useEffect(() => {
        fetchUserProfile()
    }, [token])


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
        user,
        Logout,
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext