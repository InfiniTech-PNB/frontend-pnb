import React, { useState } from 'react';
import { LogOut, Menu, Sun, Moon, Search, Bell } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = ({ menuItems, onToggleSidebar }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout, user } = useAuth();

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
            console.error('Logout failed', err);
        }
    };

    const currentSection = menuItems.find((item) => (
        item.path === '/dashboard'
            ? location.pathname === '/dashboard'
            : location.pathname.startsWith(item.path)
    ));

    return (
        <nav
            className="sticky top-0 z-[100] border-b px-4 sm:px-6 lg:px-10 py-3"
            style={{
                backgroundColor: 'color-mix(in srgb, var(--surface) 80%, transparent)',
                borderColor: 'color-mix(in srgb, var(--outline) 48%, transparent)',
                backdropFilter: 'blur(18px)'
            }}
        >
            <div className="mx-auto flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                    <button
                        type="button"
                        onClick={onToggleSidebar}
                        className="rounded-lg p-2 text-slate-500 hover:text-slate-900 hover:bg-white/80 lg:hidden"
                        aria-label="Open navigation"
                    >
                        <Menu size={20} />
                    </button>

                    <div className="min-w-0">
                        <p className="editorial-label text-slate-400">Dashboard</p>
                        <p className="mt-1 truncate editorial-title text-lg sm:text-xl">
                            {currentSection?.name || 'Overview'}
                        </p>
                    </div>
                </div>

                <div className="hidden xl:flex items-center gap-3">
                    <div className="relative">
                        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search archive..."
                            className="editorial-input w-72 pl-9 pr-3 py-2"
                        />
                    </div>

                    <button
                        type="button"
                        className="rounded-lg border p-2"
                        style={{
                            borderColor: 'color-mix(in srgb, var(--outline) 55%, transparent)',
                            backgroundColor: 'var(--surface-soft)',
                            color: 'var(--muted)'
                        }}
                    >
                        <Bell size={16} />
                    </button>
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                    <div className="hidden sm:block text-right leading-tight">
                        <p className="editorial-label text-slate-500">{user?.role || 'System User'}</p>
                        <p className="mt-1 text-sm font-semibold text-slate-700 max-w-[140px] truncate">{user?.name || 'Guest'}</p>
                    </div>

                    <button
                        onClick={toggleTheme}
                        className="rounded-lg border p-2 transition-colors"
                        style={{
                            borderColor: 'color-mix(in srgb, var(--outline) 55%, transparent)',
                            backgroundColor: 'var(--surface-soft)',
                            color: 'var(--muted)'
                        }}
                        title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                    >
                        {isDarkMode ? <Sun size={17} /> : <Moon size={17} />}
                    </button>

                    <button
                        onClick={handleLogout}
                        className="rounded-lg border p-2 transition-colors"
                        style={{
                            borderColor: 'color-mix(in srgb, var(--outline) 55%, transparent)',
                            backgroundColor: 'var(--surface-soft)',
                            color: 'var(--muted)'
                        }}
                        title="Logout"
                    >
                        <LogOut size={17} />
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;