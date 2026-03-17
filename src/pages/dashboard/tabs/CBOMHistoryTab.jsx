import React, { useState, useEffect } from 'react';
import {
    Database, Globe, Clock, Loader2, Search,
    Cpu, Key, Shield, Globe2, ChevronDown, ChevronUp, Lock as LockIcon
} from 'lucide-react';
import API from "../../../services/api";
import SecurityChatbot from '../../../components/Dashboard/SecurityChatbot';

const CBOMHistoryTab = () => {
    // Selection States
    const [domains, setDomains] = useState([]);
    const [scans, setScans] = useState([]);
    const [selectedDomain, setSelectedDomain] = useState("");
    const [selectedScan, setSelectedScan] = useState("");

    // Data & UI States
    const [cbomData, setCbomData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [activeTechTab, setActiveTechTab] = useState("algorithms");
    const [expandedProtocolIndex, setExpandedProtocolIndex] = useState(null);

    // Fetch Domains on Mount
    useEffect(() => {
        const fetchDomains = async () => {
            try {
                const res = await API.get("/domains");
                setDomains(res.data || []);
            } catch (err) {
                console.error("Error fetching domains:", err);
            }
        };
        fetchDomains();
    }, []);

    // Fetch Scans when Domain changes
    useEffect(() => {
        if (!selectedDomain) {
            setScans([]);
            return;
        }
        const fetchScans = async () => {
            try {
                const res = await API.get(`/scan/domain/${selectedDomain}`);
                // Safety check: ensure scans is always an array
                const scanData = Array.isArray(res.data) ? res.data : (res.data.scans || []);
                setScans(scanData);
                setSelectedScan("");
                setCbomData(null);
            } catch (err) {
                console.error("Error fetching scans:", err);
                setScans([]);
            }
        };
        fetchScans();
    }, [selectedDomain]);

    // Fetch CBOM when Scan is selected
    const handleFetchCBOM = async (scanId) => {
        if (!scanId) return;
        setSelectedScan(scanId);
        setLoading(true);
        try {
            const res = await API.get(`/cbom/${scanId}/cbom`);
            setCbomData(res.data);
        } catch (err) {
            console.error("Error fetching CBOM:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-10 pb-32 animate-in fade-in duration-500">

            {/* Global Animations Style Tag */}
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

            {/* --- FILTER HUD --- */}
            <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <div className="p-5 bg-orange-50 rounded-[2rem] text-orange-600 shadow-inner">
                            <Database size={32} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase leading-none italic">
                                CBOM Registry
                            </h2>
                            <p className="text-[10px] font-mono text-slate-400 mt-2 uppercase tracking-widest font-bold font-mono">Archive Discovery Engine</p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <div className="relative w-full sm:w-72">
                            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500" size={16} />
                            <select
                                value={selectedDomain}
                                onChange={(e) => setSelectedDomain(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-orange-500 appearance-none shadow-inner"
                            >
                                <option value="">Select Target Domain</option>
                                {domains.map(d => (
                                    <option key={d._id} value={d._id}>{d.domainName}</option>
                                ))}
                            </select>
                        </div>

                        <div className="relative w-full sm:w-72">
                            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500" size={16} />
                            <select
                                value={selectedScan}
                                disabled={!selectedDomain}
                                onChange={(e) => handleFetchCBOM(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-orange-500 appearance-none shadow-inner disabled:opacity-30"
                            >
                                <option value="">Select Audit Entry</option>
                                {Array.isArray(scans) && scans.map(s => (
                                    <option key={s._id} value={s._id}>
                                        {new Date(s.createdAt).toLocaleString()}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- CBOM TABLE AREA (Results Tab Design) --- */}
            {!cbomData && !loading ? (
                <div className="flex flex-col items-center justify-center py-40 text-center opacity-30">
                    <Search size={64} className="text-slate-300 mb-6" />
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Awaiting Selection Parameters</p>
                </div>
            ) : loading ? (
                <div className="flex flex-col items-center justify-center py-40">
                    <Loader2 className="animate-spin text-orange-500 mb-4" size={48} />
                    <p className="text-slate-400 font-black uppercase text-[10px] tracking-[0.3em] animate-pulse">Decrypting CBOM Archive...</p>
                </div>
            ) : (
                <div className="bg-white rounded-[4rem] border border-slate-100 shadow-xl overflow-hidden">
                    {/* Tabs Header */}
                    <div className="bg-slate-900 p-5 flex gap-3 overflow-x-auto scrollbar-hide">
                        {[
                            { id: 'algorithms', label: 'Algorithms', icon: Cpu },
                            { id: 'keys', label: 'Keys', icon: Key },
                            { id: 'protocols', label: 'Protocols', icon: Globe2 },
                            { id: 'certificates', label: 'Certificates', icon: Shield }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTechTab(tab.id)}
                                className={`flex items-center gap-3 px-8 py-4 rounded-[1.8rem] text-[10px] font-black uppercase tracking-widest transition-all ${activeTechTab === tab.id ? 'bg-orange-500 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-800'}`}
                            >
                                <tab.icon size={16} /> {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="p-8 overflow-x-auto">
                        <table className="w-full text-left border-separate border-spacing-y-2">
                            <thead className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                {activeTechTab === 'algorithms' && (
                                    <tr><th className="px-6 py-4">Name</th><th className="px-6 py-4">Asset Type</th><th className="px-6 py-4">Primitive</th><th className="px-6 py-4">Mode</th><th className="px-6 py-4">Security Level</th><th className="px-6 py-4">OID</th></tr>
                                )}
                                {activeTechTab === 'keys' && (
                                    <tr><th className="px-6 py-4">Name</th><th className="px-6 py-4">Asset Type</th><th className="px-6 py-4">Size</th><th className="px-6 py-4">State</th><th className="px-6 py-4">Creation Date</th><th className="px-6 py-4">Activation Date</th><th className="px-6 py-4">ID Reference</th></tr>
                                )}
                                {activeTechTab === 'protocols' && (
                                    <tr><th className="px-6 py-4">Protocol</th><th className="px-6 py-4">Version Support</th><th className="px-6 py-4">Cipher Suites</th><th className="px-6 py-4">OID</th></tr>
                                )}
                                {activeTechTab === 'certificates' && (
                                    <tr><th className="px-6 py-4">Name</th><th className="px-6 py-4">Subject</th><th className="px-6 py-4">Authority</th><th className="px-6 py-4">Validity</th><th className="px-6 py-4">Signature Ref</th><th className="px-6 py-4">Format</th><th className="px-6 py-4">Extensions</th><th className="px-6 py-4">PubKey Size</th></tr>
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
                                                        <button onClick={() => setExpandedProtocolIndex(expandedProtocolIndex === idx ? null : idx)} className="flex items-center gap-2 text-orange-500 hover:text-orange-600 transition-colors">
                                                            {item.cipher_suites?.length || 0} Suites {expandedProtocolIndex === idx ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
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

export default CBOMHistoryTab;