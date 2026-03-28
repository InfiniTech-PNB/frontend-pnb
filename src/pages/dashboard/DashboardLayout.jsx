import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../../components/Dashboard/Navbar';
import Footer from '../../components/Dashboard/Footer';
import { LayoutDashboard, ShieldAlert, Activity, History, FileCode, Database, FileText } from 'lucide-react';

const DashboardLayout = () => {
    const menuItems = [
        { name: 'Home', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Scan', path: '/dashboard/scan', icon: ShieldAlert },
        { name: 'Scan Results', path: '/dashboard/results', icon: Activity },
        { name: 'Asset Inventory', path: '/dashboard/assets', icon: Database },
        { name: 'History', path: '/dashboard/history', icon: History },
        { name: 'CBOM History', path: '/dashboard/cbom', icon: FileCode },
        { name: 'Reporting', path: '/dashboard/reporting', icon: FileText },
    ];

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar menuItems={menuItems} />
            <main className="max-w-[1600px] mx-auto p-6">
                <Outlet /> {/* Child components render here based on URL */}
            </main>
            <Footer />
        </div>
    );
};

export default DashboardLayout;