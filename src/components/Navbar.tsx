import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Settings, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NotificationCenter } from './NotificationCenter';

export const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/");
        } catch (error) {
            console.error("Errore durante il logout:", error);
        }
    };

    return (
        <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    {/* Logo/Brand */}
                    <Link to="/" className="flex items-center gap-2">
                        <span className="text-xl font-bold text-green-600">OrtoPlan</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-6">
                        <Link 
                            to="/dashboard" 
                            className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-500"
                        >
                            Dashboard
                        </Link>
                        <Link 
                            to="/plantations" 
                            className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-500"
                        >
                            Le Mie Piantagioni
                        </Link>
                        <Link 
                            to="/activities" 
                            className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-500"
                        >
                            Attività
                        </Link>
                    </div>

                    {/* User Menu (Desktop) */}
                    <div className="hidden md:flex items-center gap-4">
                        {user && (
                            <>
                                <NotificationCenter userId={user.userId} />
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button 
                                            variant="outline" 
                                            className="flex items-center gap-2 px-3 py-2 h-auto"
                                        >
                                            <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                                                <span className="font-medium text-green-700 dark:text-green-300">
                                                    {user.firstName?.charAt(0)}
                                                    {user.lastName?.charAt(0)}
                                                </span>
                                            </div>
                                            <span className="text-sm font-medium">
                                                {user.firstName} {user.lastName}
                                            </span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56">
                                        <div className="flex items-center justify-start gap-2 p-2">
                                            <div className="flex flex-col space-y-1">
                                                <p className="text-sm font-medium">{user.firstName} {user.lastName}</p>
                                                <p className="text-xs text-muted-foreground">{user.email}</p>
                                            </div>
                                        </div>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => navigate("/settings")}>
                                            <Settings className="mr-2 h-4 w-4" />
                                            <span>Impostazioni</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={handleLogout}>
                                            <LogOut className="mr-2 h-4 w-4" />
                                            <span>Logout</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? (
                            <X className="h-6 w-6" />
                        ) : (
                            <Menu className="h-6 w-6" />
                        )}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden py-4 space-y-4">
                        <Link 
                            to="/dashboard" 
                            className="block px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Dashboard
                        </Link>
                        <Link 
                            to="/plantations" 
                            className="block px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Le Mie Piantagioni
                        </Link>
                        <Link 
                            to="/activities" 
                            className="block px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Attività
                        </Link>
                        <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
                            <Button 
                                variant="outline" 
                                className="w-full justify-start"
                                onClick={() => {
                                    navigate("/settings");
                                    setIsMobileMenuOpen(false);
                                }}
                            >
                                <Settings className="mr-2 h-4 w-4" />
                                Impostazioni
                            </Button>
                            <Button 
                                variant="outline" 
                                className="w-full justify-start mt-2"
                                onClick={() => {
                                    handleLogout();
                                    setIsMobileMenuOpen(false);
                                }}
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                Logout
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}; 