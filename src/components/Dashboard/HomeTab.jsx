import React from 'react';
import {
    PieChart, LayoutGrid, BarChart3,
    Database, ShieldCheck, Clock, Radio
} from 'lucide-react';

const HomeTab = () => {
    const summaryStats = [
        { label: "Total Assets", count: 128, color: "text-blue-400" },
        { label: "Public Web Apps", count: 42, color: "text-emerald-400" },
        { label: "APIs", count: 26, color: "text-cyan-400" },
        { label: "Servers", count: 37, color: "text-indigo-400" },
        { label: "Expiring Certificates", count: 9, color: "text-orange-400" },
        { label: "High Risk Assets", count: 14, color: "text-red-400" },
    ];

    const inventoryData = [
        { name: "portal.company.com", url: "https://portal.company.com", type: "Web App", risk: "High", key: "2048-bit", scan: "2 hrs ago" },
        { name: "api.company.com", url: "https://api.company.com", type: "API", risk: "Medium", key: "4096-bit", scan: "5 hrs ago" },
        { name: "vpn.company.com", url: "https://vpn.company.com", type: "Gateway", risk: "Critical", key: "1024-bit", scan: "1 hr ago" },
        { name: "mail.company.com", url: "https://mail.company.com", type: "Server", risk: "Low", key: "3072-bit", scan: "1 day ago" },
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-700 pb-10 bg-slate-950 p-6 rounded-[3rem]">

            {/* --- SECTION 1: TOP SUMMARY TILES --- */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {summaryStats.map((stat, i) => (
                    <div key={i} className="bg-[#0f172a] border border-slate-800 p-4 rounded-xl shadow-lg">
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">{stat.label}</p>
                        <h3 className={`text-3xl font-black ${stat.color} tracking-tighter`}>{stat.count}</h3>
                    </div>
                ))}
            </div>

            {/* --- SECTION 2: ENHANCED ANALYTICS ROW (As requested) --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                {/* Asset Type Distribution */}
                <div className="bg-[#0f172a] border border-slate-800 rounded-[2rem] p-6">
                    <h4 className="text-[11px] font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                        <PieChart className="w-4 h-4 text-blue-400" /> Asset Type Distribution
                    </h4>
                    <div className="relative h-40 flex items-center justify-center">
                        <div className="w-32 h-32 rounded-full border-[12px] border-slate-800 flex items-center justify-center relative">
                            <div className="absolute inset-0 rounded-full border-[12px] border-blue-500 border-t-transparent border-r-transparent rotate-45"></div>
                            <span className="text-xl font-black text-white">128</span>
                        </div>
                    </div>
                    <div className="mt-4 flex justify-between text-[9px] font-bold text-slate-400 uppercase">
                        <div className="flex items-center gap-1"><span className="w-2 h-2 bg-blue-500 rounded-full"></span> Web Apps</div>
                        <div className="flex items-center gap-1"><span className="w-2 h-2 bg-indigo-500 rounded-full"></span> Servers</div>
                    </div>
                </div>

                {/* Asset Risk Distribution */}
                <div className="bg-[#0f172a] border border-slate-800 rounded-[2rem] p-6">
                    <h4 className="text-[11px] font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-orange-400" /> Asset Risk Distribution
                    </h4>
                    <div className="h-40 flex items-end justify-between gap-2 px-2">
                        {[80, 40, 60, 20].map((h, i) => (
                            <div key={i} className="w-full bg-slate-800 rounded-t-lg relative h-full flex items-end">
                                <div className={`w-full rounded-t-md transition-all duration-1000 ${i === 0 ? 'bg-red-500' : 'bg-orange-500'}`} style={{ height: `${h}%` }}></div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 flex justify-between text-[9px] font-black text-slate-500 uppercase tracking-tighter">
                        <span>Critical</span><span>High</span><span>Med</span><span>Low</span>
                    </div>
                </div>

                {/* Expiry Timeline */}
                <div className="bg-[#0f172a] border border-slate-800 rounded-[2rem] p-6">
                    <h4 className="text-[11px] font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-emerald-400" /> Expiry Timeline
                    </h4>
                    <div className="space-y-4 pt-2">
                        {['0-30 Days', '30-60 Days', '60-90 Days', '>90 Days'].map((label, i) => (
                            <div key={label} className="flex flex-col gap-1">
                                <span className="text-[9px] font-bold text-slate-400 uppercase">{label}</span>
                                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500" style={{ width: `${[25, 50, 20, 85][i]}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* IP Version Breakdown */}
                <div className="bg-[#0f172a] border border-slate-800 rounded-[2rem] p-6 flex flex-col justify-between">
                    <h4 className="text-[11px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                        <Radio className="w-4 h-4 text-cyan-400" /> IP Version Breakdown
                    </h4>
                    <div className="py-4 flex flex-col items-center">
                        <div className="text-5xl font-black text-white tracking-tighter mb-2">86% <span className="text-xs text-slate-500 font-bold tracking-normal italic">IPv4</span></div>
                        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden flex shadow-inner">
                            <div className="h-full bg-cyan-400 w-[86%] shadow-[0_0_10px_rgba(34,211,238,0.5)]"></div>
                            <div className="h-full bg-slate-700 w-[14%]"></div>
                        </div>
                    </div>
                    <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        <span>IPv4: 112</span>
                        <span>IPv6: 16</span>
                    </div>
                </div>
            </div>

            {/* --- SECTION 3: ASSET INVENTORY TABLE --- */}
            <div className="bg-[#0f172a] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
                <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/30">
                    <h4 className="font-black text-white uppercase tracking-widest text-xs flex items-center gap-2">
                        <LayoutGrid className="w-4 h-4 text-yellow-500" /> Asset Inventory Summary
                    </h4>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-[11px]">
                        <thead>
                            <tr className="bg-slate-900/50">
                                <th className="px-6 py-3 font-black text-slate-500 uppercase">Asset Name</th>
                                <th className="px-6 py-3 font-black text-slate-500 uppercase">URL</th>
                                <th className="px-6 py-3 font-black text-slate-500 uppercase">Type</th>
                                <th className="px-6 py-3 font-black text-slate-500 uppercase">Risk</th>
                                <th className="px-6 py-3 font-black text-slate-500 uppercase">Key Length</th>
                                <th className="px-6 py-3 font-black text-slate-500 uppercase">Last Scan</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {inventoryData.map((row, i) => (
                                <tr key={i} className="hover:bg-white/5 transition-colors border-slate-800">
                                    <td className="px-6 py-3 font-bold text-blue-400">{row.name}</td>
                                    <td className="px-6 py-3 text-slate-400 font-mono italic">{row.url}</td>
                                    <td className="px-6 py-3 text-slate-300 font-semibold">{row.type}</td>
                                    <td className="px-6 py-3">
                                        <span className={`px-2 py-0.5 rounded-[4px] font-black uppercase text-[9px] ${row.risk === 'Critical' ? 'bg-red-500 text-white' :
                                                row.risk === 'High' ? 'bg-orange-500 text-white' : 'bg-emerald-500 text-white'
                                            }`}>{row.risk}</span>
                                    </td>
                                    <td className="px-6 py-3 text-emerald-400 font-bold">{row.key}</td>
                                    <td className="px-6 py-3 text-slate-500 font-medium">{row.scan}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- SECTION 4: NAMESERVER & CRYPTO OVERVIEW --- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Nameserver Records */}
                <div className="bg-[#0f172a] border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
                    <div className="px-6 py-3 border-b border-slate-800 bg-slate-800/20 flex justify-between">
                        <h4 className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                            <Database className="w-3.5 h-3.5 text-blue-400" /> Nameserver Records
                        </h4>
                        <span className="text-[10px] text-slate-500 font-bold">Domain: company.com</span>
                    </div>
                    <table className="w-full text-left text-[10px]">
                        <thead>
                            <tr className="text-slate-500 border-b border-slate-800 bg-slate-900/50">
                                <th className="px-6 py-2">Hostname</th>
                                <th className="px-6 py-2">Type</th>
                                <th className="px-6 py-2">IP Address</th>
                                <th className="px-6 py-2">TTL</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800 text-slate-300">
                            <tr><td className="px-6 py-2">ns1.company.com</td><td className="px-6 py-2 text-blue-400 font-bold">NS</td><td className="px-6 py-2">192.0.2.10</td><td className="px-6 py-2">3600</td></tr>
                            <tr><td className="px-6 py-2 text-emerald-400 font-bold">www.company.com</td><td className="px-6 py-2">A</td><td className="px-6 py-2">34.12.11.45</td><td className="px-6 py-2">300</td></tr>
                        </tbody>
                    </table>
                </div>

                {/* Crypto Overview */}
                <div className="bg-[#0f172a] border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
                    <div className="px-6 py-3 border-b border-slate-800 bg-slate-800/20">
                        <h4 className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Crypto & Security Overview
                        </h4>
                    </div>
                    <table className="w-full text-left text-[10px]">
                        <thead>
                            <tr className="text-slate-500 border-b border-slate-800 bg-slate-900/50">
                                <th className="px-6 py-2">Asset</th>
                                <th className="px-6 py-2">Key Length</th>
                                <th className="px-6 py-2">Cipher Suite</th>
                                <th className="px-6 py-2">TLS</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800 text-slate-300">
                            <tr><td className="px-6 py-2">portal.company.com</td><td className="px-6 py-2 text-emerald-400 font-bold">2048-bit</td><td className="px-6 py-2">ECDHE-RSA-AES256</td><td className="px-6 py-2">1.2</td></tr>
                            <tr><td className="px-6 py-2 font-bold">api.company.com</td><td className="px-6 py-2 text-emerald-400 font-bold">4096-bit</td><td className="px-6 py-2">TLS_AES_256_GCM</td><td className="px-6 py-2">1.3</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default HomeTab;