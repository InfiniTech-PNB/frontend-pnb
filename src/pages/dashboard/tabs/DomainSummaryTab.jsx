import React, { useState, useEffect } from 'react';
import {
    Activity, ShieldCheck, BarChart3, ClipboardList, ChevronDown, ChevronUp, Lock as LockIcon, AlertTriangle, Cpu, Globe, Search
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from "../../../services/api";
import SkeletonBlock from '../../../components/ui/SkeletonBlock';

const DomainSummaryTab = () => {
    const navigate = useNavigate();
    // Selection States
    const [domains, setDomains] = useState([]);
    const [selectedDomain, setSelectedDomain] = useState("");

    // Data States
    const [domainSummary, setDomainSummary] = useState(null);
    const [cryptoInventory, setCryptoInventory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [noScansFound, setNoScansFound] = useState(false);

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

    const fetchDomainData = async (domainId) => {
        if (!domainId) return;
        setLoading(true);
        setNoScansFound(false);
        try {
            // Fetch Strategic Summary
            const summaryRes = await API.get(`/domains/${domainId}/summary`);
            if (summaryRes.data && summaryRes.data.assets?.scannedAssets > 0) {
                setDomainSummary(summaryRes.data);
                
                // Fetch Domain-wide Crypto Inventory
                const inventoryRes = await API.get(`/domains/${domainId}/crypto-inventory`);
                setCryptoInventory(inventoryRes.data.algorithms || []);
            } else {
                setNoScansFound(true);
            }
        } catch (err) {
            console.error("Error fetching domain summary details:", err);
            if (err.response?.status === 404) {
                setNoScansFound(true);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDomainChange = (domainId) => {
        setSelectedDomain(domainId);
        setNoScansFound(false);
        if (domainId) {
            fetchDomainData(domainId);
        } else {
            setDomainSummary(null);
            setCryptoInventory([]);
        }
    };

    return (
        <div className="space-y-10 pb-32 animate-in fade-in duration-500">
            {/* --- SELECTION HUD --- */}
            <div className="editorial-shell p-8 bg-white border border-slate-200 rounded-[3rem] shadow-sm">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <div className="p-5 bg-emerald-50 rounded-[2rem] text-emerald-700 shadow-inner">
                            <Activity size={32} />
                        </div>
                        <div>
                            <h2 className="editorial-title text-2xl tracking-tight uppercase italic leading-none">Domain Summary</h2>
                            <p className="text-slate-400 text-xs font-bold uppercase mt-2 tracking-widest">Aggregated Cryptographic Posture</p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <select 
                            value={selectedDomain} 
                            onChange={(e) => handleDomainChange(e.target.value)} 
                            className="w-full sm:w-64 pl-6 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-[12px] font-black uppercase tracking-widest focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
                        >
                            <option value="">Select Domain</option>
                            {domains.map(d => <option key={d._id} value={d._id}>{d.domainName}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="space-y-10">
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                        <div className="xl:col-span-2 rounded-[3rem] p-10 border border-slate-200 bg-white shadow-sm space-y-6">
                            <SkeletonBlock className="h-8 w-52" />
                            <SkeletonBlock className="h-14 w-2/3" />
                            <SkeletonBlock className="h-20 w-full" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <SkeletonBlock className="h-28 w-full" />
                                <SkeletonBlock className="h-28 w-full" />
                            </div>
                        </div>
                        <div className="rounded-[3rem] p-8 border border-slate-200 bg-white shadow-sm space-y-4">
                            {Array.from({ length: 5 }).map((_, idx) => (
                                <SkeletonBlock key={idx} className="h-14 w-full" />
                            ))}
                        </div>
                    </div>
                </div>
            ) : noScansFound ? (
                <div className="flex flex-col items-center justify-center py-40 text-center animate-in fade-in duration-700">
                    <div className="p-6 bg-slate-50 border border-slate-200 rounded-[2.5rem] shadow-sm mb-8">
                        <ShieldCheck size={48} className="text-slate-300" />
                    </div>
                    <p className="text-slate-500 font-bold uppercase tracking-[0.2em] mb-8 text-sm md:text-base">
                        You have not scanned any asset for this domain yet.
                    </p>
                    <button 
                        onClick={() => navigate('/dashboard/scan')}
                        className="px-10 py-5 bg-blue-700 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] hover:bg-blue-800 transition-all shadow-xl hover:shadow-blue-500/20 active:scale-95"
                    >
                        Initiate Scan Audit
                    </button>
                </div>
            ) : domainSummary ? (
                <div className="space-y-10">
                  {/* --- TOP GRID --- */}
                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                    {/* MAIN CARD */}
                    <div className="xl:col-span-2 rounded-[3rem] p-10 bg-white border border-slate-200 shadow-xl">

                      {/* HEADER */}
                      <div className="flex flex-wrap items-center gap-3 mb-6">
                        <div className={`px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest border ${
                          domainSummary?.recommendation?.riskLevel === 'HIGH'
                            ? 'bg-red-500/10 text-red-500 border-red-500/20'
                            : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                        }`}>
                          Threat: {domainSummary?.recommendation?.riskLevel}
                        </div>

                        <div className="px-4 py-1.5 bg-slate-100 border border-slate-200 rounded-full text-[11px] font-black text-slate-500 uppercase tracking-widest">
                          Coverage: {domainSummary.assets?.scannedAssets} / {domainSummary.assets?.totalAssets}
                        </div>
                      </div>

                      {/* SCORE */}
                      {domainSummary.assets?.scannedAssets > 0 ? (
                        <>
                          <div className="mb-8">
                            <h3 className="text-5xl font-black italic text-slate-900">
                              PQC Score: <span className="text-emerald-500">
                                {Math.round((domainSummary.pqcReadiness?.averageScore || 0) * 100)}/100
                              </span>
                            </h3>

                            {/* Progress Bar */}
                            <div className="w-full bg-slate-100 rounded-full h-3 mt-4">
                              <div
                                className="bg-emerald-500 h-3 rounded-full"
                                style={{ width: `${(domainSummary.pqcReadiness?.averageScore || 0) * 100}%` }}
                              />
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="mb-8 p-8 border-2 border-dashed border-slate-200 rounded-[2rem] text-center">
                          <p className="text-slate-500 font-bold uppercase tracking-widest mb-4">No scans have been performed for this domain yet.</p>
                          <button 
                            onClick={() => navigate('/dashboard/scan')}
                            className="px-6 py-3 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-colors shadow-lg"
                          >
                            Go to Scan Page
                          </button>
                        </div>
                      )}

                      {/* SUMMARY */}
                      <p className="text-sm text-slate-600 font-semibold border-l-2 border-orange-500 pl-4 py-2 bg-orange-50 rounded-r-xl mb-8">
                        {domainSummary.recommendation?.summary}
                      </p>

                      {/* GRID INSIGHTS */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* PQC BREAKDOWN */}
                        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900">
                          <h4 className="text-xs font-black uppercase mb-4 text-slate-500">PQC Readiness</h4>

                          <div className="space-y-2 text-sm font-bold">
                            <div className="flex justify-between">
                              <span>🟣 PQC Ready</span>
                              <span>{domainSummary.pqcReadiness?.pqcReadyAssets || 0}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>🟢 Migration Ready</span>
                              <span>{domainSummary.pqcReadiness?.migrationReadyAssets || 0}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>🔴 Legacy</span>
                              <span>{domainSummary.pqcReadiness?.legacyCryptoAssets || 0}</span>
                            </div>
                          </div>
                        </div>

                        {/* RISK */}
                        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900">
                          <h4 className="text-xs font-black uppercase mb-4 text-slate-500">Risk Indicators</h4>

                          <div className="space-y-2 text-sm font-bold">
                            <div className="flex justify-between">
                              <span>⚠️ Weak Ciphers</span>
                              <span>{domainSummary.risks?.weakCipherAssets || 0}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>❌ Failed Scans</span>
                              <span>{domainSummary.assets?.failedAssets || 0}</span>
                            </div>
                          </div>
                        </div>

                        {/* TLS DISTRIBUTION */}
                        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 col-span-1 md:col-span-2">
                          <h4 className="text-xs font-black uppercase mb-4 text-slate-500">TLS Distribution</h4>

                          <div className="space-y-4">
                            {Object.entries(domainSummary.tlsDistribution || {}).map(([version, count]) => (
                              <div key={version}>
                                <div className="flex justify-between text-xs font-bold mb-1">
                                  <span>{version}</span>
                                  <span>{count}</span>
                                </div>
                                <div className="w-full bg-slate-200 h-2 rounded-full">
                                  <div
                                    className="bg-blue-500 h-2 rounded-full"
                                    style={{
                                      width: `${(count / (domainSummary.assets?.scannedAssets || 1)) * 100}%`
                                    }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>

                      {/* RECOMMENDATION */}
                      <div className="mt-10 border-t border-slate-200 pt-6 grid md:grid-cols-2 gap-6 text-slate-900">

                        <div>
                          <h4 className="text-xs font-black uppercase mb-3 text-slate-500">Recommended Stack</h4>
                          <div className="text-sm font-bold space-y-1">
                            <div>KEX: <span className="font-mono text-orange-600">{domainSummary.recommendation?.recommendedPqcKex || 'N/A'}</span></div>
                            <div>Signature: <span className="font-mono text-orange-600">{domainSummary.recommendation?.recommendedPqcSignature || 'N/A'}</span></div>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-xs font-black uppercase mb-3 text-slate-500">Migration Strategy</h4>
                          <ul className="text-xs font-bold space-y-2">
                            {domainSummary.recommendation?.migrationStrategy?.map((step, i) => (
                              <li key={i} className="flex gap-2">
                                <span className="text-orange-500 block shrink-0">•</span> 
                                <span>{step}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                      </div>
                    </div>

                    {/* RIGHT PANEL */}
                    <div className="bg-white border border-slate-200 text-slate-900 rounded-[3rem] p-8 shadow-sm flex flex-col max-h-[800px]">

                      <h4 className="text-xs font-black uppercase mb-6 text-slate-500 shrink-0">Crypto Inventory</h4>

                      <div className="flex flex-wrap gap-2 overflow-y-auto pr-2 pb-4 scrollbar-hide">
                        {cryptoInventory.map((alg, idx) => (
                          <span key={idx} className="px-3 py-2 text-[11px] font-black uppercase tracking-tight bg-slate-50 text-slate-600 rounded-lg border border-slate-200">
                            {alg}
                          </span>
                        ))}
                      </div>

                      <div className="mt-auto pt-6 border-t border-slate-100 shrink-0">
                          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter italic">
                            {cryptoInventory.length} unique cryptographic primitives detected in infrastructure.
                          </p>
                      </div>
                    </div>

                  </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-40 opacity-30 text-center">
                    <Search size={64} className="text-slate-300 mb-6" />
                    <p className="text-[12px] font-black uppercase tracking-[0.4em]">Select a domain to generate neural summary</p>
                </div>
            )}
        </div>
    );
};

export default DomainSummaryTab;
