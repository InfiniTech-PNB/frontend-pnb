import React, { useState, useEffect } from 'react';
import {
    PieChart, LayoutGrid, BarChart3,
    Database, ShieldCheck, Clock, Radio, 
    Globe, Zap, AlertTriangle, Loader2, Activity
} from 'lucide-react';
import API from "../../services/api";

const HomeTab = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalDomains: 0,
        totalAssets: 0,
        highRiskDomains: 0,
        pqcReadyAssets: 0,
        domainsList: []
    });

    // --- LOGIC: Fetch All Backend Data ---
    useEffect(() => {
        const fetchGlobalIntelligence = async () => {
            try {
                // 1. Fetch aggregate dashboard stats (counts)
                const statsRes = await API.get("/dashboard/stats");
                
                // 2. Fetch all domains for the status table
                const domainsRes = await API.get("/domains");
                
                setStats({
                    ...statsRes.data,
                    domainsList: domainsRes.data || []
                });
            } catch (err) {
                console.error("Dashboard sync failed:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchGlobalIntelligence();
    }, []);

    // Map Backend Stats to Tiles
    const summaryStats = [
        { label: "Managed Domains", count: stats.totalDomains, color: "text-blue-400" },
        { label: "Detected Assets", count: stats.totalAssets, color: "text-cyan-400" },
        { label: "PQC Compliant", count: stats.pqcReadyAssets, color: "text-emerald-400" },
        { label: "High Risk Nodes", count: stats.highRiskDomains, color: "text-red-400" },
        { label: "Average Risk Score", count: stats.totalAssets > 0 ? Math.round((stats.pqcReadyAssets / stats.totalAssets) * 100) : 0, color: "text-indigo-400", unit: "%" },
        { label: "Security Alerts", count: stats.highRiskDomains, color: "text-orange-400" },
    ];

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-40 bg-slate-950 rounded-[3rem]">
            <Loader2 className="animate-spin text-amber-500 mb-4" size={40} />
            <p className="text-slate-500 font-black uppercase tracking-widest text-[10px]">Fetching Live Database Stats...</p>
        </div>
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-700 pb-10 bg-slate-950 p-6 rounded-[3rem]">

            {/* --- SECTION 1: DYNAMIC SUMMARY TILES --- */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {summaryStats.map((stat, i) => (
                    <div key={i} className="bg-[#0f172a] border border-slate-800 p-5 rounded-2xl shadow-lg">
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">{stat.label}</p>
                        <h3 className={`text-3xl font-black ${stat.color} tracking-tighter`}>
                            {stat.count}{stat.unit}
                        </h3>
                    </div>
                ))}
            </div>

            {/* --- SECTION 2: LIVE ANALYTICS --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                {/* Compliance Percentage */}
                <div className="bg-[#0f172a] border border-slate-800 rounded-[2rem] p-6">
                    <h4 className="text-[11px] font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                        <PieChart className="w-4 h-4 text-blue-400" /> Global Compliance
                    </h4>
                    <div className="relative h-40 flex items-center justify-center">
                        <div className="w-32 h-32 rounded-full border-[12px] border-slate-800 flex items-center justify-center relative">
                            <div 
                                className="absolute inset-0 rounded-full border-[12px] border-emerald-500 border-t-transparent border-r-transparent rotate-45"
                                style={{ opacity: stats.pqcReadyAssets > 0 ? 1 : 0.1 }}
                            ></div>
                            <span className="text-xl font-black text-white">
                                {stats.totalAssets > 0 ? Math.round((stats.pqcReadyAssets / stats.totalAssets) * 100) : 0}%
                            </span>
                        </div>
                    </div>
                </div>

                {/* Risk Distribution Chart */}
                <div className="bg-[#0f172a] border border-slate-800 rounded-[2rem] p-6">
                    <h4 className="text-[11px] font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-orange-400" /> Risk Severity
                    </h4>
                    <div className="h-40 flex items-end justify-between gap-2 px-2">
                        {/* High Risk vs Total visualization */}
                        {[
                            (stats.highRiskDomains / stats.totalDomains) * 100 || 10,
                            30, 50, 20
                        ].map((h, i) => (
                            <div key={i} className="w-full bg-slate-800 rounded-t-lg h-full flex items-end">
                                <div className={`w-full rounded-t-md transition-all duration-1000 ${i === 0 ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 'bg-orange-500'}`} style={{ height: `${h}%` }}></div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Placeholder for future Cert logic */}
                <div className="bg-[#0f172a] border border-slate-800 rounded-[2rem] p-6">
                    <h4 className="text-[11px] font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-emerald-400" /> Asset Health
                    </h4>
                    <div className="space-y-4 pt-2">
                        <div className="flex flex-col gap-1">
                            <span className="text-[9px] font-bold text-slate-400 uppercase">PQC Ready Assets</span>
                            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500" style={{ width: `${(stats.pqcReadyAssets / stats.totalAssets) * 100}%` }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Adoption Status */}
                <div className="bg-[#0f172a] border border-slate-800 rounded-[2rem] p-6 flex flex-col justify-between">
                    <h4 className="text-[11px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                        <Activity className="w-4 h-4 text-cyan-400" /> PQC Adoption
                    </h4>
                    <div className="py-4 flex flex-col items-center">
                        <div className="text-5xl font-black text-white tracking-tighter mb-2">
                            {stats.pqcReadyAssets}
                        </div>
                        <p className="text-[10px] text-slate-500 font-black uppercase">Nodes Protected</p>
                    </div>
                </div>
            </div>

            {/* --- SECTION 3: INFRASTRUCTURE STATUS TABLE (Live Domains) --- */}
            <div className="bg-[#0f172a] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
                <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/30 flex justify-between items-center">
                    <h4 className="font-black text-white uppercase tracking-widest text-xs flex items-center gap-2">
                        <Database className="w-4 h-4 text-yellow-500" /> Registered Domain Status
                    </h4>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-[11px]">
                        <thead>
                            <tr className="bg-slate-900/50">
                                <th className="px-6 py-3 font-black text-slate-500 uppercase">Domain Name</th>
                                <th className="px-6 py-3 font-black text-slate-500 uppercase">Created At</th>
                                <th className="px-6 py-3 font-black text-slate-500 uppercase">Monitoring Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {stats.domainsList.length > 0 ? stats.domainsList.map((domain, i) => (
                                <tr key={i} className="hover:bg-white/5 transition-colors border-slate-800 text-slate-300">
                                    <td className="px-6 py-4 font-bold text-blue-400 italic uppercase">{domain.domainName}</td>
                                    <td className="px-6 py-4 text-slate-500">{new Date(domain.createdAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">
                                        <span className="bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded-[4px] text-[9px] font-black uppercase">Active</span>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="3" className="px-6 py-10 text-center text-slate-600 italic">No domain data found in database.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default HomeTab;