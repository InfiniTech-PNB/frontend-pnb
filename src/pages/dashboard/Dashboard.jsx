import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, Globe, Search, Cpu, ShieldCheck, Zap, FileText, Lock, Server } from 'lucide-react';

// Import our new components
import Navbar from '../../components/Dashboard/Navbar';
import HomeTab from '../../components/Dashboard/HomeTab';
// import InventoryTab from '../../components/Dashboard/InventoryTab';
import DiscoveryTab from '../../components/Dashboard/DiscoveryTab';
import CBOMTab from '../../components/Dashboard/CBOMTab';
import PQCTab from '../../components/Dashboard/PQCTab';
// import CyberRatingTab from '../../components/Dashboard/CyberRatingTab';
import ReportingTab from '../../components/Dashboard/ReportingTab';

const Dashboard = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('Home');

    const menuItems = [
        { name: 'Home', icon: LayoutDashboard },
        { name: 'Scan', icon: Search },
        { name: 'CBOM', icon: Cpu },
        { name: 'Posture of PQC', icon: ShieldCheck },
        { name: 'Reporting', icon: FileText },
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'Home':
                return <HomeTab />;
            case 'Scan':
                return <DiscoveryTab />;
            case 'CBOM':
                return <CBOMTab />
            case 'Posture of PQC':
                return <PQCTab />
            case 'Reporting':
                return <ReportingTab />
            default:
                return <HomeTab />;
        }
    };

    return (
        <div className="min-h-screen bg-[#f8f9fa] font-sans selection:bg-yellow-200">
            <Navbar
                menuItems={menuItems}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                onLogout={handleLogout}
            />

            <main className="max-w-[1600px] mx-auto p-6 lg:p-12">
                {/* Breadcrumb / Title Area */}
                {(activeTab == 'Home') &&
                    <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-3xl font-black text-slate-900 tracking-tight">{activeTab}</h2>
                            <p className="text-slate-500 font-medium">Monitoring and managing your digital infrastructure.</p>
                        </div>
                    </div>
                }

                <section>
                    {renderContent()}
                </section>
            </main>
        </div>
    );
};

export default Dashboard;