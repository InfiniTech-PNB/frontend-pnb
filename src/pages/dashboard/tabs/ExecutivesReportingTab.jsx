import React, { useState, useEffect } from 'react';
import {
    Download, ArrowLeft, Globe, ShieldCheck,
    Award, Layers, Lock, Search, Cpu, Zap, Activity
} from 'lucide-react';
import { Link } from 'react-router-dom';
import API from "../../../services/api";
import { useSearchParams } from 'react-router-dom';

const ExecutivesReportingTab = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isDownloading, setIsDownloading] = useState(false);

    const [searchParams] = useSearchParams();
    const isPrintMode = searchParams.get('print') === 'true';

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const res = await API.get("/reports/executive-summary");
                setData(res.data);
            } catch (err) { console.error("HUD Fetch Error:", err); }
            finally { setLoading(false); }
        };
        fetchSummary();
    }, []);

    const handleDownload = async () => {
        setIsDownloading(true);
        try {
            // Ensure the token is passed so the backend can pass it to Puppeteer
            const response = await API.get("/reports/executive-download", {
                responseType: 'blob',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}` // Adjust based on your Auth system
                }
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Executive_Report.pdf');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error("Download failed:", err);
            // Look at your terminal/console for the 500 error details
        } finally {
            setIsDownloading(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center p-40 space-y-4">
            <Activity className="animate-spin text-orange-500" size={48} />
            <p className="font-black uppercase text-xs tracking-[0.3em] text-slate-400">Aggregating Global Audit Data...</p>
        </div>
    );

    return (
        <div className={`space-y-8 animate-in fade-in duration-500 ${isPrintMode ? 'p-10 bg-white space-y-12' : 'pb-20'}`}>
            {/* CHANGE 2: Hide Header when Printing */}
            {!isPrintMode && (
                <div className="flex justify-between items-center px-4">
                    <Link to="/dashboard/reporting" className="flex items-center gap-2 text-slate-400 hover:text-orange-500 transition-colors text-xs font-black uppercase tracking-widest">
                        <ArrowLeft size={16} /> Back to Registry
                    </Link>
                    <button
                        onClick={handleDownload}
                        disabled={isDownloading}
                        className="bg-slate-900 hover:bg-orange-500 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg disabled:opacity-50"
                    >
                        {isDownloading ? <Activity className="animate-spin" size={14} /> : <Download size={14} />}
                        {isDownloading ? 'Generating...' : 'Export Strategic Report'}
                    </button>
                </div>
            )}

            {/* CHANGE 3: Add a Report Header that ONLY shows in the PDF */}
            {isPrintMode && (
                <div className="border-b-4 border-slate-900 pb-6 mb-10">
                    <h1 className="text-4xl font-black uppercase italic">Strategic PQC Audit Report</h1>
                    <p className="text-slate-500 font-bold uppercase tracking-widest mt-2">Internal Executive Summary — Confidential</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* 1. Assets Discovery */}
                <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 relative overflow-hidden">
                    <div className="flex items-center gap-3 mb-6 text-orange-500">
                        <Search size={20} />
                        <h3 className="font-black uppercase text-xs tracking-widest italic">Assets Discovery</h3>
                    </div>
                    <div className="space-y-4 relative z-10">
                        <div>
                            <span className="text-4xl font-black text-slate-900 tracking-tighter">
                                {data.discovery.totalAssets + data.discovery.totalDomains}
                            </span>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Total Domains & Endpoints</p>
                        </div>
                        <div>
                            <span className="text-2xl font-black text-slate-900">{data.discovery.cloudAssets}</span>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Cloud-Native Assets</p>
                        </div>
                    </div>
                    <Globe size={100} className="absolute -right-6 -bottom-6 text-orange-500/5 rotate-12" />
                </div>

                {/* 2. Cyber Rating */}
                <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
                    <div className="flex items-center gap-3 mb-6 text-emerald-500">
                        <Award size={20} />
                        <h3 className="font-black uppercase text-xs tracking-widest italic">Cyber Rating</h3>
                    </div>
                    <div className="space-y-2">
                        {['Excellent', 'Good', 'Satisfactory', 'Needs Improvement'].map((tier, i) => {
                            const isActive = data.cyberRating.includes(tier);
                            return (
                                <div key={tier} className={`flex items-center gap-4 p-3 rounded-2xl transition-all border ${isActive ? 'bg-emerald-50 border-emerald-100' : 'opacity-20 border-transparent'}`}>
                                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center font-black text-[10px] ${isActive ? 'bg-emerald-500 text-white' : 'bg-slate-200'}`}>
                                        {String.fromCharCode(65 + i)}
                                    </div>
                                    <span className="text-[10px] font-black uppercase text-slate-700">Tier {i + 1} {tier}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* 3. Assets Inventory */}
                {/* Inside ExecutivesReportingTab.jsx -> Assets Inventory Card */}
                <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
                    <div className="flex items-center gap-3 mb-6 text-blue-500">
                        <Layers size={20} />
                        <h3 className="font-black uppercase text-xs tracking-widest italic">Assets Inventory</h3>
                    </div>
                    <div className="space-y-3">
                        <InventoryItem label="SSL Certificates" value={data.inventory.ssl} icon={<Lock size={12} />} />
                        <InventoryItem label="Software Nodes" value={data.inventory.software} icon={<Cpu size={12} />} />

                        {/* REPLACED IOT WITH APIs */}
                        <InventoryItem
                            label="Active APIs"
                            value={data.inventory.apis}
                            icon={<Zap size={12} />}
                        />

                        <InventoryItem label="Web Interfaces" value={data.inventory.logins} icon={<Globe size={12} />} />
                    </div>
                </div>

                {/* 4. Posture of PQC */}
                <div className="lg:col-span-2 bg-[#0f172a] rounded-[2.5rem] p-10 text-white shadow-xl relative overflow-hidden">
                    <div className="flex items-center gap-3 mb-8 text-orange-500">
                        <ShieldCheck size={24} />
                        <h3 className="font-black uppercase text-sm tracking-[0.2em] italic underline underline-offset-8">Posture of PQC</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    <span>Quantum Resilience Index</span>
                                    <span className="text-orange-500">{data.pqcPosture}%</span>
                                </div>
                                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                    <div className="bg-orange-500 h-full transition-all duration-1000" style={{ width: `${data.pqcPosture}%` }} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    <span>Hybrid Cryptography Adoption</span>
                                    <span className="text-blue-400">{data.pqcHybridPosture}%</span>
                                </div>
                                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                    <div className="bg-blue-500 h-full transition-all duration-1000" style={{ width: `${data.pqcHybridPosture}%` }} />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-center border-l border-slate-800 pl-8">
                            <div className="text-center">
                                <p className="text-5xl font-black text-white tracking-tighter">{data.pqcPosture}</p>
                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-2">Overall PQC Health</p>
                            </div>
                        </div>
                    </div>
                    <ShieldCheck size={250} className="absolute -right-20 -bottom-20 text-white/5 pointer-events-none" />
                </div>

                {/* 5. CBOM Summary (Dynamic) */}
                <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 flex flex-col justify-center text-center group hover:border-orange-500 transition-colors">
                    <div className="space-y-4">
                        <div className="mx-auto p-4 bg-orange-50 rounded-2xl text-orange-600 w-fit group-hover:bg-orange-500 group-hover:text-white transition-all">
                            <Layers size={32} />
                        </div>
                        <h3 className="font-black uppercase text-[10px] tracking-[0.2em] text-slate-500">CBOM Registry</h3>
                        <div>
                            <p className="text-4xl font-black text-slate-900 tracking-tighter italic">
                                {data.totalVulnerabilities.toLocaleString()}
                            </p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mt-1">Vulnerable Components Detected</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

const InventoryItem = ({ label, value, icon }) => (
    <div className="flex justify-between items-center bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100">
        <div className="flex items-center gap-3 text-slate-500">
            {icon}
            <span className="text-[9px] font-black uppercase tracking-tight">{label}</span>
        </div>
        <span className="text-xs font-black text-slate-900 font-mono">{value.toLocaleString()}</span>
    </div>
);

export default ExecutivesReportingTab;