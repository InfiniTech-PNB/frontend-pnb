import React, { useState } from 'react';
import {
    Globe, Lock, Server, Cpu,
    Search, Filter, Download, ExternalLink,
    Calendar, Building2, Tag
} from 'lucide-react';

const InventoryTab = () => {
    // Main Category State
    const [activeCategory, setActiveCategory] = useState('Domains');
    // Sub-filter State (New, False Positive, etc.)
    const [subFilter, setSubFilter] = useState('All');

    const categories = [
        { name: 'Domains', count: 20, icon: Globe },
        { name: 'SSL', count: 5, icon: Lock },
        { name: 'IP Address/Subnets', count: 34, icon: Server },
        { name: 'Software', count: 52, icon: Cpu },
    ];

    const subFilters = [
        { name: 'New', count: 5 },
        { name: 'False Positive', count: 10 },
        { name: 'Confirmed', count: 2 },
        { name: 'All', count: 3 },
    ];

    const domainData = [
        { date: "03 Mar 2026", name: "www.cos.pnb.bank.in", regDate: "17 Feb 2005", registrar: "National Internet Exchange of India", company: "PNB" },
        { date: "17 Oct 2024", name: "www2.pnbrrbkiosk.in", regDate: "22 Mar 2021", registrar: "National Internet Exchange of India", company: "PNB" },
        { date: "17 Oct 2024", name: "upload.pnbuniv.net.in", regDate: "22 Mar 2021", registrar: "National Internet Exchange of India", company: "PNB" },
        { date: "17 Oct 2024", name: "postman.pnb.bank.in", regDate: "22 Mar 2021", registrar: "National Internet Exchange of India", company: "PNB" },
        { date: "17 Nov 2024", name: "proxy.pnb.bank.in", regDate: "22 Mar 2021", registrar: "National Internet Exchange of India", company: "PNB" },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-10">

            {/* --- TOP CATEGORY SELECTOR --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {categories.map((cat) => (
                    <button
                        key={cat.name}
                        onClick={() => setActiveCategory(cat.name)}
                        className={`p-6 rounded-[2rem] border-2 transition-all text-left relative overflow-hidden group ${activeCategory === cat.name
                                ? 'bg-white border-amber-400 shadow-xl shadow-amber-500/10'
                                : 'bg-white border-transparent hover:border-slate-200 shadow-sm'
                            }`}
                    >
                        <div className={`p-3 rounded-2xl w-fit mb-4 transition-colors ${activeCategory === cat.name ? 'bg-amber-400 text-amber-950' : 'bg-slate-100 text-slate-400'}`}>
                            <cat.icon className="w-6 h-6" />
                        </div>
                        <p className={`text-[10px] font-black uppercase tracking-widest ${activeCategory === cat.name ? 'text-amber-600' : 'text-slate-400'}`}>
                            {cat.name}
                        </p>
                        <h3 className="text-3xl font-black text-slate-900 tracking-tighter">
                            {cat.count} <span className="text-sm font-bold text-slate-300 ml-1">Assets</span>
                        </h3>
                    </button>
                ))}
            </div>

            {/* --- SUB-FILTER TABS --- */}
            <div className="flex flex-wrap items-center gap-3">
                {subFilters.map((filter) => (
                    <button
                        key={filter.name}
                        onClick={() => setSubFilter(filter.name)}
                        className={`px-6 py-2 rounded-full text-[11px] font-black uppercase tracking-widest transition-all border-2 ${subFilter === filter.name
                                ? 'bg-slate-900 text-white border-slate-900 shadow-lg'
                                : 'bg-white text-slate-400 border-slate-100 hover:border-slate-200'
                            }`}
                    >
                        {filter.name} ({filter.count})
                    </button>
                ))}

                <div className="ml-auto flex gap-2">
                    <button className="p-2 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-amber-500 transition-colors">
                        <Download size={18} />
                    </button>
                    <button className="p-2 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-amber-500 transition-colors">
                        <Filter size={18} />
                    </button>
                </div>
            </div>

            {/* --- DATA TABLE CONTAINER --- */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                        <Tag className="w-4 h-4 text-amber-500" /> Detected {activeCategory}
                    </h4>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search Assets..."
                            className="bg-white border border-slate-100 rounded-full py-2 pl-10 pr-4 text-xs focus:outline-none focus:ring-2 focus:ring-amber-400/20 w-64 font-medium"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Detection Date</th>
                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Domain Name</th>
                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Registration Date</th>
                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Registrar</th>
                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Company</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {domainData.map((row, i) => (
                                <tr key={i} className="group hover:bg-amber-50/30 transition-colors">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-2 text-slate-500">
                                            <Calendar size={14} className="text-slate-300" />
                                            <span className="text-xs font-bold">{row.date}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-black text-slate-800 tracking-tight group-hover:text-amber-600 transition-colors">
                                                {row.name}
                                            </span>
                                            <ExternalLink size={12} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-xs text-slate-500 font-medium">{row.regDate}</td>
                                    <td className="px-8 py-5">
                                        <span className="text-xs text-slate-500 leading-relaxed max-w-[200px] block">
                                            {row.registrar}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-lg w-fit">
                                            <Building2 size={12} className="text-slate-400" />
                                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-tighter">{row.company}</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Footer Pagination Placeholder */}
                <div className="px-8 py-4 bg-slate-50/30 border-t border-slate-50 flex justify-between items-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Showing 5 of 20 Assets</p>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 bg-white border border-slate-200 rounded text-[10px] font-bold text-slate-400 disabled:opacity-50">Prev</button>
                        <button className="px-3 py-1 bg-white border border-slate-200 rounded text-[10px] font-bold text-slate-600">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InventoryTab;