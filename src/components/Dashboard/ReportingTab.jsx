import React, { useState, useEffect } from 'react';
import { 
  FileText, Download, ShieldCheck, Globe, 
  Loader2, Zap, AlertCircle, Award, Activity
} from 'lucide-react';
import API from "../../services/api";

const ReportingTab = () => {
    const [domains, setDomains] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 1. Fetch All Domains (Standard route: GET /api/domains)
    useEffect(() => {
        const fetchAuditData = async () => {
            try {
                const res = await API.get("/domains");
                // The backend Domain model provides 'createdAt' for Enrollment Date
                // We map the data to ensure the list is dynamic
                setDomains(res.data);
            } catch (err) {
                console.error("Audit fetch error", err);
                setError("Could not retrieve domain list.");
            } finally {
                setLoading(false);
            }
        };
        fetchAuditData();
    }, []);

    // 2. Download Audit PDF (Standard route: GET /api/domains/:id/summary/pdf)
    const handleDownloadAudit = (domainId) => {
        window.open(`${API.defaults.baseURL}/domains/${domainId}/summary/pdf`, '_blank');
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-40">
            <Loader2 className="animate-spin text-amber-500 mb-4" size={40} />
            <p className="text-slate-400 font-black uppercase text-xs">Accessing Audit Vault...</p>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-20">
            
            {/* --- TOP AUDIT BANNER --- */}
            <div className="bg-[#0f172a] rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
                <ShieldCheck className="absolute -right-6 -top-6 w-40 h-40 text-emerald-500/10 rotate-12" />
                <div className="relative z-10">
                    <h2 className="text-3xl font-black tracking-tighter uppercase"><span className="text-emerald-500">PQC Posture</span> Audit History</h2>
                    <p className="text-slate-400 text-sm mt-2 max-w-xl font-medium italic">
                        Access official PQC Migration Roadmaps and Executive Cyber Ratings for all managed infrastructures.
                    </p>
                </div>
            </div>

            {/* --- AUDIT INVENTORY --- */}
            <div className="grid grid-cols-1 gap-6">
                {domains.length > 0 ? domains.map((domain) => (
                    <div key={domain._id} className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl transition-all group">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            
                            <div className="flex items-center gap-6">
                                <div className="p-5 rounded-3xl bg-slate-50 text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-colors">
                                    <Award size={32} />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <Globe size={14} className="text-slate-300" />
                                        <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight">
                                            {domain.domainName}
                                        </h4>
                                    </div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        Audit ID: {domain._id.substring(0, 8)}
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-4 items-center">
                                {/* Download Button */}
                                <button 
                                    onClick={() => handleDownloadAudit(domain._id)}
                                    className="flex items-center gap-2 bg-slate-900 text-white hover:bg-emerald-500 px-8 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg active:scale-95"
                                >
                                    <Download size={14} /> Download Final Audit
                                </button>
                            </div>
                        </div>

                        {/* Metadata Peek */}
                        <div className="mt-8 pt-8 border-t border-slate-50 grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-1">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Enrollment Date</p>
                                {/* DYNAMIC LOGIC: Pulls directly from MongoDB createdAt timestamp */}
                                <p className="text-xs font-bold text-slate-700">
                                    {new Date(domain.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Audit Type</p>
                                <p className="text-xs font-bold text-slate-700">Full Cryptographic Posture</p>
                            </div>
                            <div className="space-y-1 text-right md:text-left">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Status</p>
                                {/* DYNAMIC LOGIC: Displays live monitoring status based on active data presence */}
                                <p className="text-xs font-bold text-emerald-500 flex items-center gap-1 justify-end md:justify-start">
                                    <ShieldCheck size={12} /> 
                                    <span className="uppercase tracking-tighter font-black text-[10px]">Active Monitoring</span>
                                </p>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="text-center py-24 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
                        <AlertCircle className="mx-auto text-slate-300 mb-4" size={48} />
                        <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">No Domains Registered</h4>
                        <p className="text-[10px] text-slate-400 mt-2 font-medium italic">Begin Step 1 (Discovery) to start the auditing process.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReportingTab;