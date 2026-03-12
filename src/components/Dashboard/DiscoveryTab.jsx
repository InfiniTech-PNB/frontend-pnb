import React, { useState } from 'react';
import {
    Search,
    Calendar,
    Clock,
    Target,
    History,
    ArrowRight,
    ShieldCheck,
    Globe,
    Database,
    Fingerprint
} from 'lucide-react';

const DiscoveryTab = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const quickSearchShortcuts = [
        { label: "Domains", icon: Globe },
        { label: "Endpoints", icon: Target },
        { label: "IoC Patterns", icon: Fingerprint },
        { label: "IP Ranges", icon: Database },
    ];

    return (
        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-700 pb-10">

            {/* --- HEADER --- */}
            <div className="flex flex-col gap-2">
                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                    <Search className="text-amber-500" /> Infrastructure Discovery
                </h3>
                <p className="text-slate-500 font-medium">Identify new assets, subdomains, and potential Indicators of Compromise (IoC).</p>
            </div>

            {/* --- MAIN SEARCH AREA (Based on Image Reference) --- */}
            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl overflow-hidden relative">
                {/* Glow accent */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-100/40 rounded-full blur-[80px] -mr-32 -mt-32"></div>

                <div className="p-8 lg:p-12 relative z-10">
                    <form className="space-y-10" onSubmit={(e) => e.preventDefault()}>

                        {/* 1. Large Search Bar */}
                        <div className="space-y-3">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-6">Target Parameters</label>
                            <div className="relative group">
                                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 w-6 h-6 group-focus-within:text-amber-500 transition-colors" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search domain, URL, contact, IoC or other..."
                                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-full py-6 pl-16 pr-8 text-lg font-bold text-slate-800 focus:outline-none focus:border-amber-400 focus:bg-white focus:ring-8 focus:ring-amber-400/5 transition-all shadow-inner"
                                />
                            </div>
                        </div>

                        {/* 2. Time Period Selection (As per Image) */}
                        <div className="bg-slate-50/50 border border-slate-100 rounded-[2.5rem] p-8 space-y-6">
                            <div className="flex items-center gap-3 mb-2">
                                <Calendar className="text-amber-600 w-5 h-5" />
                                <h4 className="text-sm font-black text-slate-700 uppercase tracking-widest">Time Period</h4>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Start Date</span>
                                    <div className="relative">
                                        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-4 h-4" />
                                        <input
                                            type="date"
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                            className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-12 pr-4 text-sm font-bold text-slate-700 focus:outline-none focus:border-amber-400 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">End Date</span>
                                    <div className="relative">
                                        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-4 h-4" />
                                        <input
                                            type="date"
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                            className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-12 pr-4 text-sm font-bold text-slate-700 focus:outline-none focus:border-amber-400 transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 flex items-center gap-2 text-[10px] font-bold text-slate-400 italic">
                                <ShieldCheck size={14} className="text-emerald-500" />
                                Specify the period to analyze historical data or live discovery cycles.
                            </div>
                        </div>

                        {/* 3. Action Button */}
                        <div className="flex justify-center">
                            <button className="bg-slate-900 hover:bg-amber-400 text-white hover:text-amber-950 font-black py-5 px-16 rounded-full shadow-2xl transition-all flex items-center gap-4 group uppercase tracking-widest text-sm active:scale-95">
                                Initialize Discovery
                                <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* --- QUICK LINKS / HISTORY --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {quickSearchShortcuts.map((item, i) => (
                        <button key={i} className="bg-white p-6 rounded-3xl border border-slate-100 hover:border-amber-200 hover:shadow-lg transition-all text-center space-y-3 group">
                            <div className="bg-slate-50 p-3 rounded-2xl w-fit mx-auto group-hover:bg-amber-50 transition-colors">
                                <item.icon className="text-slate-400 group-hover:text-amber-500 w-6 h-6" />
                            </div>
                            <p className="text-xs font-black text-slate-600 uppercase tracking-widest">{item.label}</p>
                        </button>
                    ))}
                </div>

                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <History className="w-4 h-4" /> Recent Scans
                        </h4>
                        <button className="text-[10px] font-black text-amber-600">Clear</button>
                    </div>
                    <div className="space-y-3">
                        <div className="text-[10px] font-bold text-slate-700 p-2 bg-slate-50 rounded-lg truncate">discovery_cycle_09_03.json</div>
                        <div className="text-[10px] font-bold text-slate-700 p-2 bg-slate-50 rounded-lg truncate">pnb_subdomain_enumeration</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DiscoveryTab;