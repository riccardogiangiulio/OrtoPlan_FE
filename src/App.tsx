import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import UserSettings from "@/pages/UserSettings";
import Plants from "./pages/Plants";
import Plantations from "./pages/Plantations";

import { AuthProvider } from "@/contexts/AuthContext";
import { StoreProvider } from "@/contexts/StoreContext";

function App() {
    return (
        <AuthProvider>
            <StoreProvider>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<LandingPage />} />
                        <Route path="*" element={<>Page not found!</>} />
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="login" element={<Login />}></Route>
                        <Route path="register" element={<Register />}></Route>
                        <Route path="settings" element={<UserSettings />} />
                        <Route path="/plants" element={<Plants />} />
                        <Route path="/plantations" element={<Plantations />} />
                    </Route>

                </Routes>
            </StoreProvider>
        </AuthProvider>
    );
}

export default App;
