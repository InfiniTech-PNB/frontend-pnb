import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Mail, ArrowRight, ArrowLeft, ShieldCheck, Database, FileCode, Activity, Trash2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import API from "../../../services/api";

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
        if (window.confirm("Are you sure you want to stop this automated report?")) {
            try {
                // 1. Send the delete request to the backend
                await API.delete(`/reports/schedule/${id}`);

                // 2. THE FIX: Update the local state immediately
                // We keep only the schedules that DO NOT match the ID we just deleted
                setActiveSchedules((prevSchedules) =>
                    prevSchedules.filter(schedule => schedule._id !== id)
                );

                alert("Automation halted and removed from registry.");
            } catch (err) {
                console.error("Delete failed:", err);
                alert("Could not delete the schedule. Please try again.");
            }
        }
    };

    const handleSave = async () => {
        if (!formData.scheduleName.trim()) {
            alert("Please provide a name for this schedule (e.g., Weekly Project Sync).");
            return;
        }
        setLoading(true);
        try {
            await API.post("/reports/schedule", { ...formData, isEnabled: enabled });

            // ✅ Change 1: Force a fresh object to clear the inputs
            setFormData({ ...DEFAULT_FORM_STATE });
            setEnabled(true);

            // ✅ Change 2: Optional - If you want the form to stay empty even 
            // if there's an active schedule, you don't call fetchCurrentSchedule here.
            // But if you want to see the new schedule in the dark card below, keep it:
            fetchCurrentSchedule();

            alert("Schedule saved and form reset to defaults.");
        } catch (err) {
            console.error("Save failed:", err);
            alert("Error saving schedule.");
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
                <Link to="/dashboard/reporting" className="flex items-center gap-2 text-slate-400 hover:text-orange-500 transition-colors text-xs font-black uppercase tracking-widest">
                    <ArrowLeft size={16} /> Back to Registry
                </Link>
            </div>

            <div className="max-w-5xl mx-auto bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden">
                {/* Header */}
                <div className="p-10 bg-white border-b border-slate-50 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="p-4 bg-slate-900 rounded-2xl text-orange-500">
                            <Calendar size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 uppercase italic leading-none tracking-tighter">Report Scheduler</h2>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Automate extraction from Assets & Scan Results</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl">
                        <span className="text-[10px] font-black uppercase text-slate-500">Enable Automation</span>
                        <button onClick={() => setEnabled(!enabled)} className={`w-12 h-6 rounded-full transition-all relative ${enabled ? 'bg-orange-500' : 'bg-slate-300'}`}>
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${enabled ? 'left-7' : 'left-1'}`} />
                        </button>
                    </div>
                </div>

                <div className="p-12 grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Module Selection */}
                    <div className="space-y-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">
                                Schedule Identifier / Audit Name
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. Q2 COMPLIANCE SUMMARY"
                                value={formData.scheduleName}
                                onChange={(e) => setFormData({ ...formData, scheduleName: e.target.value.toUpperCase() })}
                                className="w-full p-4 bg-orange-50/30 border-2 border-orange-100 rounded-2xl font-black text-xs placeholder:text-slate-300 focus:border-orange-500 outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Integrated Project Modules</label>
                            <div className="space-y-3">
                                {modules.map(mod => (
                                    <div key={mod.id} className="flex items-center justify-between bg-white border-2 border-slate-100 p-5 rounded-[2rem] hover:border-orange-200 transition-all">
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

                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Domain Scope</label>
                            <select
                                value={formData.targetDomainId}
                                onChange={(e) => setFormData({ ...formData, targetDomainId: e.target.value })}
                                className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-black text-xs uppercase"
                            >
                                <option value="all">Consolidated Audit</option>
                                {domains.map(d => <option key={d._id} value={d._id}>{d.domainName}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Timeline & Submit */}
                    <div className="space-y-10">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Frequency</label>
                                <select
                                    value={formData.frequency}
                                    onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                                    className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-black text-xs uppercase"
                                >
                                    <option>Daily</option>
                                    <option>Weekly</option>
                                    <option>Monthly</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Schedule Time</label>
                                <input
                                    type="time"
                                    value={formData.time}
                                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                    className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-black text-xs"
                                />
                            </div>
                        </div>

                        <div className="bg-[#0f172a] p-10 rounded-[2.5rem] text-white space-y-6 relative overflow-hidden">
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 text-orange-500 mb-6">
                                    <Mail size={20} />
                                    <h4 className="font-black uppercase text-xs italic">Email Delivery Delivery</h4>
                                </div>

                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="recipient@org.com"
                                    className="w-full bg-slate-800 border border-slate-700 p-4 rounded-xl text-xs font-bold text-white outline-none focus:border-orange-500 mb-6"
                                />

                                <button
                                    onClick={handleSave}
                                    disabled={loading}
                                    className="w-full bg-orange-500 hover:bg-orange-600 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 transition-all"
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
                    <h4 className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em] ml-4">
                        Active Automation Registry ({activeSchedules.length})
                    </h4>

                    {activeSchedules.map((schedule) => (
                        <div key={schedule._id} className="bg-[#0f172a] rounded-[2.5rem] p-8 border border-slate-800 shadow-2xl animate-in fade-in">
                            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-4 bg-orange-500/10 rounded-2xl text-orange-500 border border-orange-500/20">
                                        <Activity size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-black uppercase text-sm italic">
                                            {schedule.scheduleName || "UNNAMED AUDIT"}
                                        </h3>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                                            {schedule.frequency} — SYNCING {schedule.time} IST
                                        </p>
                                    </div>
                                </div>

                                <div className="flex-1 flex flex-wrap gap-2 px-10">
                                    {Object.entries(schedule.includeSections).map(([key, val]) => val && (
                                        <span key={key} className="bg-slate-800 text-slate-400 text-[8px] font-black uppercase px-3 py-1.5 rounded-lg border border-slate-700">
                                            {key}
                                        </span>
                                    ))}
                                </div>

                                <button
                                    onClick={() => handleDelete(schedule._id)}
                                    className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase transition-all border border-red-500/20"
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