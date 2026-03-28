import React, { useState, useEffect } from 'react';
import { Mail, ArrowRight, ArrowLeft, ShieldCheck, Database, FileCode, Activity, Zap, Search, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import API from "../../../services/api";

const INITIAL_STATE = {
    reportName: "",
    targetDomainId: "all",
    includeSections: {
        assets: true,
        cboms: true,
        scanResults: true
    },
    email: "admin@pnb-audit.com"
};

const OnDemandReportingTab = () => {
    const [domains, setDomains] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState(INITIAL_STATE);

    // Load domains for the dropdown
    useEffect(() => {
        const fetchDomains = async () => {
            try {
                const res = await API.get("/reports/schedule-init");
                setDomains(res.data.domains || []);
            } catch (err) { console.error("Failed to load domains"); }
        };
        fetchDomains();
    }, []);

    const handleInstantTrigger = async () => {
        if (!formData.reportName.trim()) {
            alert("Please provide a name for this audit extraction.");
            return;
        }

        setLoading(true);
        try {
            // Reusing the On-Demand Route we created earlier
            await API.post("/reports/on-demand", {
                scheduleName: formData.reportName,
                targetDomainId: formData.targetDomainId,
                includeSections: formData.includeSections,
                email: formData.email
            });

            alert(`🚀 Strategic Audit dispatched successfully to ${formData.email}`);
            // Optional: Reset form after success
            setFormData(INITIAL_STATE);
        } catch (err) {
            console.error("Extraction failed:", err);
            alert("Audit extraction failed. Ensure scan data exists for the selected domain.");
        } finally {
            setLoading(false);
        }
    };

    const modules = [
        { id: 'assets', label: 'Assets Data', icon: <Database size={16} /> },
        { id: 'cboms', label: 'CBOM Data', icon: <FileCode size={16} /> },
        { id: 'scanResults', label: 'Scan Results Data', icon: <Activity size={16} /> }
    ];

    return (
        <div className="space-y-6 pb-20 animate-in fade-in duration-500">
            {/* Navigation Header */}
            <div className="px-4 flex justify-between items-center">
                <Link to="/dashboard/reporting" className="flex items-center gap-2 text-slate-400 hover:text-orange-500 transition-colors text-xs font-black uppercase tracking-widest">
                    <ArrowLeft size={16} /> Back to Registry
                </Link>
                <div className="flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full">
                    <Zap size={14} className="text-orange-500" />
                    <span className="text-[10px] font-black text-orange-600 uppercase tracking-tighter">High Priority Extraction</span>
                </div>
            </div>

            <div className="max-w-5xl mx-auto bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden">
                {/* Visual Header */}
                <div className="p-10 bg-slate-900 flex justify-between items-center">
                    <div className="flex items-center gap-4 text-white">
                        <div className="p-4 bg-orange-500 rounded-2xl text-white shadow-lg shadow-orange-500/20">
                            <Zap size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black uppercase italic leading-none tracking-tighter">On-Demand Auditor</h2>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Instant cryptographic data extraction and delivery</p>
                        </div>
                    </div>
                </div>

                <div className="p-12 grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Module & Domain Configuration */}
                    <div className="space-y-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Audit Subject Name</label>
                            <input
                                type="text"
                                placeholder="E.G. EMERGENCY COMPLIANCE CHECK"
                                value={formData.reportName}
                                onChange={(e) => setFormData({ ...formData, reportName: e.target.value.toUpperCase() })}
                                className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-black text-xs placeholder:text-slate-300 focus:border-orange-500 outline-none transition-all"
                            />
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Select Extraction Targets</label>
                            <div className="space-y-3">
                                {modules.map(mod => (
                                    <div key={mod.id} className="flex items-center justify-between bg-white border-2 border-slate-50 p-5 rounded-[2rem] hover:border-orange-200 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 bg-orange-50 text-orange-500 rounded-xl">{mod.icon}</div>
                                            <span className="text-[11px] font-black uppercase text-slate-700 tracking-tight">{mod.label}</span>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={formData.includeSections[mod.id]}
                                            onChange={() => setFormData({
                                                ...formData,
                                                includeSections: { ...formData.includeSections, [mod.id]: !formData.includeSections[mod.id] }
                                            })}
                                            className="w-5 h-5 accent-orange-500 cursor-pointer"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Target and Action */}
                    <div className="space-y-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Domain Scope</label>
                            <select
                                value={formData.targetDomainId}
                                onChange={(e) => setFormData({ ...formData, targetDomainId: e.target.value })}
                                className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-black text-xs uppercase"
                            >
                                <option value="all">Consolidated Portfolio</option>
                                {domains.map(d => <option key={d._id} value={d._id}>{d.domainName}</option>)}
                            </select>
                        </div>

                        <div className="bg-[#0f172a] p-10 rounded-[3rem] text-white space-y-6 relative overflow-hidden shadow-xl border border-slate-800">
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 text-orange-500 mb-6">
                                    <Mail size={20} />
                                    <h4 className="font-black uppercase text-xs italic tracking-widest">Instant Delivery</h4>
                                </div>

                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-slate-800 border border-slate-700 p-4 rounded-xl text-xs font-bold text-white outline-none focus:border-orange-500 mb-8"
                                />

                                <button
                                    onClick={handleInstantTrigger}
                                    disabled={loading}
                                    className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-slate-700 text-white py-6 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 transition-all active:scale-95"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 size={18} className="animate-spin" />
                                            Extracting Data...
                                        </>
                                    ) : (
                                        <>
                                            Generate & Send Now <ArrowRight size={18} />
                                        </>
                                    )}
                                </button>
                            </div>
                            <ShieldCheck size={220} className="absolute -right-24 -bottom-24 text-white/5 pointer-events-none" />
                        </div>
                        
                        <div className="px-6 py-4 bg-blue-50/50 rounded-2xl border border-blue-100">
                            <p className="text-[9px] font-bold text-blue-600 uppercase tracking-tighter leading-relaxed">
                                Note: On-demand reports utilize the most recent successful scan results stored in the neural registry. Ensure a scan has been completed recently.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OnDemandReportingTab;