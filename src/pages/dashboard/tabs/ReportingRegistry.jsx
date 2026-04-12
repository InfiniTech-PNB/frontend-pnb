import React from 'react';
import { Link } from 'react-router-dom';
import {
    UserCog, CalendarClock, SearchCheck, ArrowRight
} from 'lucide-react';

const ReportingRegistry = () => {
    const reportSections = [
        { 
            id: 'executive', 
            label: 'Executives Reporting', 
            path: 'executive', 
            icon: <UserCog size={32} />, 
            description: 'Strategic PQC migration status and high-level risk overview.',
            color: 'blue' 
        },
        { 
            id: 'scheduled', 
            label: 'Scheduled Reporting', 
            path: 'scheduled', 
            icon: <CalendarClock size={32} />, 
            description: 'Automated compliance and audit trails, delivered periodicity.',
            color: 'orange' 
        },
        { 
            id: 'ondemand', 
            label: 'On-Demand Reporting', 
            path: 'ondemand', 
            icon: <SearchCheck size={32} />, 
            description: 'Custom deep-dive reports for specific assets or vulnerabilities.',
            color: 'cyan' 
        }
    ];

    return (
        <div className="space-y-10 pb-20 animate-in fade-in duration-500">
            
            {/* --- HEADER SECTION --- */}
            <div className=" mx-auto mt-8 text-center space-y-4">
                <div className="p-6 lg:p-8">
                    <p className="editorial-label mb-3" style={{ color: 'var(--tertiary)' }}>Reporting Operations</p>
                    <h2 className="editorial-title text-2xl lg:text-4xl uppercase leading-tight">Audit Reports Registry</h2>
                    <p className="mt-4 w-full text-slate-600 text-base lg:text-xl  leading-relaxed">
                        Access strategic insights, automated compliance logs, and custom infrastructure audits.
                    </p>
                </div>
            </div>

            {/* --- PRIMARY NAVIGATION CARDS --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {reportSections.map((section) => (
                    <Link 
                        to={section.path} 
                        key={section.id}
                        className="group editorial-shell border-2 border-slate-100 rounded-[2.5rem] p-8 lg:p-10 flex flex-col items-center text-center shadow-sm hover:shadow-2xl hover:border-orange-500 transition-all duration-300 hover:-translate-y-2 min-h-[340px]"
                    >
                        {/* Dynamic Icon Container */}
                        <div className={`mb-8 w-24 h-24 rounded-4xl border-2 flex items-center justify-center transition-all duration-300 
                            ${section.color === 'blue' ? 'bg-blue-50 border-blue-100 text-blue-500 group-hover:bg-blue-500 group-hover:text-white' : 
                              section.color === 'orange' ? 'bg-orange-50 border-orange-100 text-orange-500 group-hover:bg-orange-500 group-hover:text-white' : 
                              'bg-cyan-50 border-cyan-100 text-cyan-500 group-hover:bg-cyan-500 group-hover:text-white'}`}
                        >
                            {section.icon}
                        </div>

                        <h3 className="text-2xl font-black text-slate-900 uppercase italic leading-tight mb-4">
                            {section.label}
                        </h3>
                        
                        <p className="text-sm md:text-base font-semibold text-slate-500 leading-relaxed mb-10 max-w-[240px]">
                            {section.description}
                        </p>

                        <div className="mt-auto p-4 bg-slate-90 rounded-2xl transition-all border border-slate-300 flex items-center gap-2">
                            <ArrowRight size={18} />
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default ReportingRegistry;