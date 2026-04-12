import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { X, ShieldCheck, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ menuItems, open, onClose }) => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (err) {
            console.error('Logout failed', err);
        }
    };

    const baseClasses = 'fixed inset-y-0 left-0 z-[120] w-72 flex flex-col border-r transition-transform duration-300';
    const stateClasses = open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0';

    return (
        <>
            {open && (
                <button
                    aria-label="Close sidebar overlay"
                    className="lg:hidden fixed inset-0 z-110 bg-black/35 backdrop-blur-sm"
                    onClick={onClose}
                />
            )}

            <aside
                className={`${baseClasses} ${stateClasses}`}
                style={{
                    backgroundColor: 'var(--surface-soft)',
                    borderColor: 'color-mix(in srgb, var(--outline) 55%, transparent)'
                }}
            >
                <div className="px-8 py-8 border-b" style={{ borderColor: 'color-mix(in srgb, var(--outline) 45%, transparent)' }}>
                    <div className="flex items-start justify-between gap-4">
                        <button
                            type="button"
                            className="text-left"
                            onClick={() => {
                                navigate('/dashboard');
                                onClose();
                            }}
                        >
                            <p className="editorial-title text-3xl leading-none">KavachAI</p>
                            <p className="editorial-label mt-2">Digital Curator</p>
                        </button>

                        <button
                            type="button"
                            onClick={onClose}
                            className="lg:hidden p-2 rounded-lg"
                            style={{ background: 'var(--surface)', color: 'var(--muted)' }}
                            aria-label="Close navigation"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>

                <nav className="flex-1 py-5 overflow-y-auto">
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            onClick={onClose}
                            end={item.path === '/dashboard'}
                            className={({ isActive }) =>
                                `group mx-3 mb-2 flex items-center gap-3 rounded-xl border-r-4 px-4 py-3 text-lg transition-all ${
                                    isActive
                                        ? 'font-bold text-blue-700 border-blue-700 bg-blue-50/70'
                                        : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-white/70'
                                }`
                            }
                        >
                            <item.icon size={18} className="shrink-0" />
                            <span className="font-headline">{item.name}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="border-t px-6 py-6" style={{ borderColor: 'color-mix(in srgb, var(--outline) 45%, transparent)' }}>
                    <div className="mb-4 flex items-center gap-3 rounded-xl px-3 py-3" style={{ backgroundColor: 'var(--surface)' }}>
                        <div
                            className="h-10 w-10 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: 'var(--surface-muted)', color: 'var(--primary)' }}
                        >
                            <ShieldCheck size={18} />
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-bold truncate">{user?.name || 'System User'}</p>
                            <p className="text-[10px] font-label text-slate-500">{user?.role || 'Operator'}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1">
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="editorial-button inline-flex items-center justify-center gap-2 px-3 py-2 cursor-pointer"
                            style={{
                                backgroundColor: 'color-mix(in srgb, var(--danger) 14%, var(--surface))',
                                borderColor: 'color-mix(in srgb, var(--danger) 26%, var(--outline))',
                                color: 'color-mix(in srgb, var(--danger) 85%, black)'
                            }}
                        >
                            <LogOut size={16} />
                            Logout
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
