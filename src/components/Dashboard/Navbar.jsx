import React, { useState, useEffect } from 'react';
import { ShieldCheck, LogOut, Menu, X, Sun, Moon } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = ({ menuItems }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout, user } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Theme State
    const [isDarkMode, setIsDarkMode] = useState(
        document.documentElement.classList.contains('dark')
    );

    // Toggle Theme Function
    const toggleTheme = () => {
        // 1. Get the root HTML element
        const root = window.document.documentElement;

        // 2. Check if it already has dark mode
        const isDark = root.classList.contains('dark');

        if (isDark) {
            root.classList.remove('dark');
            localStorage.setItem('pnb-theme', 'light');
            setIsDarkMode(false);
        } else {
            root.classList.add('dark');
            localStorage.setItem('pnb-theme', 'dark');
            setIsDarkMode(true);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (err) {
            console.error("Logout failed", err);
        }
    };

    const handleNavigation = (path) => {
        navigate(path);
        setIsMobileMenuOpen(false);
    };

    return (
        <nav className="sticky top-0 z-[100] bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-3 shadow-sm transition-colors duration-300">
            <div className="max-w-[1600px] mx-auto flex items-center justify-between">

                {/* Left Section: Mobile Toggle & Branding */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="lg:hidden p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>

                    <div
                        className="flex items-center gap-3 cursor-pointer"
                        onClick={() => navigate('/dashboard')}
                    >
                        <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-1.5 sm:p-2 rounded-xl shadow-md">
                            <ShieldCheck className="text-amber-950 w-5 h-5 sm:w-6 sm:h-6" />
                        </div>
                        <h1 className="font-black text-lg sm:text-xl tracking-tighter text-slate-900 dark:text-white leading-none">
                            PNB <span className="text-orange-500">SECURE</span>
                        </h1>
                    </div>
                </div>

                {/* Desktop Horizontal Links */}
                <div className="hidden lg:flex items-center gap-1">
                    {menuItems.map((item) => {
                        const isActive = item.path === '/dashboard'
                            ? location.pathname === '/dashboard'
                            : location.pathname.startsWith(item.path);

                        return (
                            <button
                                key={item.name}
                                onClick={() => handleNavigation(item.path)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${isActive
                                    ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400'
                                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                                    }`}
                            >
                                <item.icon className={`w-4 h-4 ${isActive ? 'text-amber-500' : 'text-slate-400'}`} />
                                {item.name}
                            </button>
                        );
                    })}
                </div>

                {/* Right Section: Theme Toggle, User Info & Logout */}
                <div className="flex items-center gap-2 sm:gap-4 lg:border-l lg:pl-6 border-slate-200 dark:border-slate-800">

                    {/* Theme Toggle Button */}
                    <button
                        onClick={toggleTheme}
                        className="p-2 sm:p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-orange-500 dark:hover:text-yellow-400 rounded-xl transition-all shadow-inner"
                        title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                    >
                        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>

                    {/* User Info */}
                    <div className="text-right hidden sm:block leading-tight">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                            {user?.role || 'System User'}
                        </p>
                        <p className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 truncate max-w-[120px]">
                            {user?.name || 'Guest'}
                        </p>
                    </div>

                    {/* Logout */}
                    <button
                        onClick={handleLogout}
                        className="p-2 sm:p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 rounded-xl transition-all"
                        title="Logout"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* --- MOBILE OVERLAY MENU --- */}
            {isMobileMenuOpen && (
                <div className="lg:hidden absolute top-[100%] left-0 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-xl animate-in slide-in-from-top duration-300">
                    <div className="flex flex-col p-4 gap-2">
                        {menuItems.map((item) => {
                            const isActive = item.path === '/dashboard'
                                ? location.pathname === '/dashboard'
                                : location.pathname.startsWith(item.path);

                            return (
                                <button
                                    key={item.name}
                                    onClick={() => handleNavigation(item.path)}
                                    className={`flex items-center gap-4 px-4 py-4 rounded-xl text-sm font-bold transition-all ${isActive ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                                        }`}
                                >
                                    <item.icon className={`w-5 h-5 ${isActive ? 'text-amber-500' : 'text-slate-400'}`} />
                                    {item.name}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;