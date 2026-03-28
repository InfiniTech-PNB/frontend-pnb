import React from 'react';
import { Link } from 'react-router-dom';
import { 
    UserCog, CalendarClock, SearchCheck, ArrowRight, 
    FileText, ShieldCheck, Download, Activity 
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
            <div className="max-w-4xl mx-auto mt-12 text-center space-y-4">
                <div className="space-y-2">
                    <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">
                        Audit Reports Registry
                    </h2>
                    <p className="text-slate-500 font-medium">
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
                        className="group bg-white border-2 border-slate-100 rounded-[3rem] p-10 flex flex-col items-center text-center shadow-sm hover:shadow-2xl hover:border-orange-500 transition-all duration-300 hover:-translate-y-2"
                    >
                        {/* Dynamic Icon Container */}
                        <div className={`mb-8 w-24 h-24 rounded-[2rem] border-2 flex items-center justify-center transition-all duration-300 
                            ${section.color === 'blue' ? 'bg-blue-50 border-blue-100 text-blue-500 group-hover:bg-blue-500 group-hover:text-white' : 
                              section.color === 'orange' ? 'bg-orange-50 border-orange-100 text-orange-500 group-hover:bg-orange-500 group-hover:text-white' : 
                              'bg-cyan-50 border-cyan-100 text-cyan-500 group-hover:bg-cyan-500 group-hover:text-white'}`}
                        >
                            {section.icon}
                        </div>

                        <h3 className="text-xl font-black text-slate-900 uppercase italic leading-none mb-4">
                            {section.label}
                        </h3>
                        
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed mb-10 max-w-[200px]">
                            {section.description}
                        </p>

                        <div className="mt-auto p-4 bg-slate-900 text-white rounded-2xl group-hover:bg-orange-500 transition-all shadow-lg">
                            <ArrowRight size={18} />
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default ReportingRegistry;