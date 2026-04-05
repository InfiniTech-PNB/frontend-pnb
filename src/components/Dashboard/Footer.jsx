import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Footer = () => {
    const navigate = useNavigate();
    const location = useLocation();
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
        <footer
            className="mt-16 border-t px-6 py-10 lg:px-10"
            style={{
                borderColor: 'color-mix(in srgb, var(--outline) 48%, transparent)',
                backgroundColor: 'color-mix(in srgb, var(--surface-soft) 75%, transparent)'
            }}
        >
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div>
                    <p className="editorial-title text-xl italic">PNB Secure</p>
                    <p className="mt-2 editorial-label text-slate-500">
                        {currentYear} archival-grade security monitoring
                    </p>
                </div>

                <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
                    {menuItems.map((item) => {
                        const isActive = item.path === '/dashboard'
                            ? location.pathname === '/dashboard'
                            : location.pathname.startsWith(item.path);

                        return (
                            <li key={item.path}>
                                <button
                                    onClick={() => navigate(item.path)}
                                    className={`font-headline text-sm transition-colors ${
                                        isActive ? 'text-blue-700 font-bold underline underline-offset-4' : 'text-slate-500 hover:text-slate-900'
                                    }`}
                                >
                                    {item.label}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </footer>
    );
};

export default Footer;