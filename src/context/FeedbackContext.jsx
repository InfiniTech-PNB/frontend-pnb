import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';
import { createPortal } from 'react-dom';

const FeedbackContext = createContext(null);

export const FeedbackProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);
    const [dialog, setDialog] = useState(null); // { message, onConfirm, onCancel }
    const [selectedOption, setSelectedOption] = useState(null);

    // --- Toast Logic ---
    const showToast = useCallback((message, type = 'success', duration = 3000) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, duration);
    }, []);

    // --- Dialog Logic ---
    const showConfirm = useCallback((message) => {
        return new Promise((resolve) => {
            setDialog({
                title: "Authority Confirmation Required",
                message,
                onConfirm: () => {
                    setDialog(null);
                    resolve(true);
                },
                onCancel: () => {
                    setDialog(null);
                    resolve(false);
                }
            });
        });
    }, []);

    const showModeSelection = useCallback((message) => {
        return new Promise((resolve) => {
            setDialog({
                title: "CBOM Generation Strategy",
                message,
                options: [
                    { id: 'per_asset', label: 'Per-Asset CBOM', description: 'Individual reports for every node.' },
                    { id: 'aggregate', label: 'Aggregate Portfolio', description: 'Unified cryptographic inventory.' }
                ],
                onSelect: (mode) => {
                    setSelectedOption(null);
                    setDialog(null);
                    resolve(mode);
                },
                onCancel: () => {
                    setSelectedOption(null);
                    setDialog(null);
                    resolve(null);
                }
            });
        });
    }, []);

    return (
        <FeedbackContext.Provider value={{ showToast, showConfirm, showModeSelection }}>
            {children}
            
            {/* Toast Portal */}
            {createPortal(
                <div className="fixed bottom-6 right-6 z-[10000] flex flex-col gap-3 pointer-events-none">
                    {toasts.map(toast => (
                        <div 
                            key={toast.id}
                            className={`
                                pointer-events-auto flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border animate-in slide-in-from-right-10 duration-300
                                ${toast.type === 'success' ? 'bg-emerald-900 border-emerald-800 text-emerald-50' : 
                                  toast.type === 'error' ? 'bg-rose-900 border-rose-800 text-rose-50' : 
                                  'bg-slate-900 border-slate-800 text-slate-50'}
                            `}
                        >
                            {toast.type === 'success' && <CheckCircle2 className="text-emerald-400" size={18} />}
                            {toast.type === 'error' && <XCircle className="text-rose-400" size={18} />}
                            {toast.type === 'info' && <Info className="text-blue-400" size={18} />}
                            <span className="text-sm font-black uppercase tracking-tight italic">{toast.message}</span>
                            <button 
                                onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                                className="ml-2 hover:opacity-70 transition-opacity"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    ))}
                </div>, 
                document.body
            )}

            {/* Dialog Portal */}
            {dialog && createPortal(
                <div className="fixed inset-0 z-[10001] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-[3rem] p-10 max-w-md w-full shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
                        <div className="flex flex-col items-center text-center">
                            <div className="p-5 bg-orange-50 rounded-[2rem] text-orange-500 mb-6">
                                <AlertTriangle size={32} />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic mb-4 leading-tight">
                                {dialog.title || "Confirmation Required"}
                            </h3>
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest leading-relaxed mb-6">
                                {dialog.message}
                            </p>

                            {dialog.options ? (
                                <div className="space-y-6 w-full mb-4">
                                    <div className="grid grid-cols-1 gap-4 w-full">
                                        {dialog.options.map(opt => {
                                            const isSelected = selectedOption === opt.id;
                                            return (
                                                <button
                                                    key={opt.id}
                                                    onClick={() => setSelectedOption(opt.id)}
                                                    className={`w-full text-left p-6 rounded-[2rem] border-2 transition-all group ${
                                                        isSelected 
                                                            ? 'bg-slate-900 border-slate-900 shadow-xl scale-[1.02]' 
                                                            : 'bg-white border-slate-100 hover:border-slate-300 hover:bg-slate-50'
                                                    }`}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <p className={`text-sm font-black uppercase transition-colors ${isSelected ? 'text-white' : 'text-slate-900'}`}>{opt.label}</p>
                                                            <p className={`text-[10px] font-bold uppercase tracking-tighter mt-1 ${isSelected ? 'text-slate-400' : 'text-slate-500'}`}>{opt.description}</p>
                                                        </div>
                                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${isSelected ? 'border-white bg-white/20' : 'border-slate-300'}`}>
                                                            {isSelected && <div className="w-3 h-3 rounded-full bg-white" />}
                                                        </div>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 w-full mt-4">
                                        <button
                                            onClick={dialog.onCancel}
                                            className="py-4 rounded-2xl border-2 border-slate-100 text-slate-400 font-black uppercase text-xs tracking-[0.2em] hover:bg-slate-50 transition-all"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={() => selectedOption && dialog.onSelect(selectedOption)}
                                            disabled={!selectedOption}
                                            className={`py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] transition-all shadow-lg ${
                                                selectedOption 
                                                    ? 'bg-orange-500 text-white hover:bg-orange-600 active:scale-95' 
                                                    : 'bg-slate-100 text-slate-400 cursor-not-allowed opacity-50'
                                            }`}
                                        >
                                            Continue
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-2 gap-4 w-full mt-4">
                                        <button
                                            onClick={dialog.onCancel}
                                            className="py-4 rounded-2xl border-2 border-slate-100 text-slate-400 font-black uppercase text-xs tracking-[0.2em] hover:bg-slate-50 transition-all"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={dialog.onConfirm}
                                            className="py-4 rounded-2xl bg-slate-900 text-white font-black uppercase text-xs tracking-[0.2em] hover:bg-orange-600 transition-all shadow-lg active:scale-95"
                                        >
                                            Proceed
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </FeedbackContext.Provider>
    );
};

export const useFeedback = () => {
    const context = useContext(FeedbackContext);
    if (!context) throw new Error('useFeedback must be used within a FeedbackProvider');
    return context;
};
