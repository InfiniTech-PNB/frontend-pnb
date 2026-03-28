import React from 'react';
import { Outlet } from 'react-router-dom';

const ReportingTab = () => {
    return (
        // Added 'animate-in fade-in duration-500' for a professional feel
        <div className="min-h-screen animate-in fade-in duration-500">
            <Outlet /> 
        </div>
    );
};

export default ReportingTab;