import React, { useState } from 'react';
import { 
  Search, Globe, Target, ArrowRight, ShieldAlert, 
  Info, Cpu, Zap, Loader2, CheckCircle2, Hash, ChevronDown, ChevronUp
} from 'lucide-react';
import API from "../../services/api";

const DiscoveryTab = () => {
    const [step, setStep] = useState(1); 
    const [domainInput, setDomainInput] = useState("");
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(false);
    
    const [expandedAssetId, setExpandedAssetId] = useState(null);
    const [assetServices, setAssetServices] = useState({}); 
    const [loadingServices, setLoadingServices] = useState(false);

    const [selectedAssets, setSelectedAssets] = useState([]);
    const [scanType, setScanType] = useState("soft");
    
    // --- UPDATED LOGIC: MATCHING BACKEND camelCase SCHEMA ---
    const [businessContext, setBusinessContext] = useState({
        assetCriticality: 3,
        confidentialityWeight: 5,
        integrityWeight: 5,
        availabilityWeight: 5,
        slaRequirement: 5,
        remediationDifficulty: 5,
        dependentServices: 0
    });

    const handleDiscover = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const domainRes = await API.post("/domains", { domainName: domainInput });
            const domainId = domainRes.data._id;
            await API.post(`/asset-discovery/${domainId}/discover`);
            const assetsRes = await API.get(`/asset-discovery/${domainId}/assets`);
            setAssets(assetsRes.data.assets);
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
                setAssetServices(prev => ({ ...prev, [assetId]: res.data }));
            } catch (err) {
                console.error("Failed to fetch services", err);
            } finally {
                setLoadingServices(false);
            }
        }
    };

    const toggleAsset = (id) => {
        setSelectedAssets(prev => 
            prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
        );
    };

    const handleStartScan = async () => {
        setLoading(true);
        try {
            const payload = {
                domainId: assets[0]?.domainId,
                scanType,
                // Passing the context exactly as the backend's computeEnvScore service expects
                assets: selectedAssets.map(id => ({
                    assetId: id,
                    business_context: businessContext
                }))
            };
            await API.post("/scan", payload);
            alert("Scan initiated successfully! The backend is now computing ML and Environmental scores.");
        } catch (err) {
            console.error("Scan trigger failed", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 pb-20 animate-in fade-in duration-500">
            {step === 1 ? (
                <div className="max-w-4xl mx-auto mt-20 text-center space-y-8">
                    <div className="space-y-2">
                        <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">ASSET DISCOVERY</h2>
                        <p className="text-slate-500 font-medium">Map infrastructure and configure business context for ML Scoring.</p>
                    </div>
                    <form onSubmit={handleDiscover} className="relative group max-w-2xl mx-auto">
                        <Globe className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 w-6 h-6 group-focus-within:text-amber-500 transition-colors" />
                        <input 
                            type="text" required value={domainInput} onChange={(e) => setDomainInput(e.target.value)}
                            placeholder="e.g. pnb.in"
                            className="w-full bg-white border-2 border-slate-100 rounded-full py-6 pl-16 pr-40 text-lg font-bold shadow-xl focus:outline-none focus:border-amber-400 transition-all"
                        />
                        <button type="submit" disabled={loading} className="absolute right-3 top-1/2 -translate-y-1/2 bg-slate-900 hover:bg-amber-400 text-white hover:text-amber-950 px-8 py-3.5 rounded-full font-black text-xs uppercase tracking-widest transition-all">
                            {loading ? <Loader2 className="animate-spin w-4 h-4" /> : "Start Mapping"}
                        </button>
                    </form>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Asset List */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                            <div className="px-8 py-6 border-b border-slate-50 flex justify-between bg-slate-50/50 uppercase tracking-widest font-black text-[10px] text-slate-400">
                                <span>Infrastructure Nodes ({assets.length})</span>
                                <button onClick={() => setSelectedAssets(assets.map(a => a._id))} className="text-amber-600 hover:underline">Select All</button>
                            </div>
                            <div className="max-h-[700px] overflow-y-auto">
                                <table className="w-full text-left">
                                    <tbody className="divide-y divide-slate-50">
                                        {assets.map((asset) => (
                                            <React.Fragment key={asset._id}>
                                                <tr className={`transition-colors ${selectedAssets.includes(asset._id) ? 'bg-amber-50/30' : 'hover:bg-slate-50'}`}>
                                                    <td className="px-8 py-4 w-10">
                                                        <div onClick={() => toggleAsset(asset._id)} className={`cursor-pointer w-5 h-5 rounded-md border-2 flex items-center justify-center ${selectedAssets.includes(asset._id) ? 'bg-amber-500 border-amber-500' : 'border-slate-200'}`}>
                                                            {selectedAssets.includes(asset._id) && <CheckCircle2 size={14} className="text-white" />}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <p className="text-sm font-black text-slate-800 tracking-tight">{asset.host}</p>
                                                        <p className="text-[10px] font-mono text-slate-400">{asset.ip}</p>
                                                    </td>
                                                    <td className="px-8 py-4 text-right">
                                                        <button onClick={() => toggleServices(asset._id)} className="text-[10px] font-black text-blue-500 uppercase flex items-center gap-1 ml-auto">
                                                            <Hash size={12} /> {expandedAssetId === asset._id ? 'Hide Ports' : 'Inspect Ports'}
                                                        </button>
                                                    </td>
                                                </tr>
                                                {expandedAssetId === asset._id && (
                                                    <tr className="bg-slate-50/80">
                                                        <td colSpan="3" className="px-16 py-6 border-l-4 border-blue-400">
                                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                                {loadingServices ? <Loader2 className="animate-spin text-blue-500" /> : assetServices[asset._id]?.map((svc, idx) => (
                                                                    <div key={idx} className="bg-white border border-slate-200 p-3 rounded-2xl shadow-sm"><span className="text-[9px] font-black text-slate-400 uppercase">{svc.protocolName}</span><p className="text-sm font-black text-slate-800">Port {svc.port}</p></div>
                                                                ))}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Right: ML Context Form with Backend-Matched Keys */}
                    <div className="space-y-6">
                        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl sticky top-28 overflow-hidden">
                            <Zap className="absolute -right-4 -top-4 w-24 h-24 text-amber-500/10" />
                            <h3 className="text-xl font-black mb-8 flex items-center gap-3 relative z-10">
                                <Target className="text-amber-400" /> Context Scoring
                            </h3>

                            <div className="space-y-6 relative z-10">
                                <div className="flex gap-2 p-1 bg-slate-800 rounded-2xl">
                                    {['soft', 'deep'].map(type => (
                                        <button key={type} onClick={() => setScanType(type)} className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${scanType === type ? 'bg-amber-500 text-amber-950' : 'text-slate-400'}`}>
                                            {type} Scan
                                        </button>
                                    ))}
                                </div>

                                {/* Criticality Select */}
                                <div className="space-y-3">
                                    <div className="flex justify-between text-[10px] font-black uppercase">
                                        <span className="text-slate-400">Asset Criticality</span>
                                        <span className="text-amber-400">Lv: {businessContext.assetCriticality}</span>
                                    </div>
                                    <select 
                                        value={businessContext.assetCriticality}
                                        onChange={(e) => setBusinessContext({...businessContext, assetCriticality: Number(e.target.value)})}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 px-4 text-xs font-bold outline-none focus:border-amber-500"
                                    >
                                        <option value={0}>Low (0)</option>
                                        <option value={3}>Medium (3)</option>
                                        <option value={6}>High (6)</option>
                                        <option value={9}>Critical (9)</option>
                                    </select>
                                </div>

                                {/* Environmental Weights Sliders */}
                                <div className="space-y-5 pt-4 border-t border-slate-800">
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Environmental Weights</span>
                                    
                                    {[
                                        { key: 'confidentialityWeight', label: 'Confidentiality' },
                                        { key: 'integrityWeight', label: 'Integrity' },
                                        { key: 'availabilityWeight', label: 'Availability' },
                                        { key: 'slaRequirement', label: 'SLA Requirement' },
                                        { key: 'remediationDifficulty', label: 'Patch Difficulty' }
                                    ].map(item => (
                                        <div key={item.key} className="space-y-2">
                                            <div className="flex justify-between text-[9px] font-bold text-slate-400 uppercase">
                                                <span>{item.label}</span>
                                                <span className="text-amber-400">{businessContext[item.key]}</span>
                                            </div>
                                            <input 
                                                type="range" min="0" max="10" 
                                                value={businessContext[item.key]}
                                                onChange={(e) => setBusinessContext({...businessContext, [item.key]: Number(e.target.value)})}
                                                className="w-full accent-amber-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                                            />
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-2 pt-4 border-t border-slate-800">
                                    <label className="text-[9px] font-bold text-slate-400 uppercase">Dependent Services</label>
                                    <input 
                                        type="number" min="0" 
                                        value={businessContext.dependentServices}
                                        onChange={(e) => setBusinessContext({...businessContext, dependentServices: Number(e.target.value)})}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 px-4 text-xs font-bold focus:border-amber-500 outline-none"
                                    />
                                </div>

                                <button 
                                    onClick={handleStartScan}
                                    disabled={selectedAssets.length === 0 || loading}
                                    className="w-full bg-amber-500 hover:bg-amber-400 text-amber-950 font-black py-5 rounded-2xl shadow-xl transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-3 disabled:opacity-50"
                                >
                                    {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
                                    Run Security Audit ({selectedAssets.length})
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DiscoveryTab;