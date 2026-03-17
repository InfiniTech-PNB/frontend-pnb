import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
    Zap, ShieldCheck, Loader2, FileCode, CheckCircle2, AlertTriangle,
    XCircle, Activity, ClipboardList, Key, Shield,
    ChevronDown, ChevronUp, Cpu, Globe, Server, BarChart3, Info, Hash, Link, Lock as LockIcon, MessageSquareText, Search
} from 'lucide-react';
import API from "../../../services/api";
import SecurityChatbot from '../../../components/Dashboard/SecurityChatbot';

const ScanResultsTab = () => {
    const location = useLocation();
    const [scanId, setScanId] = useState(location.state?.activeScanId || null);

    // Data States
    const [scanResults, setScanResults] = useState([]);
    const [cbomData, setCbomData] = useState(null);
    const [assetPlans, setAssetPlans] = useState([]);

    // UI States
    const [loading, setLoading] = useState(false);
    const [statusMsg, setStatusMsg] = useState("");
    const [activeTechTab, setActiveTechTab] = useState("algorithms");
    const [expandedAssetId, setExpandedAssetId] = useState(null);
    const [expandedProtocolIndex, setExpandedProtocolIndex] = useState(null); // New state for cipher suites

    useEffect(() => {
        if (!scanId) return;
        runFullOrchestration();
    }, [scanId]);

    const runFullOrchestration = async () => {
        setLoading(true);
        try {
            setStatusMsg("Synchronizing Cryptographic Bill of Materials...");
            let currentCbom;
            try {
                const cbomRes = await API.get(`/cbom/${scanId}/cbom`);
                currentCbom = cbomRes.data;
            } catch (err) {
                if (err.response?.status === 404) {
                    const genRes = await API.post(`/cbom/${scanId}`);
                    currentCbom = genRes.data.cbom;
                }
            }
            setCbomData(currentCbom);

            setStatusMsg("AI Engine generating mitigation roadmap...");
            const recGenRes = await API.post(`/scan/${scanId}/recommendations`);
            setAssetPlans(recGenRes.data);

            setStatusMsg("Finalizing ML risk classifications...");
            const res = await API.get(`/scan/${scanId}/results`);
            setScanResults(res.data);

        } catch (err) {
            console.error("Orchestration Error:", err);
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

    const avgScanScore = scanResults.length > 0
        ? Math.round((scanResults.reduce((acc, curr) => acc + (curr.pqcReadyScore || 0), 0) / scanResults.length) * 1000)
        : 0;

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-40">
            <Loader2 className="animate-spin text-orange-500 mb-4" size={48} />
            <p className="text-slate-400 font-black uppercase text-[10px] tracking-[0.3em] animate-pulse">{statusMsg}</p>
        </div>
    );

    if (!scanId) return (
        <div className="flex flex-col items-center justify-center py-40 animate-in fade-in duration-700">
            <div className="p-8 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200 flex flex-col items-center text-center max-w-md">
                <div className="p-5 bg-white shadow-xl rounded-2xl mb-6 text-slate-300">
                    <Search size={48} />
                </div>
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight italic mb-2">
                    No Active Audit Found
                </h2>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                    Please initiate a new network scan from the <span className="text-orange-500">Scan Tab</span>.
                </p>
            </div>
        </div>
    );

    return (
        <div className="space-y-10 pb-20 animate-in fade-in duration-500">

            {/* --- TOP HUD --- */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3 bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div className="p-5 bg-orange-50 rounded-[2rem] text-orange-600 shadow-inner"><Globe size={32} /></div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase leading-none">
                                {location.state?.domainName || "Network Audit"}
                            </h2>
                            <p className="text-[10px] font-mono text-slate-400 mt-2 uppercase font-bold tracking-tighter">REF_ID: {scanId}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-[#0f172a] rounded-[2.5rem] p-8 text-white flex flex-col items-center justify-center shadow-2xl relative overflow-hidden">
                    <ShieldCheck className="absolute -right-4 -bottom-4 w-24 h-24 text-emerald-500/10" />
                    <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4">Domain Score</h4>
                    <div className="text-6xl font-black text-emerald-400 drop-shadow-lg">
                        {avgScanScore}
                    </div>
                </div>
            </div>

            {/* --- PER-ASSET ANALYSIS --- */}
            <div className="space-y-4">
                <div className="flex items-center gap-3 px-4">
                    <Server className="text-orange-500" size={20} />
                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight italic">Asset Intelligence</h3>
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

            {/* --- SECTION 4: GLOBAL TECHNICAL CBOM --- */}
            <div className="bg-white rounded-[4rem] border border-slate-100 shadow-xl overflow-hidden">
                <div className="bg-slate-900 p-5 flex gap-3 overflow-x-auto scrollbar-hide">
                    {[
                        { id: 'algorithms', label: 'Algorithms', icon: Cpu },
                        { id: 'keys', label: 'Keys', icon: Key },
                        { id: 'protocols', label: 'Protocols', icon: Globe },
                        { id: 'certificates', label: 'Certificates', icon: Shield }
                    ].map(tab => (
                        <button key={tab.id} onClick={() => setActiveTechTab(tab.id)} className={`flex items-center gap-3 px-8 py-4 rounded-[1.8rem] text-[10px] font-black uppercase tracking-widest transition-all ${activeTechTab === tab.id ? 'bg-orange-500 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-800'}`}>
                            <tab.icon size={16} /> {tab.label}
                        </button>
                    ))}
                </div>
                <div className="p-8 overflow-x-auto">
                    <table className="w-full text-left border-separate border-spacing-y-2">
                        <thead className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            {activeTechTab === 'algorithms' && (
                                <tr>
                                    <th className="px-6 py-4">Name</th>
                                    <th className="px-6 py-4">Asset Type</th>
                                    <th className="px-6 py-4">Primitive</th>
                                    <th className="px-6 py-4">Mode</th>
                                    <th className="px-6 py-4">Security Level</th>
                                    <th className="px-6 py-4">OID</th>
                                </tr>
                            )}
                            {activeTechTab === 'keys' && (
                                <tr>
                                    <th className="px-6 py-4">Name</th>
                                    <th className="px-6 py-4">Asset Type</th>
                                    <th className="px-6 py-4">Size</th>
                                    <th className="px-6 py-4">State</th>
                                    <th className="px-6 py-4">Creation Date</th>
                                    <th className="px-6 py-4">Activation Date</th>
                                    <th className="px-6 py-4">ID Reference</th>
                                </tr>
                            )}
                            {activeTechTab === 'protocols' && (
                                <tr>
                                    <th className="px-6 py-4">Protocol</th>
                                    <th className="px-6 py-4">Version Support</th>
                                    <th className="px-6 py-4">Cipher Suites</th>
                                    <th className="px-6 py-4">OID</th>
                                </tr>
                            )}
                            {activeTechTab === 'certificates' && (
                                <tr>
                                    <th className="px-6 py-4">Name</th>
                                    <th className="px-6 py-4">Subject</th>
                                    <th className="px-6 py-4">Issuer Authority</th>
                                    <th className="px-6 py-4">Validity</th>
                                    <th className="px-6 py-4">Signature Ref</th>
                                    <th className="px-6 py-4">Format</th>
                                    <th className="px-6 py-4">Extensions</th>
                                    <th className="px-6 py-4">PubKey Size</th>
                                </tr>
                            )}
                        </thead>
                        <tbody className="text-xs font-bold">
                            {cbomData?.[activeTechTab]?.map((item, idx) => (
                                <React.Fragment key={idx}>
                                    <tr className="bg-slate-50/50 hover:bg-slate-50 transition-colors">
                                        {activeTechTab === 'algorithms' && (
                                            <><td className="px-6 py-5 text-orange-600 rounded-l-[1.5rem] font-black uppercase">{item.name}</td><td className="px-6 py-5">{item.asset_type}</td><td className="px-6 py-5">{item.primitive}</td><td className="px-6 py-5">{item.mode}</td><td className="px-6 py-5">{item.classical_security_level} Bits</td><td className="px-6 py-5 text-[10px] text-slate-400 font-mono rounded-r-[1.5rem]">{item.oid}</td></>
                                        )}
                                        {activeTechTab === 'keys' && (
                                            <><td className="px-6 py-5 rounded-l-[1.5rem] font-black uppercase">{item.name}</td><td className="px-6 py-5">{item.asset_type}</td><td className="px-6 py-5 text-blue-500">{item.size} Bits</td><td className="px-6 py-5"><span className="px-2 py-1 bg-white border rounded-md text-[9px]">{item.state}</span></td><td className="px-6 py-5 text-slate-400 font-medium">{item.creation_date}</td><td className="px-6 py-5 text-slate-400 font-medium">{item.activation_date}</td><td className="px-6 py-5 text-[9px] text-slate-400 font-mono rounded-r-[1.5rem]">{item.id}</td></>
                                        )}
                                        {activeTechTab === 'protocols' && (
                                            <>
                                                <td className="px-6 py-5 rounded-l-[1.5rem] font-black text-slate-900 uppercase">{item.name}</td>
                                                <td className="px-6 py-5">{item.version?.join(' | ')}</td>
                                                <td className="px-6 py-5">
                                                    <button
                                                        onClick={() => setExpandedProtocolIndex(expandedProtocolIndex === idx ? null : idx)}
                                                        className="flex items-center gap-2 text-orange-500 hover:text-orange-600 transition-colors"
                                                    >
                                                        {item.cipher_suites?.length || 0} Suites
                                                        {expandedProtocolIndex === idx ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                                    </button>
                                                </td>
                                                <td className="px-6 py-5 text-[10px] text-slate-400 font-mono rounded-r-[1.5rem]">{item.oid || "N/A"}</td>
                                            </>
                                        )}
                                        {activeTechTab === 'certificates' && (
                                            <><td className="px-6 py-5 rounded-l-[1.5rem] font-black text-orange-600">{item.name}</td><td className="px-6 py-5 text-slate-900 uppercase">{item.subject_name}</td><td className="px-6 py-5 text-slate-400">{item.issuer_name}</td><td className="px-6 py-5 text-red-500">{item.validity_period}</td><td className="px-6 py-5 font-mono text-[10px]">{item.signature_algorithm_reference}</td><td className="px-6 py-5">{item.certificate_format}</td><td className="px-6 py-5 text-slate-400 italic">{item.certificate_extension || "None"}</td><td className="px-6 py-5 font-black rounded-r-[1.5rem]">{item.subject_public_key_reference} bits</td></>
                                        )}
                                    </tr>
                                    {activeTechTab === 'protocols' && expandedProtocolIndex === idx && (
                                        <tr>
                                            <td colSpan="4" className="px-8 pb-4">
                                                <div className="bg-slate-900 rounded-3xl p-6 grid grid-cols-2 md:grid-cols-3 gap-3 animate-in slide-in-from-top-2">
                                                    {item.cipher_suites?.map((suite, sIdx) => (
                                                        <div key={sIdx} className="flex items-center gap-2 text-[10px] text-slate-400 font-mono border border-slate-800 p-2 rounded-xl">
                                                            <div className="w-1 h-1 rounded-full bg-orange-500" />
                                                            {suite}
                                                        </div>
                                                    ))}
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

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
                        <SecurityChatbot scanId={scanId} />
                    </div>
                </div>
            </div>
        </div>
    );
};

{/* Global Animations */ }
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

export default ScanResultsTab;