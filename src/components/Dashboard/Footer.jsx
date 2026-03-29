import React from 'react';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
    const navigate = useNavigate();
    const currentYear = new Date().getFullYear();

    const menuItems = [
        { label: 'Home', path: '/dashboard' },
        { label: 'Scan', path: '/dashboard/scan' },
        { label: 'Scan results', path: '/dashboard/results' },
        { label: 'Asset Inventory', path: '/dashboard/assets' },
        { label: 'History', path: '/dashboard/history' },
        { label: 'CBOM History', path: '/dashboard/cbom' },
        { label: 'Reporting', path: '/dashboard/reporting' },
    ];

    return (
        <footer className="fixed bottom-0 left-0 right-0 z-[50] bg-white/80 backdrop-blur-md border-t border-slate-100 py-4 px-10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                {/* Simplified Menu Items */}
                <ul className="flex flex-wrap items-center gap-8">
                    {menuItems.map((item, index) => (
                        <li
                            key={index}
                            onClick={() => navigate(item.path)}
                            className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-orange-500 cursor-pointer transition-colors"
                        >
                            {item.label}
                        </li>
                    ))}
                </ul>

                {/* Copyright only */}
                <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                    © {currentYear} PNB
                </p>
            </div>
        </footer>
    );
};

export default Footer;