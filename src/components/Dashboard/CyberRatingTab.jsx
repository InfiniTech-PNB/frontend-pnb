import React from 'react';
import {
    Zap,
    ShieldCheck,
    AlertTriangle,
    Search,
    Download,
    Filter,
    Info,
    TrendingUp
} from 'lucide-react';

const CyberRatingTab = () => {
    const applicationInventory = [
        { app: "App A", owner: "Team 1", exposure: "Internet", status: "Legacy", rating: 480, level: "Critical" },
        { app: "App B", owner: "Team 2", exposure: "Public", status: "Standard", rating: 670, level: "Moderate" },
        { app: "App C", owner: "Team 3", exposure: "Internal", status: "Elite-PQC", rating: 750, level: "Secure" },
        { app: "App D", owner: "Team 1", exposure: "Internet", status: "Standard", rating: 590, level: "Moderate" },
        { app: "App E", owner: "Team 4", exposure: "VPC", status: "Elite-PQC", rating: 810, level: "Secure" },
    ];

    // Helper to get color based on PQC Rating
    const getRatingStyles = (score) => {
        if (score < 500) return "bg-red-500 text-white shadow-red-200";
        if (score < 700) return "bg-amber-500 text-white shadow-amber-200";
        return "bg-emerald-500 text-white shadow-emerald-200";
    };

    const getStatusIcon = (status) => {
        if (status === "Legacy") return <AlertTriangle className="w-3 h-3 text-red-500" />;
        if (status === "Standard") return <Info className="w-3 h-3 text-amber-500" />;
        return <ShieldCheck className="w-3 h-3 text-emerald-500" />;
    };

    return (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-700 pb-10">

            {/* --- HEADER --- */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                        <Zap className="text-amber-500" /> Cyber Innovation Rating
                    </h3>
                    <p className="text-slate-500 font-medium text-sm">Real-time PQC readiness and security posture scoring for integrated applications.</p>
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-black uppercase text-slate-600 hover:bg-slate-50 transition-all">
                        <Download size={14} /> Export CSV
                    </button>
                </div>
            </div>

            {/* --- QUICK METRICS --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="p-4 bg-red-50 rounded-2xl text-red-500"><AlertTriangle /></div>
                    <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Critical Risks</p><p className="text-2xl font-black text-slate-800">01</p></div>
                </div>
                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="p-4 bg-emerald-50 rounded-2xl text-emerald-500"><ShieldCheck /></div>
                    <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Fully Compliant</p><p className="text-2xl font-black text-slate-800">02</p></div>
                </div>
                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4 text-white bg-[#0f172a]">
                    <div className="p-4 bg-amber-500/20 rounded-2xl text-amber-500"><TrendingUp /></div>
                    <div><p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Avg Rating</p><p className="text-2xl font-black text-amber-400">660</p></div>
                </div>
            </div>

            {/* --- APPLICATION INVENTORY TABLE (Matches Image Reference) --- */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden relative">
                <div className="px-8 py-6 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/30">
                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Application Inventory</h4>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <div className="relative flex-1 sm:flex-none">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 w-4 h-4" />
                            <input type="text" placeholder="Search apps..." className="w-full bg-white border border-slate-200 rounded-full py-2 pl-9 pr-4 text-xs focus:outline-none focus:border-amber-400 font-medium" />
                        </div>
                        <button className="p-2 bg-white border border-slate-200 rounded-full text-slate-400 hover:text-amber-500 transition-all"><Filter size={16} /></button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Application</th>
                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Owner</th>
                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Exposure</th>
                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">PQC Rating</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {applicationInventory.map((item, i) => (
                                <tr key={i} className="hover:bg-slate-50 transition-all group">
                                    <td className="px-8 py-5">
                                        <span className="text-sm font-black text-slate-800 tracking-tight group-hover:text-amber-600 transition-colors uppercase">
                                            {item.app}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-xs text-slate-500 font-bold">{item.owner}</td>
                                    <td className="px-8 py-5 text-xs text-slate-500 font-bold italic">{item.exposure}</td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full w-fit">
                                            {getStatusIcon(item.status)}
                                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-tight">{item.status}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex justify-center">
                                            <div className={`w-32 py-1.5 rounded-lg flex items-center justify-between px-3 shadow-md transform group-hover:scale-105 transition-transform ${getRatingStyles(item.rating)}`}>
                                                <span className="text-[10px] font-black uppercase tracking-tighter">{item.level}</span>
                                                <span className="text-sm font-black">{item.rating}</span>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="px-8 py-5 bg-slate-50/30 border-t border-slate-50">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] text-center italic">
                        Punjab National Bank © Secure Rating System 2026
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CyberRatingTab;