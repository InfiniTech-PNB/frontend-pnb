import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { Globe, Server, ShieldCheck, ShieldAlert, Loader2, Activity } from 'lucide-react';
import API from "../../../services/api";

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

    if (loading) return <div className="py-40 flex justify-center"><Loader2 className="animate-spin text-orange-500" size={48} /></div>;

    // Data for "PQC Status of Scanned Assets"
    const scannedAssetPosture = [
        { name: 'PQC Safe', value: stats.pqcReadyAssets, color: '#10b981' },
        { name: 'Vulnerable', value: stats.scannedAssetsCount - stats.pqcReadyAssets, color: '#ef4444' },
    ];

    // Data for "Inventory Coverage"
    const coverageData = [
        { name: 'Scanned', value: stats.scannedAssetsCount, color: '#f59e0b' },
        { name: 'Unscanned', value: stats.totalAssets - stats.scannedAssetsCount, color: '#e2e8f0' },
    ];

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* HUD Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard label="Total Inventory" val={stats.totalAssets} icon={Server} color="blue" />
                <StatCard label="Scanned Assets" val={stats.scannedAssetsCount} icon={Activity} color="orange" />
                <StatCard label="PQC Ready" val={stats.pqcReadyAssets} icon={ShieldCheck} color="emerald" />
                <StatCard label="Coverage" val={`${Math.round(stats.scanCoverage * 100)}%`} icon={Globe} color="purple" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Chart 1: PQC Readiness of Scanned Assets */}
                <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
                    <h4 className="font-black text-slate-900 uppercase text-xs mb-6 italic">Scanned Assets PQC Posture</h4>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={scannedAssetPosture} innerRadius={80} outerRadius={100} paddingAngle={5} dataKey="value">
                                    {scannedAssetPosture.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Chart 2: Inventory Coverage Bar Chart */}
                <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
                    <h4 className="font-black text-slate-900 uppercase text-xs mb-6 italic">Scan Coverage Analysis</h4>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={coverageData} layout="vertical">
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={80} tick={{fontSize: 10, fontWeight: 'bold'}} />
                                <Tooltip cursor={{fill: 'transparent'}}/>
                                <Bar dataKey="value" radius={[0, 10, 10, 0]} barSize={40}>
                                    {coverageData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Coverage Advisory */}
            <div className="bg-[#0f172a] mb-10 p-10 rounded-[3rem] text-white relative overflow-hidden shadow-2xl">
                <div className="relative z-10">
                    <h2 className="text-3xl font-black italic uppercase mb-4">Security Gap Analysis</h2>
                    <p className="text-slate-400 max-w-2xl leading-relaxed">
                        Out of your <span className="text-white font-bold">{stats.totalAssets}</span> total assets, 
                        only <span className="text-orange-400 font-bold">{stats.scannedAssetsCount}</span> have been audited. 
                        Of those audited, <span className="text-emerald-400 font-bold">{Math.round(stats.pqcAdoptionRate * 100)}%</span> are PQC-ready. 
                        There is a blind spot of <span className="text-red-400 font-bold">{stats.totalAssets - stats.scannedAssetsCount}</span> assets remaining.
                    </p>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ label, val, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4">
        <div className={`p-4 bg-${color}-50 text-${color}-500 rounded-2xl`}><Icon size={24} /></div>
        <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
            <h3 className="text-xl font-black text-slate-900">{val}</h3>
        </div>
    </div>
);

export default HomeTab;