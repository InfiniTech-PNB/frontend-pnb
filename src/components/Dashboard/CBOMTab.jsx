import React from 'react';
import {
    FileCode, ShieldCheck, AlertTriangle,
    BarChart3, PieChart, Activity, Lock
} from 'lucide-react';

const CBOMTab = () => {
    const summaryStats = [
        { label: "Total Applications", count: 17, color: "text-blue-400" },
        { label: "Sites Surveyed", count: 56, color: "text-emerald-400" },
        { label: "Active Certificates", count: 93, color: "text-cyan-400" },
        { label: "Weak Cryptography", count: 22, icon: AlertTriangle, color: "text-orange-400" },
        { label: "Certificate Issues", count: 7, icon: ShieldCheck, color: "text-red-400" },
    ];

    const cryptoData = [
        { app: "portal.company.com", key: "2048-Bit", cipher: "ECDHE-RSA-AES256-GCM-SHA384", authority: "DigiCert", status: "secure" },
        { app: "portal.company.com", key: "1024-Bit", cipher: "TLS_RSA_WITH_DES_CBC_SHA", authority: "COMODO", status: "weak" },
        { app: "vpn.company.com", key: "4096-Bit", cipher: "ECDHE-RSA-AES128-GCM-SHA384", authority: "COMODO", status: "secure" },
        { app: "auth.pnb.bank.in", key: "4096-Bit", cipher: "TLS_AES_256_GCM_SHA384", authority: "loopDot", status: "secure" },
    ];

    return (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-700 pb-10">

            {/* --- HEADER --- */}
            <div className="flex flex-col gap-2">
                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                    <FileCode className="text-amber-500" /> Cryptographic Bill of Materials
                </h3>
                <p className="text-slate-500 font-medium text-sm">Inventory of cryptographic assets and encryption protocols across the infrastructure.</p>
            </div>

            {/* --- TOP SUMMARY TILES --- */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {summaryStats.map((stat, i) => (
                    <div key={i} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg relative overflow-hidden group">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">{stat.label}</p>
                        <h3 className={`text-3xl font-black ${stat.color} tracking-tighter`}>{stat.count}</h3>
                        {stat.icon && <stat.icon className="absolute top-2 right-2 w-4 h-4 text-slate-700 opacity-50" />}
                    </div>
                ))}
            </div>

            {/* --- ANALYTICS ROW --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Key Length Distribution */}
                <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-6 shadow-xl">
                    <h4 className="text-[11px] font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-amber-500" /> Key Length Distribution
                    </h4>
                    <div className="h-48 flex items-end justify-between gap-3 px-2">
                        {[90, 60, 40, 30, 15].map((h, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                <div className="w-full bg-slate-800 rounded-t-lg relative h-40">
                                    <div
                                        className={`absolute bottom-0 w-full rounded-t-lg transition-all duration-1000 ${i === 0 ? 'bg-emerald-500' : i === 1 ? 'bg-blue-500' : i === 2 ? 'bg-cyan-500' : 'bg-orange-500'
                                            }`}
                                        style={{ height: `${h}%` }}
                                    ></div>
                                </div>
                                <span className="text-[9px] font-bold text-slate-500 tracking-tighter italic">
                                    {[4096, 3072, 2048, 2044, 227][i]}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Cipher Usage List */}
                <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-6 shadow-xl">
                    <h4 className="text-[11px] font-black text-white uppercase tracking-widest mb-6">Cipher Usage</h4>
                    <div className="space-y-3">
                        {[
                            { label: 'ECDHE-RSA-AES256-GCM', count: 29 },
                            { label: 'ECDHE-ECDSA-AES256', count: 23 },
                            { label: 'AES256-GCM-SHA384', count: 19 },
                            { label: 'AES128-GCM-SHA256', count: 15 },
                            { label: 'TLS_RSA_WITH_DES', count: 9 },
                        ].map((cipher, i) => (
                            <div key={i} className="flex flex-col gap-1">
                                <div className="flex justify-between text-[10px] font-bold">
                                    <span className="text-slate-400 truncate w-48">{cipher.label}</span>
                                    <span className="text-amber-500">{cipher.count}</span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-amber-500/60" style={{ width: `${(cipher.count / 30) * 100}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Encryption Protocols (Donut) */}
                <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-6 shadow-xl flex flex-col justify-between">
                    <h4 className="text-[11px] font-black text-white uppercase tracking-widest mb-4">Encryption Protocols</h4>
                    <div className="flex items-center justify-center py-4">
                        <div className="relative w-36 h-36">
                            <div className="absolute inset-0 rounded-full border-[12px] border-slate-800"></div>
                            <div className="absolute inset-0 rounded-full border-[12px] border-blue-500 border-t-transparent border-r-transparent -rotate-45"></div>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-2xl font-black text-white">88%</span>
                                <span className="text-[8px] font-bold text-slate-500 uppercase">TLS 1.2+</span>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[9px] font-bold text-slate-500 uppercase">
                        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500"></div> TLS 1.2</div>
                        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-slate-700"></div> TLS 1.1</div>
                    </div>
                </div>
            </div>

            {/* --- MAIN TABLE SECTION --- */}
            <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
                <div className="px-8 py-5 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
                    <h4 className="font-black text-white uppercase tracking-widest text-xs flex items-center gap-2">
                        <Lock className="w-4 h-4 text-amber-500" /> Top Certificate Authorities
                    </h4>
                    <button className="text-[10px] font-black text-amber-500 hover:underline uppercase tracking-widest">Full Inventory</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-[11px]">
                        <thead>
                            <tr className="bg-slate-800/50">
                                <th className="px-8 py-4 font-black text-slate-500 uppercase">Application</th>
                                <th className="px-8 py-4 font-black text-slate-500 uppercase text-center">Key Length</th>
                                <th className="px-8 py-4 font-black text-slate-500 uppercase">Cipher</th>
                                <th className="px-8 py-4 font-black text-slate-500 uppercase">Certificate Authority</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {cryptoData.map((row, i) => (
                                <tr key={i} className="hover:bg-white/5 transition-colors border-slate-800">
                                    <td className="px-8 py-4 font-bold text-blue-400">{row.app}</td>
                                    <td className="px-8 py-4 text-center">
                                        <span className={`px-3 py-1 rounded-full font-bold text-[10px] ${row.key === '1024-Bit' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                            }`}>
                                            {row.key}
                                        </span>
                                    </td>
                                    <td className="px-8 py-4 text-slate-400 font-mono text-[10px] italic">{row.cipher}</td>
                                    <td className="px-8 py-4">
                                        <div className="flex items-center gap-2">
                                            <ShieldCheck className={`w-3 h-3 ${row.status === 'weak' ? 'text-orange-500' : 'text-emerald-500'}`} />
                                            <span className="font-bold text-slate-300">{row.authority}</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CBOMTab;