import React, { useState, useEffect } from 'react';
import {
    Zap, ShieldCheck, Globe, Loader2, AlertCircle,
    BarChart3, Grid3X3, Activity, ChevronDown, ClipboardList
} from 'lucide-react';
import API from "../../services/api";

import SecurityChatbot from './SecurityChatbot';

const PQCPostureTab = () => {
    const [domains, setDomains] = useState([]);
    const [selectedDomainId, setSelectedDomainId] = useState("");
    const [summaryData, setSummaryData] = useState(null);
    const [loading, setLoading] = useState(false);

    // --- NEW STATES FOR ASSET-LEVEL AI ---
    const [assetPlans, setAssetPlans] = useState([]);
    const [generating, setGenerating] = useState(false);

    useEffect(() => {
        const fetchDomains = async () => {
            try {
                const res = await API.get("/domains");
                setDomains(res.data);
                if (res.data.length > 0) setSelectedDomainId(res.data[0]._id);
            } catch (err) { console.error(err); }
        };
        fetchDomains();
    }, []);

    useEffect(() => {
        if (!selectedDomainId) return;
        const fetchSummary = async () => {
            setLoading(true);
            try {
                const res = await API.get(`/domains/${selectedDomainId}/summary`);
                setSummaryData(res.data);

                // Fetch existing individual asset recommendations if they exist
                if (res.data.recommendation?.scanId) {
                    const recRes = await API.get(`/scan/${res.data.recommendation.scanId}/recommendations`);
                    setAssetPlans(recRes.data);
                }
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        fetchSummary();
    }, [selectedDomainId]);

    // --- LOGIC: TRIGGER PER-ASSET AI ADVISOR ---
    const runPerAssetAI = async () => {
        if (!summaryData?.recommendation?.scanId) return;
        setGenerating(true);
        try {
            // POST /api/scan/:scanId/recommendations
            const res = await API.post(`/scan/${summaryData.recommendation.scanId}/recommendations`);
            setAssetPlans(res.data);
        } catch (err) {
            console.error("AI Generation failed", err);
        } finally {
            setGenerating(false);
        }
    };

    if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-amber-500" /></div>;

    return (
        <div className='relative'>
            <div className="space-y-6 animate-in fade-in duration-700 pb-20">

                {/* --- 1. SELECTION & OVERALL SCORE --- */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <div className="lg:col-span-3 bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-4 bg-amber-50 rounded-3xl text-amber-600"><Globe size={32} /></div>
                            <div>
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Infrastructure</h4>
                                <div className="relative mt-1">
                                    <select
                                        value={selectedDomainId}
                                        onChange={(e) => setSelectedDomainId(e.target.value)}
                                        className="appearance-none bg-slate-50 border-2 border-slate-100 rounded-2xl py-2 pl-4 pr-10 text-sm font-black text-slate-800 outline-none cursor-pointer min-w-[200px]"
                                    >
                                        {domains.map(d => <option key={d._id} value={d._id}>{d.domainName}</option>)}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                                </div>
                            </div>
                        </div>
                        <div className="hidden md:flex gap-8 text-right">
                            <div>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Assets</p>
                                <p className="text-xl font-black text-slate-900">{summaryData?.assets?.total_assets || 0}</p>
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Average Score</p>
                                <p className="text-xl font-black text-amber-500">{Math.round((summaryData?.pqc_readiness?.average_score || 0) * 100)}%</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#0f172a] rounded-[2.5rem] p-8 text-white flex flex-col items-center justify-center shadow-xl">
                        <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Domain Grade</h4>
                        <div className="text-5xl font-black text-emerald-400">
                            {summaryData?.pqc_readiness?.average_score > 0.8 ? 'A+' : summaryData?.pqc_readiness?.average_score > 0.4 ? 'B' : 'F'}
                        </div>
                    </div>
                </div>

                {/* --- 2. ANALYTICS ROW: HEATMAP & CLASSIFICATION --- */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Risk Overview Matrix (The Heatmap) */}
                    <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <Grid3X3 size={14} className="text-red-500" /> Risk Exposure Heatmap
                            </h4>
                            <span className="text-[9px] font-bold text-slate-300 italic">Impact vs Probability</span>
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                            {[...Array(16)].map((_, i) => {
                                let bgColor = "bg-slate-50";
                                if (i < 4) bgColor = summaryData?.pqc_readiness?.legacy_crypto_assets > 0 ? "bg-red-500/80 shadow-[0_0_15px_rgba(239,68,68,0.2)]" : "bg-red-100";
                                else if (i < 8) bgColor = summaryData?.risks?.weak_cipher_assets > 0 ? "bg-amber-400/80" : "bg-amber-100";
                                else bgColor = "bg-emerald-400/80";

                                return <div key={i} className={`h-12 rounded-xl transition-all hover:scale-105 cursor-help ${bgColor}`}></div>;
                            })}
                        </div>
                        <div className="mt-6 flex justify-between px-2">
                            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500"></div><span className="text-[8px] font-black text-slate-400 uppercase">Critical</span></div>
                            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-amber-400"></div><span className="text-[8px] font-black text-slate-400 uppercase">Warning</span></div>
                            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-400"></div><span className="text-[8px] font-black text-slate-400 uppercase">Safe</span></div>
                        </div>
                    </div>

                    {/* Classification Grades (Bar Chart) */}
                    <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-10 flex items-center gap-2">
                            <BarChart3 size={14} className="text-amber-500" /> Infrastructure Classification
                        </h4>
                        <div className="flex items-end justify-around h-32 gap-6">
                            {[
                                { label: 'Quantum Ready', val: summaryData?.pqc_readiness?.pqc_ready_assets || 0, clr: 'bg-emerald-500' },
                                { label: 'Migration Path', val: summaryData?.pqc_readiness?.migration_ready_assets || 0, clr: 'bg-amber-500' },
                                { label: 'Legacy/Risk', val: summaryData?.pqc_readiness?.legacy_crypto_assets || 0, clr: 'bg-red-500' },
                            ].map(item => (
                                <div key={item.label} className="flex-1 flex flex-col items-center gap-3">
                                    <span className="text-xs font-black text-slate-800">{item.val}</span>
                                    <div className={`w-full rounded-t-2xl ${item.clr} transition-all duration-1000`} style={{ height: `${(item.val / summaryData?.assets?.total_assets) * 100 || 5}%` }}></div>
                                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter text-center">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* --- 3. RECOMMENDATIONS (Step 7) --- */}
                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden p-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-slate-900 text-white rounded-2xl"><Activity size={20} /></div>
                                <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight">AI Strategy Roadmap</h4>
                            </div>
                            {/* GENERATE BUTTON INTEGRATED INTO THE HEADER */}
                            <button
                                onClick={runPerAssetAI}
                                disabled={generating}
                                className="bg-amber-500 hover:bg-amber-400 text-amber-950 px-4 py-2 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg active:scale-95 disabled:opacity-50"
                            >
                                {generating ? <Loader2 className="animate-spin w-3 h-3" /> : <Zap size={12} />}
                                {generating ? "Generating..." : "Generate Asset Roadmap"}
                            </button>
                        </div>
                        <p className="text-sm font-bold text-slate-600 leading-relaxed bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                            {summaryData?.recommendation?.summary || "No automated summary available for this scan result."}
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <ShieldCheck size={14} className="text-emerald-500" /> Targeted Mitigation Steps
                        </h4>
                        <div className="space-y-3">
                            {(() => {
                                const strategy = summaryData?.recommendation?.migrationStrategy;
                                if (Array.isArray(strategy)) {
                                    return strategy.map((step, i) => (
                                        <div key={i} className="flex items-start gap-4 p-4 hover:bg-slate-50 rounded-2xl transition-colors group">
                                            <div className="mt-1 w-2 h-2 rounded-full bg-amber-400 group-hover:scale-125 transition-transform" />
                                            <p className="text-[11px] font-bold text-slate-600">{step}</p>
                                        </div>
                                    ));
                                }
                                else if (typeof strategy === 'string') {
                                    return strategy.split('.').filter(s => s.trim().length > 0).map((step, i) => (
                                        <div key={i} className="flex items-start gap-4 p-4 hover:bg-slate-50 rounded-2xl transition-colors group">
                                            <div className="mt-1 w-2 h-2 rounded-full bg-amber-400 group-hover:scale-125 transition-transform" />
                                            <p className="text-[11px] font-bold text-slate-600">{step.trim()}.</p>
                                        </div>
                                    ));
                                }
                                return <p className="text-xs text-slate-400 italic p-4">Roadmap steps pending...</p>;
                            })()}
                        </div>
                    </div>
                </div>

                {/* --- NEW SECTION: GRANULAR PER-ASSET ROADMAPS --- */}
                <div className="space-y-6 pt-4">
                    <div className="flex items-center gap-3 ml-4">
                        <ClipboardList className="text-blue-500" size={22} />
                        <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Individual Node Recommendations</h3>
                    </div>

                    {assetPlans.length === 0 ? (
                        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[3rem] py-16 text-center">
                            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Click "Generate Asset Roadmap" above to trigger AI Advisor</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {assetPlans.map((plan, i) => (
                                <div key={i} className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm hover:border-blue-400 transition-all group flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start border-b border-slate-50 pb-4 mb-6">
                                            <div className="max-w-[160px]">
                                                <p className="text-xs font-black text-slate-900 uppercase truncate">{plan.host}</p>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Node Asset</p>
                                            </div>
                                            <span className={`px-2 py-1 rounded-lg text-[8px] font-black ${plan.riskLevel === 'HIGH' ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-500'}`}>
                                                {plan.riskLevel}
                                            </span>
                                        </div>
                                        <p className="text-[11px] font-bold text-slate-500 leading-relaxed italic mb-6">
                                            "{plan.recommendations}"
                                        </p>
                                    </div>

                                    <div className="bg-slate-50 p-5 rounded-3xl group-hover:bg-blue-50/50 transition-colors">
                                        <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest mb-3">Migration Roadmap</p>
                                        <div className="space-y-2">
                                            {plan.migrationSteps?.slice(0, 3).map((step, idx) => (
                                                <div key={idx} className="flex gap-2 items-start">
                                                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                                                    <p className="text-[10px] font-bold text-slate-700 leading-tight">{step}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            {/* Floating Chatbot - linked to the current scan */}
            {summaryData?.recommendation?.scanId && (
                <SecurityChatbot scanId={summaryData.recommendation.scanId} />
            )}
        </div>
    );
};

export default PQCPostureTab;