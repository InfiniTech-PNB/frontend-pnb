import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, Legend } from 'recharts';
import { Globe, Server, ShieldCheck, ShieldAlert, Loader2, Activity, Cpu, LayoutGrid } from 'lucide-react';
import API from "../../../services/api";

const ChartContainer = ({ title, children, className = "" }) => (
    <div className={`editorial-shell p-6 rounded-2xl flex flex-col h-[320px] ${className}`}>
        <h4 className="editorial-label mb-4 text-slate-500">{title}</h4>
        <div className="flex-1 relative w-full h-full">
            {children}
        </div>
    </div>
);

const HomeTab = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await API.get("/dashboard/stats");
                setStats(res.data);
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="py-60 flex justify-center">
                <Loader2 className="animate-spin" style={{ color: 'var(--primary)' }} size={48} />
            </div>
        );
    }

    const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

    return (
        <div className="space-y-8 animate-in fade-in duration-700 px-1">

            <section className="editorial-shell p-8 lg:p-10">
                <p className="editorial-label mb-4" style={{ color: 'var(--tertiary)' }}>System Audit Phase 01</p>
                <h1 className="editorial-title text-4xl lg:text-6xl leading-tight">Security Hygiene & Audit Coverage</h1>
                <p className="mt-5 max-w-4xl text-sm lg:text-lg text-slate-600 leading-relaxed">
                    An archival-grade analysis of infrastructure integrity across asset distribution,
                    cryptographic readiness, and operational exposure.
                </p>
            </section>

            {/* 1. TOP HUD - 5 Column Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                <StatCard label="Total Assets" val={stats.totalAssets} icon={LayoutGrid} />
                <StatCard label="Public Web Apps" val={stats.publicWebApps} icon={Globe} />
                <StatCard label="APIs" val={stats.apis} icon={Activity} />
                <StatCard label="Servers" val={stats.servers} icon={Server} />
                <StatCard label="Expiring Certs" val={stats.expiringCerts} icon={ShieldAlert} />
                <StatCard label="High Risk Assets" val={stats.highRiskAssets} icon={ShieldAlert} />
            </div>

            {/* 2. CHARTS GRID - Precise Positioning */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Asset Type Distribution (Matches Reference Image) */}
                <ChartContainer title="Asset Type Distribution">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={stats.typeDistribution}
                                innerRadius={70}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                                stroke="none"
                                cx="30%" // Moves pie to the left to make room for legend on the right
                            >
                                {stats.typeDistribution?.map((entry, i) => (
                                    <Cell key={i} fill={entry.color || COLORS[i % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ background: '#ffffff', border: '1px solid #c3c6d5', borderRadius: '8px', fontSize: '10px' }}
                                itemStyle={{ color: '#1b1c1d' }}
                            />
                            {/* Added Legend on the right side */}
                            <Legend
                                layout="vertical"
                                verticalAlign="middle"
                                align="right"
                                wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', letterSpacing: '0.05em' }}
                                formatter={(value, entry) => {
                                    const { payload } = entry;
                                    return (
                                        <span className="text-slate-400 uppercase ml-2">
                                            {value} <span className="text-slate-900 ml-2">{payload.value}</span>
                                        </span>
                                    );
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartContainer>
                {/* Risk Distribution (Multi-Color Bar) */}
                <ChartContainer title="Asset Risk Distribution">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={stats.riskDistribution} margin={{ top: 10, right: 10, left: -30, bottom: 0 }}>
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
                            <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ background: '#ffffff', border: '1px solid #c3c6d5' }} />
                            <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={30}>
                                {stats.riskDistribution?.map((entry, index) => (
                                    <Cell key={index} fill={entry.name === 'High' ? '#ef4444' : entry.name === 'Medium' ? '#f59e0b' : '#10b981'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </ChartContainer>

                {/* Expiry Timeline (Horizontal Progress) */}
                <div className="editorial-shell p-6 rounded-2xl h-[320px]">
                    <h4 className="editorial-label mb-8 text-slate-500">Cert Expiry Timeline</h4>
                    <div className="space-y-6">
                        {stats.certExpiry?.map((item, i) => (
                            <div key={i}>
                                <div className="flex justify-between text-[10px] font-black uppercase mb-2">
                                    <span className="text-slate-500">{item.name}</span>
                                    <span className="text-slate-800">{item.value}</span>
                                </div>
                                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                                    <div
                                        className="h-full transition-all duration-1000"
                                        style={{
                                            width: `${(item.value / (stats.totalAssets || 1)) * 100}%`,
                                            backgroundColor: item.name.includes('0-30') ? '#ef4444' : item.name.includes('30-90') ? '#f59e0b' : '#10b981'
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* IP Version Breakdown (Centered Text Fix) */}
                <ChartContainer title="IP Version Breakdown">
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-3xl font-black text-slate-900 leading-none">{stats.ipBreakdown?.ipv4 || 0}%</span>
                        <span className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter">IPv4 Global</span>
                    </div>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={[{ v: stats.ipBreakdown?.ipv4 }, { v: stats.ipBreakdown?.ipv6 }]} innerRadius={65} outerRadius={80} startAngle={90} endAngle={450} dataKey="v" stroke="none">
                                <Cell fill="#3b82f6" />
                                <Cell fill="#1e293b" />
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </div>

            {/* --- New Section: Security Hygiene --- */}
            <div className="pt-6 border-t border-slate-200">
                <h3 className="editorial-label mb-6">Security Hygiene & Audit Coverage</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Chart A: Inventory Audit Status */}
                    <ChartContainer title="Inventory Audit Status">
                        {/* 1. Ensure the parent of ResponsiveContainer has a relative height */}
                        <div className="relative w-full h-full min-h-[200px]">

                            {/* 2. Absolute center HUD text */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
                                <span className="text-2xl font-black text-slate-900">
                                    {stats.totalAssets > 0 ? Math.round((stats.scannedAssetsCount / stats.totalAssets) * 100) : 0}%
                                </span>
                                <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Coverage</span>
                            </div>

                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={stats.auditCoverage}
                                        innerRadius={60}
                                        outerRadius={80}
                                        dataKey="value"
                                        stroke="none"
                                        // Start animation from the top
                                        startAngle={90}
                                        endAngle={450}
                                    >
                                        {stats.auditCoverage?.map((entry, i) => (
                                            <Cell key={i} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid #c3c6d5' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </ChartContainer>

                    {/* Chart B: PQC Adoption Rate */}
                    <ChartContainer title="PQC Adoption (Scanned Assets)">
                        {/* 1. Wrapper with explicit relative positioning and height */}
                        <div className="relative w-full h-full min-h-[220px]">

                            {/* 2. Absolute center HUD text (Z-index 10 to stay on top) */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
                                <ShieldCheck size={20} className="text-purple-500 mb-1" />
                                <span className="text-xl font-black text-slate-900">{stats.pqcReadyAssets || 0}</span>
                                <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Safe Nodes</span>
                            </div>

                            {/* 3. The PieChart with ResponsiveContainer */}
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={stats.pqcAdoption}
                                        innerRadius={60}
                                        outerRadius={80}
                                        dataKey="value"
                                        stroke="none"
                                        // Animation stability fixes
                                        startAngle={90}
                                        endAngle={450}
                                        isAnimationActive={true}
                                    >
                                        {stats.pqcAdoption?.map((entry, i) => (
                                            <Cell key={`cell-${i}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ background: '#ffffff', border: '1px solid #c3c6d5', borderRadius: '8px' }}
                                        itemStyle={{ color: '#1b1c1d', fontSize: '10px' }}
                                    />
                                    <Legend
                                        verticalAlign="bottom"
                                        height={36}
                                        iconType="circle"
                                        wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', paddingTop: '10px' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </ChartContainer>
                </div>
            </div>

            {/* 3. LOWER SECTION - Asset Inventory & Overview */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 editorial-shell rounded-2xl overflow-hidden">
                    <div className="p-5 border-b border-slate-200 flex justify-between items-center">
                        <h4 className="editorial-label text-slate-500">Asset Inventory</h4>
                    </div>
                    <div className="overflow-x-auto h-[300px]">
                        <table className="w-full text-left">
                            <thead className="bg-slate-100 sticky top-0 text-[9px] font-black uppercase text-slate-500">
                                <tr>
                                    <th className="p-4">Asset Name</th>
                                    <th className="p-4">IP Address</th>
                                    <th className="p-4">Type</th>
                                    <th className="p-4">Risk</th>
                                </tr>
                            </thead>
                            <tbody className="text-[11px] font-bold text-slate-700">
                                {stats.recentAssets?.map((a, i) => (
                                    <tr key={i} className="border-t border-slate-200 hover:bg-slate-50 transition-colors">
                                        <td className="p-4 text-blue-700">{a.host}</td>
                                        <td className="p-4 font-mono text-slate-500">{a.ip}</td>
                                        <td className="p-4">{a.assetType}</td>
                                        <td className="p-4 text-center">
                                            <span className={`px-2 py-0.5 rounded text-[8px] uppercase ${a.risk === 'High' ? 'bg-red-500/20 text-red-500' : 'bg-emerald-500/20 text-emerald-500'}`}>{a.risk}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="editorial-shell rounded-2xl p-6 h-[380px] flex flex-col">
                    <h4 className="editorial-label mb-6 text-slate-500 italic">
                        Crypto & Security Overview
                    </h4>
                    <div className="space-y-3 overflow-y-auto flex-1 pr-2 custom-scrollbar">
                        {stats.cryptoOverview?.map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 hover:border-blue-300 transition-all group">
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center ${item.isPqc ? 'text-emerald-500' : 'text-slate-500'}`}>
                                        <Cpu size={16} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-900 group-hover:text-blue-700 transition-colors">{item.asset}</p>
                                        <p className={`text-[8px] font-bold uppercase tracking-tighter ${item.isPqc ? 'text-emerald-500' : 'text-slate-500'}`}>
                                            {item.isPqc && <span className="mr-1">⚡</span>}
                                            {item.displayAlgo}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className={`text-[9px] font-black ${item.isPqc ? 'text-emerald-400' : 'text-slate-400'}`}>
                                        {item.isPqc ? 'PQC-SAFE' : `${item.keyLength}-bit`}
                                    </p>
                                    <p className="text-[8px] text-slate-600 font-bold">{item.tls}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ label, val, icon: Icon }) => (
    <div className="editorial-shell rounded-xl p-5 flex items-center gap-4 border-b-2" style={{ borderBottomColor: 'color-mix(in srgb, var(--primary) 34%, var(--outline))' }}>
        <div className="p-3 bg-slate-100 rounded-xl text-blue-700"><Icon size={20} /></div>
        <div>
            <p className="editorial-label text-slate-500">{label}</p>
            <h3 className="text-2xl font-black text-slate-900">{val}</h3>
        </div>
    </div>
);

export default HomeTab;