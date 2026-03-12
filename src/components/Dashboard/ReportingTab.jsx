import React, { useState } from 'react';
import {
    FilePieChart, CalendarClock, Search,
    ArrowLeft, ChevronRight, Mail,
    FolderDown, Bell, Send, Download,
    CheckSquare, ToggleLeft, ToggleRight, Zap, ShieldCheck 
} from 'lucide-react';

const ReportingTab = () => {
    const [reportView, setReportView] = useState('landing'); // landing, scheduled, on-demand, executive

    // Shared Data for forms
    const reportTypes = ["Executive Summary Report", "Assets Discovery", "Assets Inventory", "CBOM", "Posture of PQC", "Cyber Rating"];
    const sections = ["Discovery", "Inventory", "CBOM", "PQC Posture", "Cyber Rating"];

    // --- SUB-COMPONENT: LANDING VIEW (First Image) ---
    const LandingView = () => (
        <div className="flex flex-col items-center justify-center min-h-[500px] animate-in fade-in zoom-in-95 duration-700">
            <div className="text-center mb-12">
                <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Reporting Hub</h3>
                <p className="text-slate-500 font-medium">Select a reporting method to generate or schedule security audits.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl w-full px-6">
                {[
                    { id: 'executive', title: 'Executives Reporting', icon: FilePieChart, desc: 'High-level security posture' },
                    { id: 'scheduled', title: 'Scheduled Reporting', icon: CalendarClock, desc: 'Automated periodic audits' },
                    { id: 'on-demand', title: 'On-Demand Reporting', icon: Search, desc: 'Instant granular reports' },
                ].map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setReportView(item.id)}
                        className="group flex flex-col items-center gap-6 p-10 rounded-[4rem] bg-white border border-slate-100 shadow-xl hover:shadow-2xl hover:border-amber-400 transition-all active:scale-95"
                    >
                        <div className="p-8 rounded-full bg-amber-50 group-hover:bg-amber-400 transition-colors">
                            <item.icon className="w-12 h-12 text-amber-600 group-hover:text-amber-950" />
                        </div>
                        <div className="text-center">
                            <h4 className="font-black text-slate-800 uppercase tracking-widest text-sm mb-2">{item.title}</h4>
                            <p className="text-xs text-slate-400 font-medium">{item.desc}</p>
                        </div>
                        <ChevronRight className="text-slate-200 group-hover:text-amber-500 group-hover:translate-x-2 transition-all" />
                    </button>
                ))}
            </div>
        </div>
    );

    // --- SUB-COMPONENT: SCHEDULED REPORTING (Second Image) ---
    const ScheduledView = () => (
        <div className="max-w-4xl mx-auto bg-white rounded-[3rem] border border-slate-100 shadow-2xl overflow-hidden animate-in slide-in-from-right-10 duration-500">
            <div className="bg-amber-500 p-8 flex justify-between items-center text-amber-950">
                <div className="flex items-center gap-4">
                    <CalendarClock size={32} />
                    <h3 className="text-2xl font-black uppercase tracking-tight">Schedule Reporting</h3>
                </div>
                <div className="flex items-center gap-3 bg-white/20 px-4 py-2 rounded-full">
                    <span className="text-[10px] font-black uppercase">Enable Schedule</span>
                    <ToggleRight className="cursor-pointer" />
                </div>
            </div>

            <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Left Side: Configuration */}
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Report Type</label>
                        <select className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 text-sm font-bold text-slate-700 outline-none focus:border-amber-500">
                            {reportTypes.map(t => <option key={t}>{t}</option>)}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Frequency</label>
                        <select className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 text-sm font-bold text-slate-700 outline-none focus:border-amber-500">
                            <option>Weekly</option><option>Monthly</option><option>Daily</option>
                        </select>
                    </div>
                    <div className="pt-4">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-4">Include Sections</p>
                        <div className="grid grid-cols-2 gap-3">
                            {sections.map(s => (
                                <div key={s} className="flex items-center gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                                    <CheckSquare size={14} className="text-amber-500" />
                                    <span className="text-[10px] font-black text-slate-600 uppercase">{s}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Side: Details & Delivery */}
                <div className="space-y-6 border-l border-slate-100 pl-10">
                    <div className="space-y-4">
                        <h5 className="text-[10px] font-black text-amber-600 uppercase tracking-widest flex items-center gap-2"><CalendarClock size={14} /> Schedule Details</h5>
                        <input type="date" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs font-bold" />
                        <input type="time" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs font-bold" />
                    </div>
                    <div className="space-y-4 pt-4 border-t border-slate-50">
                        <h5 className="text-[10px] font-black text-amber-600 uppercase tracking-widest flex items-center gap-2"><Send size={14} /> Delivery Options</h5>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
                                <span className="flex items-center gap-2"><Mail size={14} /> Email</span>
                                <span className="text-slate-400 italic">executives@org.com</span>
                            </div>
                            <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
                                <span className="flex items-center gap-2"><FolderDown size={14} /> Save to Location</span>
                                <span className="text-slate-400 italic">/Reports/Quarterly/</span>
                            </div>
                        </div>
                    </div>
                    <button className="w-full bg-amber-500 text-amber-950 font-black py-4 rounded-2xl shadow-xl shadow-amber-100 hover:bg-amber-400 transition-all uppercase tracking-widest text-xs mt-6">
                        Schedule Report →
                    </button>
                </div>
            </div>
        </div>
    );

    // --- SUB-COMPONENT: ON-DEMAND (Third Image) ---
    const OnDemandView = () => (
        <div className="max-w-4xl mx-auto bg-white rounded-[3rem] border border-slate-100 shadow-2xl p-10 animate-in slide-in-from-left-10 duration-500">
            <div className="flex items-center gap-4 mb-10">
                <div className="p-4 bg-amber-100 rounded-3xl text-amber-600"><Search size={32} /></div>
                <div>
                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">On-Demand Reporting</h3>
                    <p className="text-slate-400 text-sm font-medium">Request reports as needed for immediate analysis.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Report Type</label>
                    <div className="space-y-2">
                        {reportTypes.map(t => (
                            <div key={t} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-amber-50 cursor-pointer transition-colors border border-transparent hover:border-amber-200">
                                <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                                <span className="text-xs font-bold text-slate-700">{t}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="space-y-8 bg-slate-50/50 p-8 rounded-[2rem] border border-slate-100">
                    <div className="space-y-4">
                        <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Delivery Channel</h5>
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-600">Send via Email</span>
                            <ToggleRight className="text-amber-500" />
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-600">Slack Notification</span>
                            <ToggleLeft className="text-slate-300" />
                        </div>
                    </div>
                    <button className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl shadow-xl hover:bg-amber-500 hover:text-amber-950 transition-all uppercase tracking-widest text-xs">
                        Generate Report Now
                    </button>
                </div>
            </div>
        </div>
    );

    // --- SUB-COMPONENT: EXECUTIVE VIEW (Fourth Image) ---
    const ExecutiveView = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in zoom-in-95 duration-700">
            {[
                { title: 'Assets Discovery', val: '212,450', sub: 'domains, IPs & subdomains', icon: Search },
                { title: 'Cyber Rating', val: 'Tier 1', sub: 'Status: Excellent', icon: Zap },
                { title: 'Assets Inventory', val: '8761', sub: 'SSL Certificates', icon: CheckSquare },
                { title: 'PQC Posture', val: '33%', sub: 'Migration Progress', icon: ShieldCheck },
            ].map((card, i) => (
                <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-lg hover:shadow-2xl transition-all">
                    <div className="flex items-center justify-between mb-6">
                        <div className="p-3 bg-amber-50 rounded-2xl text-amber-500"><card.icon size={20} /></div>
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{card.title}</h4>
                    </div>
                    <h2 className="text-4xl font-black text-slate-900 mb-1">{card.val}</h2>
                    <p className="text-xs font-medium text-slate-500">{card.sub}</p>
                </div>
            ))}
        </div>
    );

    return (
        <div className="pb-10">
            {/* Back Navigation */}
            {reportView !== 'landing' && (
                <button
                    onClick={() => setReportView('landing')}
                    className="mb-8 flex items-center gap-2 text-slate-400 hover:text-amber-600 font-black text-xs uppercase tracking-widest transition-colors"
                >
                    <ArrowLeft size={16} /> Back to Hub
                </button>
            )}

            {/* Dynamic View Rendering */}
            {reportView === 'landing' && <LandingView />}
            {reportView === 'scheduled' && <ScheduledView />}
            {reportView === 'on-demand' && <OnDemandView />}
            {reportView === 'executive' && <ExecutiveView />}
        </div>
    );
};

export default ReportingTab;