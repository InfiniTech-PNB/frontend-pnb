import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Mail, ArrowRight, ArrowLeft, ShieldCheck, Database, FileCode, Activity, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import API from "../../../services/api";
import { useFeedback } from '../../../context/FeedbackContext';

const DEFAULT_FORM_STATE = {
    scheduleName: "",
    reportType: "Project Audit Summary",
    frequency: "Weekly",
    targetDomainId: "all",
    includeSections: {
        assets: true,
        cboms: true,
        scanResults: true
    },
    startDate: new Date().toISOString().split('T')[0],
    time: "09:00",
    email: "admin@pnb-audit.com"
};

const ScheduledReportingTab = () => {
    const [domains, setDomains] = useState([]);
    const [enabled, setEnabled] = useState(true);
    const [loading, setLoading] = useState(false);
    const [activeSchedules, setActiveSchedules] = useState([]);
    const [formData, setFormData] = useState(DEFAULT_FORM_STATE);
    const { showToast, showConfirm } = useFeedback();

    const [availableAssets, setAvailableAssets] = useState([]); // Assets for selected domain
    const [selectedAssets, setSelectedAssets] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchDomains = async () => {
            try {
                const res = await API.get("/reports/schedule-init");
                setDomains(res.data.domains);
            } catch (err) { console.error("Failed to load domains"); }
        };
        fetchDomains();
    }, []);

    // 1. Fetch existing schedule on load
    const fetchCurrentSchedule = async () => {
        try {
            const res = await API.get("/reports/my-schedule");
            setActiveSchedules(res.data); // res.data is now [{}, {}]
        } catch (err) { console.error("Error loading schedules"); }
    };

    useEffect(() => {
        fetchCurrentSchedule();
    }, []);

    // 2. Delete Handler
    // 2. Updated Delete Handler
    const handleDelete = async (id) => {
        const confirmed = await showConfirm("Are you sure you want to stop this automated report?");
        if (confirmed) {
            try {
                // 1. Send the delete request to the backend
                await API.delete(`/reports/schedule/${id}`);

                // 2. THE FIX: Update the local state immediately
                // We keep only the schedules that DO NOT match the ID we just deleted
                setActiveSchedules((prevSchedules) =>
                    prevSchedules.filter(schedule => schedule._id !== id)
                );

                showToast("Automation halted and removed from registry.", "success");
            } catch (err) {
                console.error("Delete failed:", err);
                showToast("Could not delete the schedule. Please try again.", "error");
            }
        }
    };

    const handleDomainChange = async (domainId) => {
        setFormData({ ...formData, targetDomainId: domainId });
        setSelectedAssets([]); // Reset selection
        if (!domainId) return;

        try {
            const res = await API.get(`/asset-discovery/${domainId}/assets`);
            setAvailableAssets(res.data.assets || []);
        } catch (err) { console.error("Error loading assets"); }
    };

    const envMetrics = [
        { id: 'assetCriticality', label: 'Asset Criticality' },
        { id: 'confidentialityWeight', label: 'Confidentiality' },
        { id: 'integrityWeight', label: 'Integrity' },
        { id: 'availabilityWeight', label: 'Availability' },
        { id: 'slaRequirement', label: 'SLA Requirement' },
        { id: 'dependentServices', label: 'Dependent Services' }
    ];

    const handleToggleAsset = (assetId) => {
        setSelectedAssets(prev => {
            const exists = prev.find(a => a.assetId === assetId);
            if (exists) return prev.filter(a => a.assetId !== assetId);

            // INITIALIZE WITH DEFAULT SLIDER VALUES (5/10)
            return [...prev, {
                assetId,
                businessContext: {
                    assetCriticality: 5,
                    confidentialityWeight: 5,
                    integrityWeight: 5,
                    availabilityWeight: 5,
                    slaRequirement: 5,
                    dependentServices: 0
                }
            }];
        });
    };

    const filteredAssets = availableAssets.filter(asset =>
        asset.host.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.ip.includes(searchTerm)
    );

    const updateMetric = (assetId, metricId, value) => {
        setSelectedAssets(prev => prev.map(a =>
            a.assetId === assetId
                ? { ...a, businessContext: { ...a.businessContext, [metricId]: parseInt(value) } }
                : a
        ));
    };

    const handleSave = async () => {
        // 1. Validation
        if (!formData.scheduleName.trim() || !formData.targetDomainId || selectedAssets.length === 0) {
            showToast("Please provide an Audit Name, select a Domain, and choose at least one Asset.", "error");
            return;
        }

        setLoading(true);
        try {
            // 2. API Call
            await API.post("/reports/schedule", {
                ...formData,
                // Ensure we are sending the objects { assetId, businessContext }
                selectedAssets: selectedAssets.map(a => ({
                    assetId: a.assetId,
                    businessContext: a.businessContext
                })),
                isEnabled: enabled
            });

            // 3. THE RESET LOGIC: Go back to default mode
            setFormData(DEFAULT_FORM_STATE); // Reset name, email, time, etc.
            setSelectedAssets([]);           // Clear selected assets & their sliders
            setAvailableAssets([]);          // Clear the scrollable topography list
            setSearchTerm("");               // Clear the search bar
            setEnabled(true);                // Reset the toggle to enabled

            // 4. Refresh the registry below the form
            fetchCurrentSchedule();

            showToast("🚀 Audit Schedule registered successfully. Form reset to defaults.", "success");
        } catch (err) {
            console.error("Save failed:", err);
            showToast("Error saving schedule. Please check your connection.", "error");
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
            <div className="px-4">
                <Link to="/dashboard/reporting" className="flex items-center gap-2 text-slate-400 hover:text-orange-500 transition-colors text-sm font-black uppercase tracking-widest">
                    <ArrowLeft size={16} /> Back to Registry
                </Link>
            </div>

            <div className="max-w-5xl mx-auto bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden">
                {/* Header */}
                <div className="p-10 bg-white border-b border-slate-50 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="p-4 bg-[var(--primary)] rounded-2xl text-white">
                            <Calendar size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 uppercase italic leading-none tracking-tighter">Report Scheduler</h2>
                            <p className="text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-widest mt-2">Automate extraction from Assets & Scan Results</p>
                        </div>
                    </div>
                </div>

                <div className="p-12 grid grid-cols-1 lg:grid-cols-1 gap-16">
                    {/* Module Selection */}
                    <div className="space-y-8">
                        <div className="space-y-3">
                            <label className="text-xs font-black uppercase text-slate-400 tracking-[0.2em] ml-1">
                                Schedule Identifier / Audit Name
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. Q2 COMPLIANCE SUMMARY"
                                value={formData.scheduleName}
                                onChange={(e) => setFormData({ ...formData, scheduleName: e.target.value.toUpperCase() })}
                                className="w-full p-4 bg-orange-50/30 border-2 border-orange-100 rounded-2xl font-black text-sm placeholder:text-slate-300 focus:border-orange-500 outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="text-xs font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Integrated Project Modules</label>
                            <div className="space-y-3">
                                {modules.map(mod => (
                                    <div key={mod.id} className="flex items-center justify-between bg-white border-2 border-slate-100 p-5 rounded-[2rem] hover:border-orange-200 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 bg-orange-50 text-orange-500 rounded-xl">{mod.icon}</div>
                                            <span className="text-sm font-black uppercase text-slate-700 tracking-tight">{mod.label}</span>
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

                        <div className="editorial-shell p-6 lg:p-8 rounded-[2rem] space-y-8">
                            {/* 1. Domain Selection */}
                            <div className="space-y-3">
                                <label className="text-xs font-black uppercase text-slate-400 ml-1 tracking-widest">Target Domain Scope</label>
                                <p className="text-sm text-slate-500 font-semibold leading-relaxed">
                                    Select a domain to discover assets, then choose nodes and tune their risk parameters for scheduled intelligence reports.
                                </p>
                                <select
                                    value={formData.targetDomainId}
                                    onChange={(e) => handleDomainChange(e.target.value)}
                                    className="w-full p-4 bg-white border-2 border-slate-200 rounded-2xl font-black text-sm uppercase outline-none focus:border-orange-500 transition-all"
                                >
                                    <option value="">Select a Domain to Discover Assets</option>
                                    {domains.map(d => <option key={d._id} value={d._id}>{d.domainName}</option>)}
                                </select>
                            </div>

                            {/* 2. Asset Discovery & Search Box */}
                            {availableAssets.length > 0 && (
                                <div className="space-y-6 animate-in slide-in-from-bottom-4">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <h4 className="text-xs sm:text-sm font-black uppercase text-slate-400 tracking-[0.2em] ml-1">
                                            Network Topography ({availableAssets.length} Nodes Found)
                                        </h4>
                                        <span className="text-xs sm:text-sm font-black uppercase tracking-widest text-orange-500">
                                            {selectedAssets.length} Selected
                                        </span>

                                        {/* 🔍 Search Input */}
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-4 flex items-center text-slate-400 group-focus-within:text-orange-500 transition-colors">
                                                <Activity size={14} />
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="SEARCH HOST OR IP..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="pl-10 pr-4 py-2 bg-white border-2 border-slate-200 rounded-xl text-xs sm:text-sm font-black uppercase outline-none focus:border-orange-500 w-full md:w-64 transition-all"
                                            />
                                        </div>
                                    </div>

                                    {/* 📦 SCROLLABLE ASSET GRID */}
                                    <div className="flex flex-col gap-2 max-h-[450px] overflow-y-auto p-4 bg-white rounded-[2.5rem] border-2 border-slate-200 shadow-inner custom-scrollbar">
                                        {filteredAssets.map(asset => {
                                            const selection = selectedAssets.find(s => s.assetId === asset._id);
                                            return (
                                                <div
                                                    key={asset._id}
                                                    onClick={() => handleToggleAsset(asset._id)}
                                                    className={`group flex items-center justify-between p-5 rounded-2xl border-2 transition-all cursor-pointer ${selection
                                                        ? 'border-orange-400 bg-orange-50/50 shadow-md translate-x-1'
                                                        : 'border-slate-200 bg-white hover:border-orange-200'
                                                        }`}
                                                >
                                                    {/* Left Side: Checkbox & Identity */}
                                                    <div className="flex items-center gap-5">
                                                        <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${selection ? 'bg-orange-500 border-orange-500' : 'border-slate-200'
                                                            }`}>
                                                            {selection && <ShieldCheck size={14} className="text-white" />}
                                                        </div>

                                                        <div className="flex flex-col">
                                                            {/* Full Hostname - No Truncation */}
                                                            <span className="text-sm font-black text-slate-800 uppercase italic tracking-tight">
                                                                {asset.host}
                                                            </span>
                                                            {/* Full IP Address */}
                                                            <span className="text-xs font-bold text-slate-400 font-mono mt-0.5">
                                                                {asset.ip}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Right Side: Status/Type Badge */}
                                                    <div className="flex items-center gap-4">
                                                        <span className="hidden sm:inline-block text-[10px] font-black px-3 py-1 bg-slate-100 text-slate-500 rounded-full uppercase tracking-widest">
                                                            {asset.assetType || 'Compute Node'}
                                                        </span>

                                                        {/* Active Pulse for Selection */}
                                                        {selection && (
                                                            <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}

                                        {filteredAssets.length === 0 && (
                                            <div className="py-20 text-center">
                                                <p className="text-sm font-black text-slate-400 uppercase tracking-widest">
                                                    No matching nodes found in the topography
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* 3. Slider Configuration (Renders only if assets are selected) */}
                            {selectedAssets.length > 0 && (
                                <div className="mt-12 space-y-6 animate-in fade-in">
                                    <h4 className="text-xs sm:text-sm font-black uppercase text-orange-500 tracking-[0.2em] ml-1">
                                        Adjust Risk Parameters for {selectedAssets.length} Selected Nodes
                                    </h4>
                                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                                        {selectedAssets.map(selection => {
                                            const asset = availableAssets.find(a => a._id === selection.assetId);
                                            if (!asset) return null;
                                            return (
                                                <div key={asset._id} className="bg-white border-2 border-orange-100 rounded-[2rem] p-6 shadow-sm">
                                                    <div className="flex justify-between items-center mb-6">
                                                        <div className="flex items-center gap-3">
                                                            <div className="p-2 bg-orange-50 text-orange-500 rounded-lg"><Database size={14} /></div>
                                                            <span className="text-sm font-black text-slate-800 uppercase italic">{asset.host}</span>
                                                        </div>
                                                        <button onClick={() => handleToggleAsset(asset._id)} className="text-slate-300 hover:text-red-500"><Trash2 size={16} /></button>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                        {envMetrics.map(metric => (
                                                            <div key={metric.id} className="space-y-2">
                                                                <div className="flex justify-between">
                                                                    <label className="text-xs font-black uppercase text-slate-400">{metric.label}</label>
                                                                    <span className="text-sm font-black text-orange-500">{selection.businessContext[metric.id]}</span>
                                                                </div>
                                                                <input
                                                                    type="range" min="1" max="10"
                                                                    value={selection.businessContext[metric.id]}
                                                                    onChange={(e) => updateMetric(asset._id, metric.id, e.target.value)}
                                                                    className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-orange-500"
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Timeline & Submit */}
                    <div className="space-y-10">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase text-slate-400 ml-1">Frequency</label>
                                <select
                                    value={formData.frequency}
                                    onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                                    className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-black text-sm uppercase"
                                >
                                    <option>Daily</option>
                                    <option>Weekly</option>
                                    <option>Monthly</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase text-slate-400 ml-1">Schedule Time</label>
                                <input
                                    type="time"
                                    value={formData.time}
                                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                    className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-black text-sm"
                                />
                            </div>
                        </div>

                        <div
                            className="p-10 rounded-[2.5rem] text-black space-y-6 relative border border-slate-900 overflow-hidden shadow-xl"
                            // style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-soft) 20%)' }}
                        >
                            <div className="relative z-10">
                                <div className="flex items-center gap-3  mb-6">
                                    <Mail size={20} />
                                    <h4 className="font-black uppercase text-sm italic">Email Delivery</h4>
                                </div>

                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="recipient@org.com"
                                    className="w-full bg-white/15 placeholder:text-white/70 border border-slate-900 p-4 rounded-xl text-sm font-bold outline-none focus:border-white mb-6"
                                />

                                <button
                                    onClick={handleSave}
                                    disabled={loading}
                                    className="w-full bg-white hover:bg-orange-50 text-[var(--primary)] py-5 rounded-2xl not-hover:border not-hover:border-[var(--primary)] font-black uppercase text-sm tracking-widest flex items-center justify-center gap-3 transition-all"
                                >
                                    {loading ? "Scheduling..." : "Save Report Schedule"} <ArrowRight size={18} />
                                </button>
                            </div>
                            <ShieldCheck size={200} className="absolute -right-20 -bottom-20 text-white/5 pointer-events-none" />
                        </div>
                    </div>
                </div>
            </div>
            {/* Change activeSchedule to activeSchedules.length > 0 */}
            {activeSchedules.length > 0 && (
                <div className="max-w-5xl mx-auto space-y-4">
                    <h4 className="text-xs sm:text-sm font-black uppercase text-slate-500 tracking-[0.2em] ml-4">
                        Active Automation Registry ({activeSchedules.length})
                    </h4>

                    {activeSchedules.map((schedule) => (
                        <div
                            key={schedule._id}
                            className="rounded-[2.5rem] p-8 border border-slate-900 shadow-2xl animate-in fade-in"
                        >
                            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-4 bg-white/15 rounded-2xl text-slate-900 border border-slate-900">
                                        <Activity size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-slate-900 font-black uppercase text-sm italic">
                                            {schedule.scheduleName || "UNNAMED AUDIT"}
                                        </h3>
                                        <p className="text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-widest mt-1">
                                            {schedule.frequency} — SYNCING {schedule.time} IST
                                        </p>
                                    </div>
                                </div>

                                <div className="flex-1 flex flex-wrap gap-2 px-10">
                                    {Object.entries(schedule.includeSections).map(([key, val]) => val && (
                                        <span key={key} className="bg-white/15 text-slate-900 text-[10px] font-black uppercase px-3 py-1.5 rounded-lg border border-slate-900">
                                            {key}
                                        </span>
                                    ))}
                                </div>

                                <button
                                    onClick={() => handleDelete(schedule._id)}
                                    className="flex items-center gap-2 bg-white/10 hover:bg-red-500 text-red-500 border border-red-500 hover:text-white px-6 py-3 rounded-xl text-xs sm:text-sm font-black uppercase transition-all"
                                >
                                    <Trash2 size={14} /> Terminate
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ScheduledReportingTab;