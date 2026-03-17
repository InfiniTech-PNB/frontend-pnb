import React, { useState, useEffect } from 'react';
import {
    History, Globe, Clock, Loader2, Search, Activity,
    ShieldCheck, BarChart3, ClipboardList, ChevronDown, ChevronUp, Lock as LockIcon, AlertTriangle, Cpu, Zap
} from 'lucide-react';
import API from "../../../services/api";
import SecurityChatbot from '../../../components/Dashboard/SecurityChatbot';

const HistoryTab = () => {
    // Selection States
    const [domains, setDomains] = useState([]);
    const [scans, setScans] = useState([]);
    const [selectedDomain, setSelectedDomain] = useState("");
    const [selectedScan, setSelectedScan] = useState("");

    // Data States
    const [domainSummary, setDomainSummary] = useState(null); // Data from /summary
    const [cryptoInventory, setCryptoInventory] = useState([]); // Data from /crypto-inventory
    const [scanResults, setScanResults] = useState([]);
    const [assetPlans, setAssetPlans] = useState([]);
    const [loading, setLoading] = useState(false);
    const [expandedAssetId, setExpandedAssetId] = useState(null);

    // Initial Load: Fetch Domains
    useEffect(() => {
        const fetchDomains = async () => {
            try {
                const res = await API.get("/domains");
                setDomains(res.data || []);
            } catch (err) { console.error("Error:", err); }
        };
        fetchDomains();
    }, []);

    // Fetch Scans for Domain
    useEffect(() => {
        if (!selectedDomain) return;
        const fetchScans = async () => {
            try {
                const res = await API.get(`/scan/domain/${selectedDomain}`);
                setScans(Array.isArray(res.data) ? res.data : (res.data.scans || []));
                setSelectedScan("");
                setScanResults([]);
                setDomainSummary(null);
            } catch (err) { console.error("Error:", err); }
        };
        fetchScans();
    }, [selectedDomain]);

    // Fetch Data using requested Domain Summary and Crypto Inventory routes
    const handleFetchHistory = async (scanId) => {
        if (!scanId) return;
        setSelectedScan(scanId);
        setLoading(true);
        try {
            // 1. Fetch Strategic Summary (Aggregated Stats + LLM Recommendation)
            const summaryRes = await API.get(`/domains/${selectedDomain}/summary`);
            setDomainSummary(summaryRes.data);

            // 2. Fetch Domain-wide Crypto Inventory
            const inventoryRes = await API.get(`/domains/${selectedDomain}/crypto-inventory`);
            setCryptoInventory(inventoryRes.data.algorithms || []);

            // 3. Fetch Tactical Scan Results for Asset Cards
            const resultsRes = await API.get(`/scan/${scanId}/results`);
            setScanResults(resultsRes.data);

            // 4. Fetch Per-Asset Roadmaps
            const roadmapRes = await API.post(`/scan/${scanId}/recommendations`);
            setAssetPlans(roadmapRes.data);
        } catch (err) {
            console.error("Error fetching history details:", err);
        } finally {
            setLoading(false);
        }
    };

    const getClassification = (score) => {
        const s = score * 1000;
        if (s >= 900) return { label: "Quantum Safe", color: "text-emerald-400", bg: "bg-emerald-500/10" };
        if (s >= 700) return { label: "PQC Ready", color: "text-blue-400", bg: "bg-blue-500/10" };
        if (s >= 400) return { label: "Migration Required", color: "text-amber-400", bg: "bg-amber-500/10" };
        return { label: "Quantum Vulnerable", color: "text-red-400", bg: "bg-red-500/10" };
    };

    return (
        <div className="space-y-10 pb-32 animate-in fade-in duration-500">
            <style dangerouslySetInnerHTML={{
                __html: `
        @keyframes wave-animation {
            0%, 100% { transform: rotate(0deg); }
            20% { transform: rotate(15deg); }
            40% { transform: rotate(-10deg); }
            60% { transform: rotate(10deg); }
            80% { transform: rotate(-5deg); }
        }
        .animate-wave {
            animation: wave-animation 1s ease-in-out infinite;
        }
    `
            }} />

            {/* --- SELECTION HUD --- */}
            <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <div className="p-5 bg-orange-50 rounded-[2rem] text-orange-600 shadow-inner">
                            <History size={32} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase italic leading-none">Audit History</h2>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <select value={selectedDomain} onChange={(e) => setSelectedDomain(e.target.value)} className="w-full sm:w-64 pl-6 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-orange-500 appearance-none shadow-inner">
                            <option value="">Select Domain</option>
                            {domains.map(d => <option key={d._id} value={d._id}>{d.domainName}</option>)}
                        </select>
                        <select value={selectedScan} disabled={!selectedDomain} onChange={(e) => handleFetchHistory(e.target.value)} className="w-full sm:w-64 pl-6 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-orange-500 appearance-none shadow-inner disabled:opacity-30">
                            <option value="">Select Audit Entry</option>
                            {scans.map(s => <option key={s._id} value={s._id}>{new Date(s.createdAt).toLocaleString()}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-40">
                    <Loader2 className="animate-spin text-orange-500 mb-4" size={48} />
                    <p className="text-slate-400 font-black uppercase text-[10px] tracking-[0.3em] animate-pulse">Reconstructing Audit Environment...</p>
                </div>
            ) : domainSummary ? (
                <div className="space-y-10">
                    {/* --- SECTION 1: STRATEGIC DOMAIN HUD --- */}
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                            {/* Main Strategic Overview Card */}
                            <div className="xl:col-span-2 bg-[#0f172a] rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl border border-slate-800">
                                <ShieldCheck className="absolute -right-10 -bottom-10 w-64 h-64 text-emerald-500/5" />

                                <div className="relative z-10">
                                    <div className="flex flex-wrap items-center gap-3 mb-8">
                                        <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${domainSummary.recommendation?.riskLevel === 'HIGH'
                                            ? 'bg-red-500/20 text-red-400 border-red-500/30'
                                            : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                                            }`}>
                                            Threat Level: {domainSummary.recommendation?.riskLevel}
                                        </div>
                                        <div className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[9px] font-black text-slate-300 uppercase tracking-widest">
                                            Node Coverage: {domainSummary.assets?.scanned_assets} / {domainSummary.assets?.total_assets}
                                        </div>
                                    </div>

                                    <h3 className="text-6xl font-black italic uppercase leading-none tracking-tighter mb-6">
                                        Grade: <span className="text-emerald-400">{Math.round(domainSummary.pqc_readiness?.average_score * 1000)}</span>
                                    </h3>

                                    <p className="text-slate-300 text-sm font-bold leading-relaxed max-w-3xl mb-10 border-l-2 border-orange-500 pl-6 py-2 bg-orange-500/5 rounded-r-xl">
                                        {domainSummary.recommendation?.summary}
                                    </p>

                                    {/* Technical Recommendation Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-slate-800 pt-10">
                                        <div className="space-y-4">
                                            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                                <Cpu size={14} className="text-orange-500" /> Recommended PQC Stack
                                            </h4>
                                            <div className="flex flex-col gap-2">
                                                <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                                                    <span className="text-[9px] font-bold text-slate-400 uppercase">Key Exchange</span>
                                                    <span className="text-xs font-black text-white font-mono">{domainSummary.recommendation?.recommendedPqcKex}</span>
                                                </div>
                                                <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                                                    <span className="text-[9px] font-bold text-slate-400 uppercase">Digital Signature</span>
                                                    <span className="text-xs font-black text-white font-mono">{domainSummary.recommendation?.recommendedPqcSignature}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                                <ClipboardList size={14} className="text-orange-500" /> Migration Strategy
                                            </h4>
                                            <div className="space-y-3">
                                                {domainSummary.recommendation?.migrationStrategy?.map((step, idx) => (
                                                    <div key={idx} className="flex gap-3 items-start group">
                                                        <div className="mt-1 text-orange-500 font-black text-[10px] bg-orange-500/10 w-5 h-5 flex items-center justify-center rounded-lg border border-orange-500/20 group-hover:bg-orange-500 group-hover:text-white transition-all">
                                                            {idx + 1}
                                                        </div>
                                                        <p className="text-[10px] font-bold text-slate-400 leading-tight uppercase group-hover:text-slate-200 transition-colors">
                                                            {step}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Global Crypto Inventory Badge Wall */}
                            <div className="bg-white border border-slate-100 rounded-[3rem] p-8 shadow-sm flex flex-col">
                                <div className="flex items-center justify-between mb-8">
                                    <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                                        <Activity size={16} className="text-orange-500" /> Cipher footprint
                                    </h4>
                                </div>

                                <div className="flex flex-wrap gap-2 overflow-y-auto max-h-[400px] scrollbar-hide pr-2">
                                    {cryptoInventory.map((alg, idx) => (
                                        <div key={idx} className="group relative">
                                            <div className="absolute inset-0 bg-orange-500 rounded-xl blur opacity-0 group-hover:opacity-20 transition-opacity"></div>
                                            <div className="relative px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-[9px] font-black text-slate-600 uppercase tracking-tighter flex items-center gap-2 hover:border-orange-200 hover:text-slate-900 transition-all">
                                                <div className="w-1 h-1 rounded-full bg-orange-400 group-hover:animate-ping" />
                                                {alg}
                                            </div>
                                        </div>
                                    ))}
                                    {cryptoInventory.length === 0 && (
                                        <div className="flex flex-col items-center justify-center w-full py-20 opacity-20">
                                            <Search size={32} />
                                            <p className="text-[8px] font-black uppercase mt-2">No unique primitives</p>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-auto pt-6 border-t border-slate-50">
                                    <p className="text-[9px] font-bold text-slate-400 leading-relaxed uppercase tracking-tighter italic">
                                        The detection engine identified {cryptoInventory.length} unique cryptographic primitives across the scanned infrastructure.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* --- TACTICAL ASSET BREAKDOWN (Results Tab Design) --- */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 px-4">
                            <Activity className="text-orange-500" size={20} />
                            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight italic">Historical Node Breakdown</h3>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            {scanResults.map((res) => {
                                const config = getClassification(res.pqcReadyScore || 0);
                                const isExpanded = expandedAssetId === res._id;
                                const matchingPlan = assetPlans.find(p => p.scanResultId === res._id);

                                return (
                                    <div key={res._id} className={`bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden transition-all shadow-sm ${isExpanded ? 'border-orange-400' : ''}`}>
                                        <div className="p-8 flex flex-col md:flex-row justify-between items-center gap-6">
                                            <div className="flex items-center gap-4">
                                                <div className={`p-4 rounded-[1.5rem] ${config.bg} ${config.color}`}><Activity size={24} /></div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <h4 className="text-lg font-black text-slate-900 uppercase italic leading-none">{res.assetId?.host}</h4>
                                                        <span className="bg-slate-100 text-slate-500 text-[8px] px-1.5 py-0.5 rounded font-black">{res.assetId?.assetType}</span>
                                                    </div>
                                                    <p className="text-[10px] font-mono text-slate-400 mt-2 font-bold">{res.assetId?.ip} • PORT {res.port}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-12">
                                                <div className="text-center">
                                                    <p className={`text-[20px] font-black uppercase ${config.color}`}>{config.label}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">PQC Score</p>
                                                    <p className="text-3xl font-black text-slate-900">{Math.round(res.pqcReadyScore * 1000)}</p>
                                                </div>
                                                <button
                                                    onClick={() => setExpandedAssetId(isExpanded ? null : res._id)}
                                                    className={`p-3 rounded-full transition-all ${isExpanded ? 'bg-orange-500 text-white shadow-lg' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                                                >
                                                    {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                                                </button>
                                            </div>
                                        </div>

                                        {isExpanded && (
                                            <div className="px-10 pb-10 animate-in slide-in-from-top-4 duration-300">
                                                <div className="grid grid-cols-1 xl:grid-cols-3 gap-10 border-t border-slate-50 pt-10">
                                                    <div className="space-y-4">
                                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><LockIcon size={14} /> Node Crypto</h4>
                                                        <div className="bg-slate-900 rounded-[2.5rem] p-7 text-slate-300 text-[11px] font-bold space-y-4 shadow-2xl">
                                                            <div className="flex justify-between items-center"><span className="text-slate-500 uppercase text-[9px]">TLS Version</span> <span className="bg-orange-500/10 text-orange-400 px-2 py-1 rounded-md">{res.tlsVersion}</span></div>
                                                            <div className="flex justify-between items-center"><span className="text-slate-500 uppercase text-[9px]">Cipher Suite</span> <span className="text-white truncate max-w-[150px]">{res.cipher}</span></div>
                                                            <div className="flex justify-between items-center"><span className="text-slate-500 uppercase text-[9px]">KEX / Size</span> <span className="text-white">{res.keyExchange} ({res.keySize}b)</span></div>
                                                            <div className="flex justify-between items-center"><span className="text-slate-500 uppercase text-[9px]">PFS Enabled</span> <span className={res.pfsSupported ? 'text-emerald-400' : 'text-red-400'}>{res.pfsSupported ? 'YES' : 'NO'}</span></div>
                                                            <div className="pt-2 border-t border-slate-800">
                                                                <span className="text-slate-500 uppercase text-[9px] block mb-2">Signature Algorithm</span>
                                                                <span className="text-slate-400 italic font-medium">{res.signatureAlgorithm}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-4">
                                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><BarChart3 size={14} /> ML Weight Distribution</h4>
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-[2.5rem] text-center shadow-sm">
                                                                <p className="text-[9px] font-black text-emerald-600 uppercase mb-2">ML Score</p>
                                                                <p className="text-2xl font-black text-emerald-700">{Math.round(res.mlScore * 1000)}</p>
                                                            </div>
                                                            <div className="bg-blue-50 border border-blue-100 p-6 rounded-[2.5rem] text-center shadow-sm">
                                                                <p className="text-[9px] font-black text-blue-600 uppercase mb-2">Env Score</p>
                                                                <p className="text-2xl font-black text-blue-700">{Math.round(res.envScore * 1000)}</p>
                                                            </div>
                                                        </div>
                                                        <div className="p-5 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-3">
                                                            <div className="flex justify-between text-[10px] font-black"><span className="text-slate-400">Criticality</span> <span className="text-slate-900">LV: {res.businessContext?.assetCriticality}</span></div>
                                                            <div className="flex justify-between text-[10px] font-black"><span className="text-slate-400">Dependent Services</span> <span className="text-slate-900">{res.businessContext?.dependentServices} Nodes</span></div>
                                                            <div className="flex justify-between text-[10px] font-black"><span className="text-slate-400">Confidentiality Weight</span> <span className="text-slate-900">{res.businessContext?.confidentialityWeight}</span></div>
                                                            <div className="flex justify-between text-[10px] font-black"><span className="text-slate-400">Integrity Weight</span> <span className="text-slate-900">{res.businessContext?.integrityWeight}</span></div>
                                                            <div className="flex justify-between text-[10px] font-black"><span className="text-slate-400">Availability Weight</span> <span className="text-slate-900">{res.businessContext?.availabilityWeight}</span></div>
                                                            <div className="flex justify-between text-[10px] font-black"><span className="text-slate-400">SLA Requirement</span> <span className="text-slate-900">{res.businessContext?.slaRequirement}</span></div>
                                                            <div className="flex justify-between text-[10px] font-black"><span className="text-slate-400">Remediation Difficulty</span> <span className="text-slate-900">{res.businessContext?.remediationDifficulty}</span></div>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-4">
                                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><ClipboardList size={14} /> AI Migration Advisor</h4>
                                                        <div className="bg-orange-50/50 border border-orange-100 rounded-[2.5rem] p-7 h-full flex flex-col justify-evenly shadow-sm">
                                                            <div>
                                                                <h4 className="text-[15px] font-black text-slate-400 tracking-widest flex items-center">AI Recommendation</h4>
                                                                <p className="text-[11px] font-bold text-slate-700 leading-relaxed italic">"{matchingPlan?.recommendations || 'Aggregating per-asset neural analysis...'}"</p>
                                                            </div>
                                                            <div className="mt-2 space-y-3">
                                                                <h4 className="text-[15px] font-black text-slate-400 tracking-widest flex items-center">AI Migration Steps</h4>
                                                                {matchingPlan?.migrationSteps?.slice(0, 3).map((step, idx) => (
                                                                    <div key={idx} className="flex gap-3 items-start text-[10px] font-bold text-slate-600 leading-tight">
                                                                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0" /> {step}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-40 opacity-30 text-center">
                    <Search size={64} className="text-slate-300 mb-6" />
                    <p className="text-[10px] font-black uppercase tracking-[0.4em]">Query parameters required for neural reconstruction</p>
                </div>
            )}

            {/* --- Final Static Wrapper (No Shifting) --- */}
            <div className="fixed bottom-8 right-8 z-[9999] flex flex-col items-end">

                {/* 1. Speech Bubble - Pre-rendered & Static */}
                <div className="mb-2 mr-2 pointer-events-none">
                    <div className="bg-white border border-slate-100 shadow-2xl rounded-2xl px-4 py-3 relative max-w-[180px] border-b-2 border-r-2">
                        <p className="text-[10px] font-black text-slate-700 uppercase tracking-tighter leading-tight">
                            Need help with your <span className="text-orange-500">PQC Strategy?</span>
                        </p>
                        {/* Bubble Tail */}
                        <div className="absolute -bottom-1 right-6 w-3 h-3 bg-white border-r border-b border-slate-100 rotate-45"></div>
                    </div>
                </div>

                {/* 2. Anchor Point - Fixed Dimensions */}
                <div className="relative w-14 h-14 flex items-center justify-center">

                    {/* Glow - Now using a simple opacity instead of pulse to prevent jitter */}
                    <div className="absolute inset-0 bg-orange-500 rounded-full blur-xl opacity-20"></div>

                    {/* --- THE WAVING HAND - Absolute positioned outside the flex flow --- */}
                    <div
                        className="absolute -top-6 left-12 bg-white shadow-lg rounded-full w-8 h-8 flex items-center justify-center z-[10001] border-2 border-orange-100 animate-wave pointer-events-none"
                        style={{ transformOrigin: 'bottom center' }}
                    >
                        <span role="img" aria-label="wave" className="text-base">👋</span>
                    </div>

                    {/* --- THE CHATBOT COMPONENT --- */}
                    <div className="relative z-[10002]">
                        <SecurityChatbot scanId={selectedScan} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HistoryTab;