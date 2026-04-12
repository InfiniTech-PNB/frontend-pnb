import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../../components/Dashboard/Navbar';
import Footer from '../../components/Dashboard/Footer';
import Sidebar from '../../components/Dashboard/Sidebar';
import { LayoutDashboard, ShieldAlert, Activity, History, FileCode, Database, FileText, BarChart3 } from 'lucide-react';

const DashboardLayout = () => {
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const menuItems = [
        { name: 'Home', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Summary', path: '/dashboard/summary', icon: BarChart3 },
        { name: 'Scan', path: '/dashboard/scan', icon: ShieldAlert },
        { name: 'Scan Results', path: '/dashboard/results', icon: Activity },
        { name: 'Asset Inventory', path: '/dashboard/assets', icon: Database },
        { name: 'History', path: '/dashboard/history', icon: History },
        { name: 'CBOM History', path: '/dashboard/cbom', icon: FileCode },
        { name: 'Reporting', path: '/dashboard/reporting', icon: FileText },
    ];

    useEffect(() => {
        setSidebarOpen(false);
    }, [location.pathname]);

    return (
        <div className="min-h-screen editorial-dashboard">
            <Sidebar
                menuItems={menuItems}
                open={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            <div className="min-h-screen lg:ml-72 flex flex-col">
                <Navbar
                    menuItems={menuItems}
                    onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
                />

                <main className="w-full flex-1 px-4 py-6 sm:px-6 lg:px-10">
                    <Outlet />
                </main>

                <Footer />
            </div>
        </div>
    );
};

export default DashboardLayout;