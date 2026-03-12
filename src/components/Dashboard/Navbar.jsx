import React from 'react';
import { ShieldCheck, LogOut } from 'lucide-react';

const Navbar = ({ menuItems, activeTab, setActiveTab, onLogout }) => {
    return (
        <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 px-6 py-3 shadow-sm">
            <div className="max-w-[1600px] mx-auto flex items-center justify-between">

                {/* Branding */}
                <div className="flex items-center gap-4">
                    <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-2 rounded-xl shadow-md">
                        <ShieldCheck className="text-amber-950 w-6 h-6" />
                    </div>
                    <h1 className="font-black text-xl tracking-tighter text-slate-900">PNB <span className="text-orange-500">SECURE</span></h1>
                </div>

                {/* Horizontal Links */}
                <div className="hidden lg:flex items-center gap-1">
                    {menuItems.map((item) => (
                        <button
                            key={item.name}
                            onClick={() => setActiveTab(item.name)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === item.name
                                ? 'bg-amber-50 text-amber-600'
                                : 'text-slate-500 hover:bg-slate-50'
                                }`}
                        >
                            <item.icon className={`w-4 h-4 ${activeTab === item.name ? 'text-amber-500' : 'text-slate-400'}`} />
                            {item.name}
                        </button>
                    ))}
                </div>

                {/* Logout */}
                <div className="flex items-center gap-4 border-l pl-6 border-slate-200">
                    <div className="text-right hidden sm:block">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Welcome User</p>
                        <p className="text-sm font-bold text-slate-700">hackathon_user</p>
                    </div>
                    <button
                        onClick={onLogout}
                        className="p-2.5 bg-slate-100 text-slate-500 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;