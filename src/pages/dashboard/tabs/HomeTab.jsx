import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, Legend, CartesianGrid } from 'recharts';
import { Globe, Server, ShieldCheck, ShieldAlert, Loader2, Activity, Cpu, LayoutGrid } from 'lucide-react';
import API from "../../../services/api";

const ChartContainer = ({ title, children, className = "" }) => (
    <div className={`editorial-shell relative overflow-hidden p-6 rounded-2xl flex flex-col h-80 ${className}`}>
        <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-blue-50/70 to-transparent" />
        <h4 className="relative z-10 editorial-label mb-4 text-xs sm:text-sm text-slate-500">{title}</h4>
        <div className="relative z-10 flex-1 w-full h-full">
            {children}
        </div>
    </div>
);

const DashboardTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;

    const point = payload[0];
    const name = point?.name || point?.payload?.name || label || 'Value';
    const value = point?.value ?? point?.payload?.value ?? 0;
    const color = point?.color || point?.payload?.fill || 'var(--primary)';

    return (
        <div className="rounded-xl border border-slate-200 bg-white/95 px-3 py-2 shadow-xl backdrop-blur-sm">
            <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">{name}</p>
            <div className="mt-1 flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
                <p className="text-sm font-black text-slate-900">{value}</p>
            </div>
        </div>
    );
};

const getExpiryPalette = (bucketName = '') => {
    if (bucketName.includes('0-30')) return ['#ef4444', '#f97316'];
    if (bucketName.includes('30-90')) return ['#f59e0b', '#facc15'];
    return ['#10b981', '#34d399'];
};

const CIRCULAR_CHART_CENTER_Y = '44%';

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
    const typeDistribution = stats.typeDistribution || [];
    const riskDistribution = stats.riskDistribution || [];
    const certExpiry = stats.certExpiry || [];
    const auditCoverage = stats.auditCoverage || [];
    const pqcAdoption = stats.pqcAdoption || [];
    const ipDistribution = [
        { name: 'IPv4', value: stats.ipBreakdown?.ipv4 || 0, color: '#2563eb' },
        { name: 'IPv6', value: stats.ipBreakdown?.ipv6 || 0, color: '#0f172a' }
    ];
    const maxExpiryValue = Math.max(1, ...certExpiry.map((item) => item.value || 0));

    return (
        <div className="space-y-8 animate-in fade-in duration-700 px-1">

            <section className="editorial-shell p-8 lg:p-10">
                <p className="editorial-label mb-4 text-xs sm:text-sm" style={{ color: 'var(--tertiary)' }}>System Audit Phase 01</p>
                <h1 className="editorial-title text-4xl lg:text-6xl leading-tight">Audit Coverage</h1>
                <p className="mt-5 max-w-4xl text-base lg:text-xl text-slate-600 leading-relaxed">
                    An archival-grade analysis of infrastructure integrity across asset distribution,
                    cryptographic readiness, and operational exposure.
                </p>
            </section>

            {/* 1. TOP HUD - 5 Column Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                <StatCard label="Total Assets" val={stats.totalAssets} statIcon={LayoutGrid} />
                <StatCard label="Public Web Apps" val={stats.publicWebApps} statIcon={Globe} />
                <StatCard label="APIs" val={stats.apis} statIcon={Activity} />
                <StatCard label="Servers" val={stats.servers} statIcon={Server} />
                <StatCard label="Expiring Certs" val={stats.expiringCerts} statIcon={ShieldAlert} />
                <StatCard label="High Risk Assets" val={stats.highRiskAssets} statIcon={ShieldAlert} />
            </div>

            {/* 2. CHARTS GRID - Precise Positioning */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Asset Type Distribution (Matches Reference Image) */}
                <ChartContainer title="Asset Type Distribution">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={typeDistribution}
                                innerRadius={58}
                                outerRadius={84}
                                paddingAngle={3}
                                cornerRadius={6}
                                dataKey="value"
                                stroke="#ffffff"
                                strokeWidth={2}
                                cx="50%"
                                cy={CIRCULAR_CHART_CENTER_Y}
                                isAnimationActive={true}
                                animationDuration={900}
                            >
                                {typeDistribution.map((entry, i) => (
                                    <Cell key={i} fill={entry.color || COLORS[i % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip content={<DashboardTooltip />} />
                            <Legend
                                verticalAlign="bottom"
                                align="center"
                                iconType="circle"
                                wrapperStyle={{ fontSize: '12px', fontWeight: 700, paddingTop: '8px' }}
                                formatter={(value, entry) => {
                                    return (
                                        <span className="text-slate-600 ml-1">
                                            {value} <span className="text-slate-900 font-black ml-1">{entry?.payload?.value ?? 0}</span>
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
                        <BarChart data={riskDistribution} margin={{ top: 10, right: 12, left: 0, bottom: 6 }} barCategoryGap="32%">
                            <CartesianGrid vertical={false} strokeDasharray="4 4" stroke="#dbe2ea" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 700 }} />
                            <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 700 }} />
                            <Tooltip content={<DashboardTooltip />} cursor={{ fill: 'rgba(148, 163, 184, 0.1)' }} />
                            <Bar dataKey="value" radius={[10, 10, 0, 0]} barSize={34}>
                                {riskDistribution.map((entry, index) => (
                                    <Cell key={index} fill={entry.name === 'High' ? '#ef4444' : entry.name === 'Medium' ? '#f59e0b' : '#10b981'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </ChartContainer>

                {/* Expiry Timeline (Horizontal Progress) */}
                <div className="editorial-shell relative overflow-hidden p-6 rounded-2xl h-80">
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-amber-50/70 to-transparent" />
                    <h4 className="relative z-10 editorial-label mb-8 text-slate-500">Cert Expiry Timeline</h4>
                    <div className="relative z-10 space-y-6">
                        {certExpiry.map((item, i) => {
                            const progress = Math.min(100, Math.round(((item.value || 0) / maxExpiryValue) * 100));
                            const palette = getExpiryPalette(item.name);

                            return (
                            <div key={i}>
                                <div className="flex justify-between text-xs sm:text-sm font-black uppercase mb-2">
                                    <span className="text-slate-500">{item.name}</span>
                                    <span className="text-slate-800">{item.value}</span>
                                </div>
                                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
                                    <div
                                        className="h-full rounded-full transition-all duration-1000"
                                        style={{
                                            width: `${progress}%`,
                                            background: `linear-gradient(90deg, ${palette[0]}, ${palette[1]})`,
                                            boxShadow: `0 0 14px -4px ${palette[0]}`
                                        }}
                                    />
                                </div>
                            </div>
                            );
                        })}
                    </div>
                </div>

                {/* IP Version Breakdown (Centered Text Fix) */}
                <ChartContainer title="IP Version Breakdown">
                    <div
                        className="absolute inset-x-0 -translate-y-1/2 flex flex-col items-center justify-center pointer-events-none"
                        style={{ top: CIRCULAR_CHART_CENTER_Y }}
                    >
                        <span className="text-3xl font-black text-slate-900 leading-none">{stats.ipBreakdown?.ipv4 || 0}%</span>
                        <span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-tighter">IPv4 Global</span>
                    </div>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={ipDistribution}
                                innerRadius={62}
                                outerRadius={84}
                                startAngle={90}
                                endAngle={450}
                                dataKey="value"
                                paddingAngle={2}
                                cornerRadius={6}
                                stroke="#ffffff"
                                strokeWidth={2}
                                cy={CIRCULAR_CHART_CENTER_Y}
                                isAnimationActive={true}
                                animationDuration={850}
                            >
                                {ipDistribution.map((entry, i) => (
                                    <Cell key={i} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip content={<DashboardTooltip />} />
                            <Legend
                                verticalAlign="bottom"
                                iconType="circle"
                                wrapperStyle={{ fontSize: '12px', fontWeight: 700, paddingTop: '0' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </div>

            {/* --- New Section: Security Hygiene --- */}
            <div className="pt-6 border-t border-slate-200">
                <h3 className="editorial-label mb-6 text-xs sm:text-sm">Security Hygiene & Audit Coverage</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Chart A: Inventory Audit Status */}
                    <ChartContainer title="Inventory Audit Status">
                        {/* 1. Ensure the parent of ResponsiveContainer has a relative height */}
                        <div className="relative w-full h-full min-h-50">

                            {/* 2. Absolute center HUD text */}
                            <div
                                className="absolute inset-x-0 -translate-y-1/2 flex flex-col items-center justify-center pointer-events-none z-10"
                                style={{ top: CIRCULAR_CHART_CENTER_Y }}
                            >
                                <span className="text-2xl font-black text-slate-900">
                                    {stats.totalAssets > 0 ? Math.round((stats.scannedAssetsCount / stats.totalAssets) * 100) : 0}%
                                </span>
                                <span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-widest">Coverage</span>
                            </div>

                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={auditCoverage}
                                        innerRadius={56}
                                        outerRadius={84}
                                        dataKey="value"
                                        stroke="#ffffff"
                                        strokeWidth={2}
                                        startAngle={90}
                                        endAngle={450}
                                        paddingAngle={2}
                                        cornerRadius={6}
                                        cy={CIRCULAR_CHART_CENTER_Y}
                                        isAnimationActive={true}
                                        animationDuration={900}
                                    >
                                        {auditCoverage.map((entry, i) => (
                                            <Cell key={i} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<DashboardTooltip />} />
                                    <Legend
                                        verticalAlign="bottom"
                                        iconType="circle"
                                        wrapperStyle={{ fontSize: '12px', fontWeight: 700, paddingTop: '10px' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </ChartContainer>

                    {/* Chart B: PQC Adoption Rate */}
                    <ChartContainer title="PQC Adoption (Scanned Assets)">
                        {/* 1. Wrapper with explicit relative positioning and height */}
                        <div className="relative w-full h-full min-h-55">

                            {/* 2. Absolute center HUD text (Z-index 10 to stay on top) */}
                            <div
                                className="absolute inset-x-0 -translate-y-1/2 flex flex-col items-center justify-center pointer-events-none z-10"
                                style={{ top: CIRCULAR_CHART_CENTER_Y }}
                            >
                                <ShieldCheck size={24} className="text-emerald-500 mb-1" />
                                <span className="text-2xl font-black text-slate-900">{stats.pqcReadyAssets || 0}</span>
                                <span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-widest">Safe Nodes</span>
                            </div>

                            {/* 3. The PieChart with ResponsiveContainer */}
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pqcAdoption}
                                        innerRadius={56}
                                        outerRadius={84}
                                        dataKey="value"
                                        stroke="#ffffff"
                                        strokeWidth={2}
                                        startAngle={90}
                                        endAngle={450}
                                        paddingAngle={2}
                                        cornerRadius={6}
                                        cy={CIRCULAR_CHART_CENTER_Y}
                                        isAnimationActive={true}
                                        animationDuration={900}
                                    >
                                        {pqcAdoption.map((entry, i) => (
                                            <Cell key={`cell-${i}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<DashboardTooltip />} />
                                    <Legend
                                        verticalAlign="bottom"
                                        height={34}
                                        iconType="circle"
                                        wrapperStyle={{ fontSize: '12px', fontWeight: 700, paddingTop: '10px' }}
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
                        <h4 className="editorial-label text-xs sm:text-sm text-slate-500">Asset Inventory</h4>
                    </div>
                    <div className="overflow-x-auto h-75">
                        <table className="w-full text-left">
                            <thead className="bg-slate-100 sticky top-0 text-[11px] sm:text-xs font-black uppercase text-slate-500">
                                <tr>
                                    <th className="p-4">Asset Name</th>
                                    <th className="p-4">IP Address</th>
                                    <th className="p-4">Type</th>
                                    <th className="p-4">Risk</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm font-bold text-slate-700">
                                {stats.recentAssets?.map((a, i) => (
                                    <tr key={i} className="border-t border-slate-200 hover:bg-slate-50 transition-colors">
                                        <td className="p-4 text-blue-700">{a.host}</td>
                                        <td className="p-4 font-mono text-slate-500">{a.ip}</td>
                                        <td className="p-4">{a.assetType}</td>
                                        <td className="p-4 text-center">
                                            <span className={`px-2 py-0.5 rounded text-[10px] sm:text-xs uppercase ${a.risk === 'High' ? 'bg-red-500/20 text-red-500' : 'bg-emerald-500/20 text-emerald-500'}`}>{a.risk}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="editorial-shell rounded-2xl p-6 h-95 flex flex-col">
                    <h4 className="editorial-label mb-6 text-xs sm:text-sm text-slate-500 italic">
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
                                        <p className="text-sm font-black text-slate-900 group-hover:text-blue-700 transition-colors">{item.asset}</p>
                                        <p className={`text-[11px] sm:text-xs font-bold uppercase tracking-tighter ${item.isPqc ? 'text-emerald-500' : 'text-slate-500'}`}>
                                            {item.isPqc && <span className="mr-1">⚡</span>}
                                            {item.displayAlgo}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className={`text-[11px] sm:text-xs font-black ${item.isPqc ? 'text-emerald-400' : 'text-slate-400'}`}>
                                        {item.isPqc ? 'PQC-SAFE' : `${item.keyLength}-bit`}
                                    </p>
                                    <p className="text-[11px] sm:text-xs text-slate-600 font-bold">{item.tls}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ label, val, statIcon: Icon }) => (
    <div className="editorial-shell rounded-xl p-5 flex items-center gap-4 border-b-2" style={{ borderBottomColor: 'color-mix(in srgb, var(--primary) 34%, var(--outline))' }}>
        <div className="p-3 bg-slate-100 rounded-xl text-blue-700"><Icon size={20} /></div>
        <div>
            <p className="editorial-label text-xs sm:text-sm text-slate-500">{label}</p>
            <h3 className="text-2xl font-black text-slate-900">{val}</h3>
        </div>
    </div>
);

export default HomeTab;