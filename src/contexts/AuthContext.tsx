import IUser from "@/interfaces/User";
import axios from "axios";
import { createContext, ReactNode, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const STORAGE_URL = import.meta.env.VITE_API_BACKEND_URL;

export const api = axios.create({
    baseURL: STORAGE_URL,
    headers: {
        "Content-Type": "application/json",
    }
});

interface IAuthContextProps {
    user?: IUser;
    setAsLogged: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<IAuthContextProps | null>(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider");
    }
    return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<IUser>();
    const navigate = useNavigate();

    const getUser = (token: string) => {
        try {
            const decoded: any = jwtDecode(token);
            const email = decoded.sub;

            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            return axios
                .get(`${STORAGE_URL}/users?email=${email}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then(({ data: authUser }) => {
                    setUser(authUser);
                    return authUser;
                })
                .catch((err) => {
                    console.log(err);
                    logout();
                });
        } catch (err) {
            console.error('Error decoding token:', err);
            logout();
        }
    };

    const setAsLogged = (token: string) => {
        localStorage.setItem("ACCESS_TOKEN", token);
        getUser(token)?.then(() => navigate("/dashboard"));
    };

    const logout = () => {
        localStorage.removeItem("ACCESS_TOKEN");
        localStorage.removeItem("weatherLocation");
        setUser(undefined);
        delete api.defaults.headers.common['Authorization'];
        navigate("/");
    };

    useEffect(() => {
        const token = localStorage.getItem("ACCESS_TOKEN");
        if (token && !user) {
            getUser(token);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, setAsLogged, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
