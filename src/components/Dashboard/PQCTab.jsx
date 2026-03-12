import React from 'react';
import {
    ShieldCheck, AlertCircle, BarChart,
    PieChart as PieIcon, Grid, List,
    ChevronRight, CheckCircle2, XCircle
} from 'lucide-react';

const PQCTab = () => {
    // Sample Data from Image
    const classificationStats = [
        { grade: "A+", count: 37, color: "bg-emerald-500" },
        { grade: "A-", count: 2, color: "bg-red-500" },
        { grade: "B", count: 4, color: "bg-amber-500" },
    ];

    const assets = [
        { name: "Digigrihavatika.pnbuat.bank.in", ip: "103.109.225.128", support: true },
        { name: "wcw.pnb.bank.in", ip: "103.109.225.201", support: true },
        { name: "Wbbgb.pnbuk.bank.in", ip: "103.109.224.249", support: false },
    ];

    const recommendations = [
        "Upgrade to TLS 1.3 with PQC",
        "Implement Kyber for Key Exchange",
        "Update Cryptographic Libraries",
        "Develop PQC Migration Plan"
    ];

    return (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-700 pb-10">

            {/* --- TOP HEADER STRIP --- */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-xl">
                <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                    <ShieldCheck className="text-amber-500 w-5 h-5" /> PQC Compliance Dashboard
                </h3>
                <div className="flex gap-6 text-[10px] font-bold uppercase tracking-wider">
                    <span className="text-emerald-400">Elite-PQC Ready: <span className="text-white">45%</span></span>
                    <span className="text-yellow-400">Standard: <span className="text-white">30%</span></span>
                    <span className="text-orange-400">Legacy: <span className="text-white">15%</span></span>
                    <span className="text-red-500">Critical Apps: <span className="text-white">8</span></span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* --- LEFT COLUMN: CLASSIFICATION & ASSETS --- */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Assets by Classification Grade */}
                    <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-2">
                            <BarChart className="w-4 h-4 text-blue-500" /> Assets by Classification Grade
                        </h4>
                        <div className="flex items-end justify-around h-48 px-10">
                            {classificationStats.map((item) => (
                                <div key={item.grade} className="flex flex-col items-center gap-4 w-16">
                                    <span className="text-2xl font-black text-slate-800">{item.count}</span>
                                    <div className={`w-full rounded-t-xl transition-all duration-1000 ${item.color}`} style={{ height: `${(item.count / 40) * 100}%` }}></div>
                                    <div className="px-4 py-1 bg-slate-100 rounded-lg text-[10px] font-black text-slate-500">{item.grade}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Asset Names & Support List */}
                    <div className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-sm">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    <th className="px-8 py-4">Assets Name</th>
                                    <th className="px-8 py-4 text-right">PQC Support</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {assets.map((asset, i) => (
                                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-8 py-4">
                                            <p className="text-xs font-bold text-slate-800">{asset.name}</p>
                                            <p className="text-[10px] text-slate-400 font-mono mt-1">({asset.ip})</p>
                                        </td>
                                        <td className="px-8 py-4 flex justify-end">
                                            {asset.support ?
                                                <CheckCircle2 className="text-emerald-500 w-5 h-5" /> :
                                                <XCircle className="text-red-500 w-5 h-5" />
                                            }
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* --- RIGHT COLUMN: STATUS & RISK --- */}
                <div className="space-y-6">

                    {/* Application Status Pie Chart Placeholder */}
                    <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Application Status</h4>
                        <div className="relative w-40 h-40 mx-auto mb-6">
                            <div className="absolute inset-0 rounded-full border-[20px] border-slate-100"></div>
                            {/* This mimics the multi-colored pie from image */}
                            <div className="absolute inset-0 rounded-full border-[20px] border-emerald-500 border-t-transparent border-r-transparent rotate-45"></div>
                            <div className="absolute inset-0 rounded-full border-[20px] border-orange-500 border-l-transparent border-b-transparent -rotate-12"></div>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-xl font-black text-slate-800">45%</span>
                                <span className="text-[8px] font-bold text-slate-400 uppercase">Ready</span>
                            </div>
                        </div>
                        <div className="space-y-2 text-[10px] font-bold text-slate-500 uppercase">
                            <div className="flex items-center justify-between">
                                <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Elite-PQC</span>
                                <span className="text-slate-800">45%</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-orange-500"></div> Standard</span>
                                <span className="text-slate-800">30%</span>
                            </div>
                        </div>
                    </div>

                    {/* Risk Overview Matrix */}
                    <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Risk Overview</h4>
                        <div className="grid grid-cols-4 gap-1 mb-4">
                            {[...Array(12)].map((_, i) => (
                                <div key={i} className={`h-8 rounded ${i < 3 ? 'bg-red-400' : i < 7 ? 'bg-orange-300' : 'bg-emerald-300'}`}></div>
                            ))}
                        </div>
                        <div className="flex flex-col gap-2 text-[9px] font-black uppercase tracking-tighter">
                            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-red-400"></div> High Risk</div>
                            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-orange-300"></div> Medium Risk</div>
                            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-emerald-300"></div> Low Risk</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- BOTTOM SECTION: RECOMMENDATIONS & DETAILS --- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Improvement Recommendations</h4>
                    <div className="space-y-3">
                        {recommendations.map((text, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-amber-200 transition-all cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white rounded-xl shadow-sm"><AlertCircle size={14} className="text-amber-500" /></div>
                                    <span className="text-xs font-bold text-slate-700">{text}</span>
                                </div>
                                <ChevronRight size={14} className="text-slate-300 group-hover:text-amber-500 transition-colors" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* App A Details (Matches sidebar card in image) */}
                <div className="bg-[#0f172a] text-white rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-10 opacity-10"><ShieldCheck size={120} /></div>
                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6">Focused Asset Details</h4>
                    <div className="space-y-6 relative z-10">
                        <div>
                            <h3 className="text-2xl font-black tracking-tight text-amber-400">App A</h3>
                            <p className="text-slate-400 text-[10px] font-bold uppercase">Critical Infrastructure Asset</p>
                        </div>
                        <div className="grid grid-cols-2 gap-y-4 text-xs">
                            <div><p className="text-slate-500 font-bold uppercase text-[9px]">Owner</p><p className="font-bold">Team 1</p></div>
                            <div><p className="text-slate-500 font-bold uppercase text-[9px]">Exposure</p><p className="font-bold">Internet</p></div>
                            <div><p className="text-slate-500 font-bold uppercase text-[9px]">Protocol</p><p className="font-bold text-emerald-400">TLS 1.3 / Kyber</p></div>
                            <div><p className="text-slate-500 font-bold uppercase text-[9px]">Score</p><p className="font-bold text-red-500 underline">480 (Critical)</p></div>
                        </div>
                        <div className="pt-4 border-t border-slate-800">
                            <span className="px-4 py-2 bg-slate-800 rounded-full text-[10px] font-black uppercase text-slate-300">Status: Legacy Migration</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PQCTab;