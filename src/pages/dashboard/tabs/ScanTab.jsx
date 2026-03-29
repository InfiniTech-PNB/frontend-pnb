import React, { useState } from 'react';
import {
    Globe, Target, ShieldAlert, Zap, Loader2,
    CheckCircle2, Hash, Settings2, Shield, Server,
    Activity, Cpu, Lock, Info
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from "../../../services/api";

const ScanTab = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [domainInput, setDomainInput] = useState("");
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(false);

    const [selectedAssets, setSelectedAssets] = useState([]);
    const [scanType, setScanType] = useState("soft");

    // Technical Discovery State
    const [expandedAssetId, setExpandedAssetId] = useState(null);
    const [assetServices, setAssetServices] = useState({});
    const [loadingServices, setLoadingServices] = useState(false);

    // Business Context State
    const [assetContexts, setAssetContexts] = useState({});
    const [searchTerm, setSearchTerm] = useState("");

    const handleDiscover = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const domainRes = await API.post("/domains", { domainName: domainInput });
            const domainId = domainRes.data._id;
            await API.post(`/asset-discovery/${domainId}/discover`);
            const assetsRes = await API.get(`/asset-discovery/${domainId}/assets`);

            const fetchedAssets = assetsRes.data.assets;
            setAssets(fetchedAssets);

            const initialContexts = {};
            fetchedAssets.forEach(a => {
                initialContexts[a._id] = {
                    assetCriticality: 5,
                    confidentialityWeight: 5,
                    integrityWeight: 5,
                    availabilityWeight: 5,
                    slaRequirement: 5,
                    dependentServices: 0
                };
            });
            setAssetContexts(initialContexts);
            setStep(2);
        } catch (err) {
            console.error("Discovery failed", err);
        } finally {
            setLoading(false);
        }
    };

    const toggleServices = async (assetId) => {
        if (expandedAssetId === assetId) {
            setExpandedAssetId(null);
            return;
        }
        setExpandedAssetId(assetId);
        if (!assetServices[assetId]) {
            setLoadingServices(true);
            try {
                const res = await API.get(`/services/${assetId}/services`);
                const serviceData = Array.isArray(res.data) ? res.data : (res.data.services || []);
                setAssetServices(prev => ({ ...prev, [assetId]: serviceData }));
            } catch (err) {
                console.error("Failed to fetch services", err);
            } finally {
                setLoadingServices(false);
            }
        }
    };

    const updateAssetContext = (assetId, key, value) => {
        setAssetContexts(prev => ({
            ...prev,
            [assetId]: { ...prev[assetId], [key]: value }
        }));
    };

    const handleStartScan = async () => {
        setLoading(true);
        try {
            const payload = {
                domainId: assets[0]?.domainId,
                scanType,
                assets: selectedAssets.map(id => ({
                    assetId: id,
                    businessContext: assetContexts[id]
                }))
            };
            const res = await API.post("/scan", payload);
            // Navigate to results page with the scan ID
            navigate('/dashboard/results', { state: { activeScanId: res.data.scanId } });
        } catch (err) {
            console.error("Scan trigger failed", err);
        } finally {
            setLoading(false);
        }
    };

    const filteredAssets = assets.filter(asset =>
        asset.host?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.ip?.includes(searchTerm)
    );

    return (
        <div className="space-y-6 pb-20 animate-in fade-in duration-500">
            {step === 1 ? (
                <div className="max-w-4xl mx-auto mt-20 text-center space-y-8">
                    <div className="space-y-2">
                        <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">Infrastructure Mapping</h2>
                        <p className="text-slate-500 font-medium">Identify {domainInput || 'domain'} assets and verify technical services.</p>
                    </div>
                    <form onSubmit={handleDiscover} className="relative group max-w-2xl mx-auto">
                        <Globe className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 w-6 h-6 group-focus-within:text-orange-500 transition-colors" />
                        <input
                            type="text" required value={domainInput} onChange={(e) => setDomainInput(e.target.value)}
                            placeholder="e.g. internal-admin.net"
                            className="w-full bg-white border-2 border-slate-100 rounded-3xl py-6 pl-16 pr-40 text-lg font-bold shadow-2xl focus:outline-none focus:border-orange-400 transition-all"
                        />
                        <button type="submit" disabled={loading} className="absolute right-3 top-1/2 -translate-y-1/2 bg-slate-900 hover:bg-orange-500 text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all">
                            {loading ? <Loader2 className="animate-spin w-4 h-4" /> : "Discover"}
                        </button>
                    </form>
                </div>
            ) : (
                <div className="flex flex-col gap-8">
                    {/* Control Bar */}
                    <div className="bg-[#0f172a] p-6 rounded-[2.5rem] text-white shadow-xl flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-slate-800 rounded-2xl text-orange-500"><Settings2 size={24} /></div>
                            <div>
                                <h3 className="font-black uppercase text-sm leading-none">Scan Engine</h3>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-1">Audit Mode: {scanType}</p>
                            </div>
                        </div>

                        <div className="flex bg-slate-800 p-1.5 rounded-2xl border border-slate-700">
                            {['soft', 'deep'].map(type => (
                                <button key={type} onClick={() => setScanType(type)} className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${scanType === type ? 'bg-orange-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>
                                    {type}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={handleStartScan}
                            disabled={selectedAssets.length === 0 || loading}
                            className="bg-white hover:bg-orange-500 text-slate-900 hover:text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 transition-all disabled:opacity-20"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <Shield size={16} />}
                            Finalize & Run Audit
                        </button>
                    </div>

                    {/* Search and Selection Summary */}
                    <div className="flex flex-col md:flex-row justify-between items-end gap-4 px-4">
                        <div className="relative w-full md:w-96">
                            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search by host or IP..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-12 pr-4 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                            />
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            Showing {filteredAssets.length} of {assets.length} Assets — <span className="text-orange-500">{selectedAssets.length} Selected</span>
                        </p>
                    </div>

                    {/* Assets Inventory */}
                    <div className="grid grid-cols-1 gap-6">
                        {filteredAssets.map((asset) => (
                            <div key={asset._id} className={`bg-white border-2 rounded-[3rem] p-8 transition-all flex flex-col xl:flex-row gap-8 ${selectedAssets.includes(asset._id) ? 'border-orange-500 shadow-xl' : 'border-slate-100 shadow-sm'}`}>

                                {/* Asset Header */}
                                <div className="xl:w-1/4 space-y-4">
                                    <div className="flex items-start gap-4">
                                        <div onClick={() => setSelectedAssets(prev => prev.includes(asset._id) ? prev.filter(a => a !== asset._id) : [...prev, asset._id])} className={`cursor-pointer w-7 h-7 rounded-xl border-2 flex items-center justify-center flex-shrink-0 transition-all ${selectedAssets.includes(asset._id) ? 'bg-orange-500 border-orange-500 shadow-lg' : 'border-slate-200'}`}>
                                            {selectedAssets.includes(asset._id) && <CheckCircle2 size={18} className="text-white" />}
                                        </div>
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className="font-black text-slate-900 text-lg leading-none">{asset.host}</p>
                                                <span className="bg-slate-100 text-slate-500 text-[8px] px-1.5 py-0.5 rounded font-black uppercase">{asset.assetType}</span>
                                            </div>
                                            <p className="text-xs font-mono text-slate-400 font-bold mt-1">{asset.ip}</p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => toggleServices(asset._id)}
                                        className="w-full bg-slate-50 hover:bg-slate-100 py-3 rounded-2xl text-[9px] font-black uppercase text-slate-500 flex items-center justify-center gap-2 transition-all"
                                    >
                                        <Server size={12} /> {expandedAssetId === asset._id ? 'Close Inspection' : 'Inspect Services'}
                                    </button>

                                    {expandedAssetId === asset._id && (
                                        <div className="grid grid-cols-2 gap-2 animate-in slide-in-from-top-2 duration-300">
                                            {loadingServices ? <Loader2 className="animate-spin text-orange-500 mx-auto" /> : assetServices[asset._id]?.map((svc, idx) => (
                                                <div key={idx} className="bg-orange-50/50 border border-orange-100 p-2 rounded-xl">
                                                    <p className="text-[8px] font-black text-orange-600 uppercase leading-none">{svc.protocolName}</p>
                                                    <p className="text-xs font-black text-slate-800">:{svc.port}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Environmental CIA Configuration */}
                                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6 bg-slate-50/50 p-8 rounded-[2.5rem]">
                                    {[
                                        { key: 'confidentialityWeight', label: 'Confidentiality', icon: <Lock size={12} />, description: 'Measures how sensitive the data is and the impact if it is exposed to unauthorized users' },
                                        { key: 'integrityWeight', label: 'Integrity', icon: <Activity size={12} />, description: 'Measures the importance of keeping data accurate, consistent, and free from unauthorized modifications' },
                                        { key: 'availabilityWeight', label: 'Availability', icon: <Zap size={12} />, description: 'Measures how critical it is for the system or data to be accessible without interruptions when needed' },
                                        { key: 'assetCriticality', label: 'Criticality', icon: <Shield size={12} />, description: 'Represents the overall importance of the asset to business operations and the impact if it fails' },
                                        { key: 'slaRequirement', label: 'SLA Priority', icon: <Cpu size={12} />, description: 'Defines the required uptime, performance, and response commitments based on service level agreements' },
                                        { key: 'dependentServices', label: 'Node Dependencies', icon: <Hash size={12} />, description: 'Indicates how many other systems or services rely on this asset, reflecting its role in the infrastructure' }
                                    ].map(item => (
                                        <div key={item.key} className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-[9px] font-black text-slate-700 uppercase tracking-widest flex items-center gap-1 group relative cursor-help">
                                                    {item.icon} {item.label}
                                                    <Info size={10} className="text-slate-500 group-hover:text-orange-500 transition-colors" />
                                                    <span className="hidden group-hover:block absolute bottom-full left-0 mb-2 w-48 p-2 bg-slate-900 text-white text-[8px] font-bold rounded-lg shadow-xl z-50 normal-case leading-tight pointer-events-none">
                                                        {item.description}
                                                    </span>
                                                </span>
                                                <span className="bg-white border border-slate-200 text-orange-500 text-[10px] font-black px-2 py-0.5 rounded-lg shadow-sm">
                                                    {assetContexts[asset._id][item.key]}
                                                </span>
                                            </div>
                                            <input
                                                type="range" min="0" max="10"
                                                disabled={!selectedAssets.includes(asset._id)}
                                                value={assetContexts[asset._id][item.key]}
                                                onChange={(e) => updateAssetContext(asset._id, item.key, Number(e.target.value))}
                                                className={`w-full h-1.5 rounded-lg appearance-none cursor-pointer transition-all ${selectedAssets.includes(asset._id)
                                                    ? 'accent-orange-500 bg-slate-200'
                                                    : 'accent-slate-300 bg-slate-100 opacity-30'
                                                    }`}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                        {filteredAssets.length === 0 && (
                            <div className="text-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                                <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">No assets match your search</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ScanTab;