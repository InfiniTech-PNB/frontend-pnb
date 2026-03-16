import React, { useState, useEffect } from 'react';
import {
    FileCode, ShieldCheck, Lock, Download,
    Loader2, Cpu, History, Globe,
    BarChart3, PieChart, ShieldAlert, AlertTriangle, XCircle, CheckCircle2, Filter
} from 'lucide-react';
import API from "../../services/api";

const CBOMTab = () => {
    const [domains, setDomains] = useState([]);
    const [scans, setScans] = useState([]);
    const [selectedDomainId, setSelectedDomainId] = useState("");
    const [selectedScanId, setSelectedScanId] = useState("");
    const [cbomData, setCbomData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fetchingInitial, setFetchingInitial] = useState(true);
    const [error, setError] = useState(null);

    // --- FILTER STATES ---
    const [cipherFilters, setCipherFilters] = useState([]);
    const [selectedFilter, setSelectedFilter] = useState("ALL");

    // 1. Initial Load: Fetch All Domains
    useEffect(() => {
        const fetchDomains = async () => {
            try {
                const res = await API.get("/domains");
                setDomains(res.data);
                if (res.data.length > 0) setSelectedDomainId(res.data[0]._id);
            } catch (err) { setError("Failed to load domains."); }
            finally { setFetchingInitial(false); }
        };
        fetchDomains();
    }, []);

    // 2. Load History & Cipher Suite Inventory
    useEffect(() => {
        const fetchScansAndFilters = async () => {
            if (!selectedDomainId) return;
            setLoading(true);
            try {
                // Fetch the unique inventory of algorithms/ciphers used in this domain
                const filterRes = await API.get(`/domains/${selectedDomainId}/crypto-inventory`);
                setCipherFilters(filterRes.data.algorithms || []);

                const res = await API.get(`/scan/domain/${selectedDomainId}`);
                const completed = res.data.scans.filter(s => s.status === 'completed');
                setScans(completed);
                if (completed.length > 0) setSelectedScanId(completed[0]._id);
                else { setSelectedScanId(""); setCbomData(null); }
            } catch (err) { console.error("History fetch error", err); }
            finally { setLoading(false); }
        };
        fetchScansAndFilters();
    }, [selectedDomainId]);

    // 3. Data Load: Fetch/Generate CBOM
    useEffect(() => {
        if (!selectedScanId) return;
        const fetchCbom = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await API.get(`/cbom/${selectedScanId}/cbom`);
                const data = res.data.algorithms ? res.data : res.data.cbom;
                setCbomData(data);
            } catch (err) {
                if (err.response?.status === 404) {
                    const gen = await API.post(`/cbom/${selectedScanId}`);
                    setCbomData(gen.data.cbom);
                } else { setError("Failed to retrieve CBOM inventory."); }
            } finally { setLoading(false); }
        };
        fetchCbom();
    }, [selectedScanId]);

    // Helper: Map PQ Status for the Table
    const getPQStatus = (item) => {
        const name = (item.name || "").toLowerCase();
        const size = parseInt(item.size) || 0;
        const level = parseInt(item.classical_security_level) || 0;

        if (level >= 128 || name.includes('pqc') || size >= 3072) {
            return { label: "Quantum-Safe", color: "text-emerald-500", icon: <CheckCircle2 size={14} />, bg: "bg-emerald-50" };
        } else if (level >= 80 || size >= 2048) {
            return { label: "Partial", color: "text-amber-500", icon: <AlertTriangle size={14} />, bg: "bg-amber-50" };
        }
        return { label: "Vulnerable", color: "text-red-500", icon: <XCircle size={14} />, bg: "bg-red-50" };
    };

    // --- UPDATED FILTER LOGIC: Matches against Cipher Suites and Key names ---
    const getFilteredRows = () => {
        if (!cbomData) return [];

        // Determine data source (Fallback to keys if algorithms is empty)
        const source = (cbomData.algorithms && cbomData.algorithms.length > 0)
            ? cbomData.algorithms
            : (cbomData.keys || []);

        if (selectedFilter === "ALL") return source;

        return source.filter((item, index) => {
            const nameMatch = item.name?.toLowerCase().includes(selectedFilter.toLowerCase());
            const primitiveMatch = item.primitive?.toLowerCase().includes(selectedFilter.toLowerCase());
            
            // Also check the corresponding cipher suite in the protocols array
            const associatedCipher = cbomData.protocols?.[0]?.cipher_suites?.[index]?.toLowerCase() || "";
            const cipherMatch = associatedCipher.includes(selectedFilter.toLowerCase());

            return nameMatch || primitiveMatch || cipherMatch;
        });
    };

    if (fetchingInitial) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-amber-500" /></div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-20">

            {/* --- 1. SELECTION HEADER --- */}
            <div className="bg-white border border-slate-100 rounded-[2.5rem] p-6 shadow-sm flex flex-col md:flex-row gap-6 items-end">
                <div className="flex-1 space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Target Domain</label>
                    <div className="relative">
                        <select value={selectedDomainId} onChange={(e) => setSelectedDomainId(e.target.value)} className="w-full appearance-none bg-slate-50 border-2 border-slate-100 rounded-2xl py-3 px-5 text-sm font-bold text-slate-700 outline-none">
                            {domains.map(d => <option key={d._id} value={d._id}>{d.domainName}</option>)}
                        </select>
                        <Globe className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                    </div>
                </div>
                <div className="flex-1 space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Scan History</label>
                    <div className="relative">
                        <select value={selectedScanId} onChange={(e) => setSelectedScanId(e.target.value)} className="w-full appearance-none bg-slate-50 border-2 border-slate-100 rounded-2xl py-3 px-5 text-sm font-bold text-slate-700 outline-none">
                            {scans.map(s => <option key={s._id} value={s._id}>{new Date(s.createdAt).toLocaleDateString()} - {s.scanType.toUpperCase()}</option>)}
                            {scans.length === 0 && <option>No Data Found</option>}
                        </select>
                        <History className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                    </div>
                </div>
                <button onClick={() => window.open(`${API.defaults.baseURL}/cbom/${selectedScanId}/cbom/pdf`, '_blank')} disabled={!selectedScanId} className="px-8 py-3.5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-500 transition-all shadow-lg disabled:opacity-30">
                    <Download size={14} />
                </button>
            </div>

            {/* --- NEW: CIPHER SUITE FILTER CHIPS --- */}
            {cbomData && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2 px-2 scrollbar-hide">
                    <div className="flex items-center gap-2 px-3 py-2 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase whitespace-nowrap">
                        <Filter size={12} /> Suite Filters:
                    </div>
                    <button
                        onClick={() => setSelectedFilter("ALL")}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all whitespace-nowrap ${selectedFilter === "ALL" ? "bg-amber-500 text-amber-950 shadow-md" : "bg-white border border-slate-100 text-slate-400"}`}
                    >
                        Show All
                    </button>
                    {cipherFilters.map(suite => (
                        <button
                            key={suite}
                            onClick={() => setSelectedFilter(suite)}
                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all whitespace-nowrap ${selectedFilter === suite ? "bg-blue-500 text-white shadow-md shadow-blue-100" : "bg-white border border-slate-100 text-slate-400"}`}
                        >
                            {suite}
                        </button>
                    ))}
                </div>
            )}

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20"><Loader2 className="animate-spin text-amber-500 mb-2" /><p className="text-xs font-black text-slate-400 uppercase tracking-tighter">Syncing Bill of Materials...</p></div>
            ) : cbomData ? (
                <>
                    {/* --- 2. VISUAL ANALYTICS ROW --- */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        {/* PQC Compliance Gauge */}
                        <div className="bg-[#0f172a] rounded-[2.5rem] p-8 text-white flex flex-col items-center justify-center shadow-xl">
                            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">PQC Readiness Score</h4>
                            <div className="relative w-32 h-32 flex items-center justify-center">
                                <div className="absolute inset-0 rounded-full border-[10px] border-slate-800"></div>
                                <div className="absolute inset-0 rounded-full border-[10px] border-emerald-500 border-t-transparent border-r-transparent rotate-45"></div>
                                <span className="text-3xl font-black">
                                    {Math.round((getFilteredRows().filter(item => getPQStatus(item).label === "Quantum-Safe").length / Math.max(getFilteredRows().length, 1)) * 100)}%
                                </span>
                            </div>
                            <p className="mt-4 text-[9px] font-bold text-emerald-400 uppercase tracking-widest">Quantum-Ready Primitives</p>
                        </div>

                        {/* Key Strength Distribution */}
                        <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                                <BarChart3 className="text-amber-500" size={14} /> Key Strengths
                            </h4>
                            <div className="flex items-end justify-between h-24 gap-2 bg-slate-50/50 p-3 rounded-2xl">
                                {cbomData.keys?.map((k, i) => {
                                    const val = parseInt(k.size) || 0;
                                    return (
                                        <div key={i} className="flex-1 bg-slate-200 rounded-t-md relative group h-full">
                                            <div className={`absolute bottom-0 w-full rounded-t-md transition-all ${val < 2048 ? 'bg-red-400' : 'bg-amber-400'}`}
                                                style={{ height: `${Math.min((val / 4096) * 100, 100)}%` }}></div>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="mt-4 flex justify-between text-[8px] font-black text-slate-400 uppercase italic">
                                <span>80b</span><span>2048b</span><span>4096b+</span>
                            </div>
                        </div>

                        {/* Protocol Breakdown */}
                        <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <PieChart className="text-blue-500" size={14} /> Infrastructure Protocols
                            </h4>
                            <div className="space-y-3">
                                {cbomData.protocols?.map((p, i) => (
                                    <div key={i} className="space-y-1">
                                        <div className="flex justify-between text-[9px] font-bold">
                                            <span className="text-slate-600 uppercase">{p.name}</span>
                                            <span className="text-slate-400">{(p.version || []).join(", ")}</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-blue-500 w-full"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* --- 3. ARCHITECTURAL CBOM TABLE --- */}
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden">
                        <div className="px-8 py-5 border-b border-slate-50 bg-slate-900 text-white flex justify-between items-center">
                            <h4 className="text-[11px] font-black uppercase tracking-widest flex items-center gap-2">
                                <FileCode size={16} className="text-amber-400" /> Step 5: Cryptographic Bill of Materials
                            </h4>
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">Live Scan Result</span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                                        <th className="px-8 py-4">Asset / Endpoint</th>
                                        <th className="px-8 py-4">Protocol Version</th>
                                        <th className="px-8 py-4">Key / Cert Type</th>
                                        <th className="px-8 py-4">Cipher Suite</th>
                                        <th className="px-8 py-4 text-center">PQ Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {getFilteredRows().map((item, i) => {
                                        const algoName = item.name || "Unknown";
                                        const keySize = item.size || "Unknown";
                                        const cert = cbomData.certificates?.[i] || {};
                                        const status = getPQStatus(item);

                                        return (
                                            <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-8 py-5">
                                                    <p className="text-xs font-bold text-slate-800">
                                                        {cert.subject_name || "Infrastructure Node"}
                                                    </p>
                                                    <p className="text-[9px] text-slate-400 mt-0.5 truncate max-w-[180px]">
                                                        {cert.issuer_name || "Internal CA"}
                                                    </p>
                                                </td>
                                                <td className="px-8 py-5 text-xs font-mono text-slate-500">
                                                    {cbomData.protocols?.[0]?.name || "TLS"} {cbomData.protocols?.[0]?.version?.[0] || "1.3"}
                                                </td>
                                                <td className="px-8 py-5">
                                                    <p className="text-xs text-slate-700 font-bold">{item.primitive || algoName}</p>
                                                    <p className="text-[9px] text-slate-400 uppercase font-black">{keySize} BIT</p>
                                                </td>
                                                <td className="px-8 py-5 text-[10px] font-mono text-slate-400 uppercase leading-relaxed">
                                                    {/* Display the corresponding cipher suite by index */}
                                                    {cbomData.protocols?.[0]?.cipher_suites?.[i] || "AES_256_GCM"}
                                                </td>
                                                <td className="px-8 py-5">
                                                    <div className={`flex items-center gap-2 px-3 py-2 rounded-xl w-fit mx-auto border ${status.color} ${status.bg} border-current shadow-sm`}>
                                                        {status.icon}
                                                        <span className="text-[10px] font-black uppercase tracking-tighter">
                                                            {status.label}
                                                        </span>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}

                                    {getFilteredRows().length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="px-8 py-20 text-center text-slate-400 font-bold uppercase text-xs italic">
                                                No results match your selected filter.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            ) : (
                <div className="text-center py-20 bg-slate-50 rounded-[2.5rem] border border-dashed border-slate-200">
                    <ShieldAlert className="mx-auto text-slate-300 mb-2" />
                    <p className="text-slate-400 font-bold uppercase text-xs">No scan inventory available.</p>
                </div>
            )}
        </div>
    );
};

export default CBOMTab;