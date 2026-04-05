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

    function InfoItem({ label, value, highlight, isRed }) {
        return (
            <div className="flex flex-col">
                <span className="text-[9px] uppercase font-bold text-slate-400 mb-0.5">{label}</span>
                <span className={`text-xs break-all ${highlight ? 'font-black text-slate-900' : 'font-medium text-slate-600'} ${isRed ? 'text-rose-500' : ''}`}>
                    {value || "null"}
                </span>
            </div>
        );
    }

    const [downloading, setDownloading] = useState(false);

    const handleDownloadPDF = async () => {
        if (!selectedScan) return;
        setDownloading(true);
        try {
            // Use responseType: 'blob' to handle binary PDF data
            const response = await API.get(`/cbom/${selectedScan}/cbom/pdf`, {
                responseType: 'blob'
            });

            // Create a download link in the browser
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;

            // Set filename - you can customize this
            link.setAttribute('download', `CBOM-Report-${selectedScan.substring(0, 8)}.pdf`);
            document.body.appendChild(link);
            link.click();

            // Cleanup
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error("PDF Download failed:", err);
            alert("Failed to generate PDF report. Please try again.");
        } finally {
            setDownloading(false);
        }
    };

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
            <div className="editorial-shell p-8">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <div className="p-5 bg-blue-50 rounded-[2rem] text-blue-700 shadow-inner">
                            <Database size={32} />
                        </div>
                        <div>
                            <h2 className="editorial-title text-2xl tracking-tight uppercase leading-none italic">
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
                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-blue-500 appearance-none"
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
                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-blue-500 appearance-none disabled:opacity-30"
                            >
                                <option value="">Select Audit Entry</option>
                                {Array.isArray(scans) && scans.map(s => (
                                    <option key={s._id} value={s._id}>
                                        {new Date(s.createdAt).toLocaleString()}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button
                            onClick={handleDownloadPDF}
                            disabled={!selectedScan || downloading}
                            className={`flex items-center gap-2 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm
                                    ${!selectedScan
                                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                    : 'bg-slate-900 text-white hover:bg-blue-700 active:scale-95'
                                }`}
                        >
                            {downloading ? (
                                <Loader2 size={16} className="animate-spin" />
                            ) : (
                                <Database size={16} />
                            )}
                            {downloading ? "Generating..." : "Export PDF"}
                        </button>
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
                    <Loader2 className="animate-spin mb-4" style={{ color: 'var(--primary)' }} size={48} />
                    <p className="text-slate-400 font-black uppercase text-[10px] tracking-[0.3em] animate-pulse">Decrypting CBOM Archive...</p>
                </div>
            ) : (
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
                    <div className="p-8">
                        {/* 1. RENDER TABLE ONLY FOR NON-CERTIFICATE TABS */}
                        {activeTechTab !== 'certificates' && (
                            <div className="overflow-x-auto">
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
                                                <th className="px-6 py-4">Creation</th>
                                                <th className="px-6 py-4">Activation</th>
                                                <th className="px-6 py-4">ID</th>
                                            </tr>
                                        )}
                                        {activeTechTab === 'protocols' && (
                                            <tr>
                                                <th className="px-6 py-4">Protocol</th>
                                                <th className="px-6 py-4">Version</th>
                                                <th className="px-6 py-4">Cipher Suites</th>
                                                <th className="px-6 py-4">ALPN</th>
                                                <th className="px-6 py-4">OID</th>
                                            </tr>
                                        )}
                                    </thead>
                                    <tbody className="text-xs font-bold">
                                        {cbomData?.[activeTechTab]?.map((item, idx) => (
                                            <React.Fragment key={idx}>
                                                <tr className="bg-slate-50/50 hover:bg-slate-50 transition-colors">
                                                    {activeTechTab === 'algorithms' && (
                                                        <>
                                                            <td className="px-6 py-5 text-orange-600 rounded-l-[1.5rem] font-black uppercase">{item.name || "null"}</td>
                                                            <td className="px-6 py-5">{item.assetType || "null"}</td>
                                                            <td className="px-6 py-5">{item.primitive || "null"}</td>
                                                            <td className="px-6 py-5">{item.mode || "null"}</td>
                                                            <td className="px-6 py-5">{item.classicalSecurityLevel} Bits</td>
                                                            <td className="px-6 py-5 text-[10px] text-slate-400 font-mono rounded-r-[1.5rem]">{item.oid || "null"}</td>
                                                        </>
                                                    )}
                                                    {activeTechTab === 'keys' && (
                                                        <>
                                                            <td className="px-6 py-5 rounded-l-[1.5rem] font-black uppercase">{item.name || "null"}</td>
                                                            <td className="px-6 py-5">{item.assetType || "null"}</td>
                                                            <td className="px-6 py-5 text-blue-500">{item.size} Bits</td>
                                                            <td className="px-6 py-5"><span className="px-2 py-1 bg-white border rounded-md text-[9px]">{item.state || "null"}</span></td>
                                                            <td className="px-6 py-5 text-slate-400">{item.creationDate || "null"}</td>
                                                            <td className="px-6 py-5 text-slate-400">{item.activationDate || "null"}</td>
                                                            <td className="px-6 py-5 text-[9px] text-slate-400 font-mono rounded-r-[1.5rem]">{item.id || "null"}</td>
                                                        </>
                                                    )}
                                                    {activeTechTab === 'protocols' && (
                                                        <>
                                                            <td className="px-6 py-5 rounded-l-[1.5rem] font-black text-slate-900 uppercase">{item.name || "null"}</td>
                                                            <td className="px-6 py-5">{Array.isArray(item.version) ? item.version.join(', ') : item.version}</td>
                                                            <td className="px-6 py-5">
                                                                <button onClick={() => setExpandedProtocolIndex(expandedProtocolIndex === idx ? null : idx)} className="flex items-center gap-2 text-orange-500">
                                                                    {item.cipherSuites?.length || 0} Suites
                                                                    {expandedProtocolIndex === idx ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                                                </button>
                                                            </td>
                                                            <td className="px-6 py-5 font-mono">{item.alpn || "N/A"}</td>
                                                            <td className="px-6 py-5 text-[10px] text-slate-400 font-mono rounded-r-[1.5rem]">{item.oid || "N/A"}</td>
                                                        </>
                                                    )}
                                                </tr>
                                                {/* Protocol Expansion */}
                                                {activeTechTab === 'protocols' && expandedProtocolIndex === idx && (
                                                    <tr>
                                                        <td colSpan="5" className="px-8 pb-4">
                                                            <div className="bg-slate-900 rounded-3xl p-6 grid grid-cols-2 md:grid-cols-3 gap-3 animate-in fade-in zoom-in duration-200">
                                                                {item.cipherSuites?.map((suite, sIdx) => (
                                                                    <div key={sIdx} className="text-[10px] text-slate-400 font-mono border border-slate-800 p-2 rounded-xl flex items-center gap-2">
                                                                        <div className="w-1 h-1 bg-orange-500 rounded-full" /> {suite}
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
                        )}

                        {/* 2. RENDER FULL DATA TREE FOR CERTIFICATES (Outside of Table) */}
                        {activeTechTab === 'certificates' && (
                            <div className="space-y-10">
                                {cbomData?.certificates?.map((cert, certIdx) => (
                                    <div key={certIdx} className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
                                        {/* Header Strip */}
                                        <div className="bg-slate-900 p-8 flex justify-between items-center">
                                            <div>
                                                <h2 className="text-2xl font-black text-white tracking-tight">{cert.asset}</h2>
                                                <p className="text-orange-500 font-mono text-xs mt-1">Format: {cert.leafCertificate?.certificateFormat}</p>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-[10px] uppercase text-slate-500 font-bold mb-1">Fingerprint (SHA256)</div>
                                                <div className="text-[9px] font-mono text-slate-300 bg-slate-800 px-3 py-1 rounded-full">{cert.leafCertificate?.fingerprintSha256}</div>
                                            </div>
                                        </div>

                                        <div className="p-10 grid grid-cols-1 lg:grid-cols-3 gap-12">
                                            {/* LEFT: LEAF DATA */}
                                            <div className="space-y-8">
                                                <div>
                                                    <h3 className="text-[10px] font-black uppercase text-orange-600 mb-4 tracking-widest">Leaf Identity</h3>
                                                    <div className="space-y-4">
                                                        <InfoItem label="Subject" value={cert.leafCertificate?.subjectName} highlight />
                                                        <InfoItem label="Issuer" value={cert.leafCertificate?.issuerName} />
                                                        <div className="grid grid-cols-2 gap-4 pt-2">
                                                            <InfoItem label="Valid From" value={cert.leafCertificate?.validityPeriod?.notBefore} />
                                                            <InfoItem label="Valid Until" value={cert.leafCertificate?.validityPeriod?.notAfter} isRed />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="pt-6 border-t border-slate-100">
                                                    <h3 className="text-[10px] font-black uppercase text-slate-400 mb-4 tracking-widest">Cryptography</h3>
                                                    <div className="flex gap-4">
                                                        <div className="flex-1 bg-slate-50 p-4 rounded-2xl">
                                                            <p className="text-[9px] text-slate-400 uppercase">Public Key</p>
                                                            <p className="text-xs font-bold text-slate-700">{cert.leafCertificate?.subjectPublicKeyReference}</p>
                                                        </div>
                                                        <div className="flex-1 bg-slate-50 p-4 rounded-2xl">
                                                            <p className="text-[9px] text-slate-400 uppercase">Signature</p>
                                                            <p className="text-xs font-bold text-slate-700">{cert.leafCertificate?.signatureAlgorithmReference}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* MIDDLE: EXTENSIONS */}
                                            <div className="bg-slate-50/50 p-8 rounded-[2rem] border border-slate-100">
                                                <h3 className="text-[10px] font-black uppercase text-slate-400 mb-6 tracking-widest">Cert Extensions</h3>
                                                <div className="space-y-6">
                                                    <div>
                                                        <label className="text-[10px] font-bold text-slate-400 block mb-2">Key Usage</label>
                                                        <div className="flex flex-wrap gap-2">
                                                            {cert.leafCertificate?.certificateExtension?.keyUsage?.map(u => (
                                                                <span key={u} className="px-2 py-1 bg-blue-600 text-white text-[9px] font-bold rounded-lg uppercase">{u}</span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] font-bold text-slate-400 block mb-2">Extended Key Usage</label>
                                                        <div className="flex flex-wrap gap-2">
                                                            {cert.leafCertificate?.certificateExtension?.extendedKeyUsage?.map(u => (
                                                                <span key={u} className="px-2 py-1 bg-slate-200 text-slate-600 text-[9px] font-bold rounded-lg">{u}</span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-2 border-t border-slate-200 pt-4">
                                                        <InfoItem label="CA Status" value={cert.leafCertificate?.certificateExtension?.basicConstraints?.ca ? "Authority" : "End Entity"} />
                                                        <InfoItem label="Path Len" value={cert.leafCertificate?.certificateExtension?.basicConstraints?.pathLength ?? "N/A"} />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* RIGHT: TRUST TREE */}
                                            <div>
                                                <h3 className="text-[10px] font-black uppercase text-slate-400 mb-6 tracking-widest">Trust Chain Tree</h3>
                                                <div className="relative pl-6 space-y-4 border-l-2 border-slate-100">
                                                    {cert.certificateChain?.map((node, nIdx) => (
                                                        <div key={nIdx} className="relative bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                                                            <div className="absolute -left-[33px] top-6 w-4 h-4 rounded-full bg-orange-500 border-4 border-white shadow-sm" />
                                                            <p className="text-[10px] font-black text-slate-800 break-all">{node.subject}</p>
                                                            <p className="text-[9px] text-slate-400 mt-1 italic">Issued by: {node.issuer}</p>
                                                            {/* Added Fingerprint here */}
                                                            <div className="bg-slate-50 p-2 rounded-lg">
                                                                <p className="text-[8px] text-slate-400 uppercase mb-1 font-bold">SHA256 Fingerprint</p>
                                                                <p className="text-[8px] font-mono text-slate-600 break-all uppercase leading-tight">
                                                                    {node.fingerprintSha256 || "N/A"}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="mt-8 pt-6 border-t border-slate-100">
                                                    <h3 className="text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Renewal History</h3>
                                                    <div className="space-y-3">
                                                        {cert.leafCertificate?.certificateHistory?.map((h, hIdx) => (
                                                            <div key={hIdx} className="bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                                                                <p className="text-[10px] font-bold text-slate-700 truncate mb-1">{h.issuer}</p>
                                                                <div className="flex justify-between items-center text-[9px] font-mono text-slate-500">
                                                                    <span>S: {h.notBefore}</span>
                                                                    <span className="text-slate-300">|</span>
                                                                    <span>E: {h.notAfter}</span>
                                                                </div>
                                                            </div>
                                                        )) || <p className="text-[10px] italic text-slate-300">No history available</p>}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
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