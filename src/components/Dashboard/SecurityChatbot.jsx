import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, Bot, Minimize2 } from 'lucide-react';
import API from "../../services/api";
import SkeletonBlock from '../ui/SkeletonBlock';

const SecurityChatbot = ({ scanId }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scanId && isOpen) {
            fetchChatHistory();
        }
    }, [scanId, isOpen]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const fetchChatHistory = async () => {
        try {
            const res = await API.get(`/chatbot/${scanId}`);
            const history = res.data.flatMap(chat => [
                { role: 'user', text: chat.question },
                { role: 'bot', text: chat.answer }
            ]);
            setMessages(history);
        } catch (err) {
            console.error("Failed to load history", err);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim() || !scanId) return;

        const userMsg = input;
        setInput("");
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setLoading(true);

        try {
            const res = await API.post("/chatbot/chat", { scanId, question: userMsg });
            setMessages(prev => [...prev, { role: 'bot', text: res.data.answer }]);
        } catch (err) {
            setMessages(prev => [...prev, { role: 'bot', text: "Error: Could not reach the security analyst." }]);
        } finally {
            setLoading(false);
        }
    };

    // --- Parsing Logic for New Format ---
    const renderBotMessage = (text) => {
        // Regex to split by the new headers
        const sections = text.split(/(Answer:|Key Findings:|Technical Reasoning:|PQC Assessment:|Risk Evaluation:|Recommendations:)/g);
        
        return (
            <div className="space-y-3">
                {sections.map((part, index) => {
                    const trimmed = part.trim();
                    if (!trimmed) return null;

                    // Header Styling
                    const headerMap = {
                        "Answer:": { label: "Direct Answer", color: "text-amber-600" },
                        "Key Findings:": { label: "Key Findings", color: "text-blue-600" },
                        "Technical Reasoning:": { label: "Technical Reasoning", color: "text-slate-500" },
                        "PQC Assessment:": { label: "PQC Assessment", color: "text-purple-600" },
                        "Risk Evaluation:": { label: "Risk Evaluation", color: "text-red-600" },
                        "Recommendations:": { label: "Strategic Steps", color: "text-emerald-600" }
                    };

                    if (headerMap[trimmed]) {
                        return (
                            <div key={index} className={`text-[10px] font-black uppercase tracking-tighter mt-3 first:mt-0 ${headerMap[trimmed].color}`}>
                                {headerMap[trimmed].label}
                            </div>
                        );
                    }

                    // Content Styling (Bullet points and standard text)
                    const isContentAfterHeader = index > 0 && headerMap[sections[index - 1].trim()];
                    
                    return (
                        <div key={index} className={`text-xs leading-relaxed ${isContentAfterHeader ? 'text-slate-700 font-medium' : 'text-slate-500'}`}>
                            {trimmed.split('\n').map((line, lIdx) => (
                                <p key={lIdx} className={line.startsWith('-') ? "ml-2 pl-2 border-l-2 border-slate-100 my-1" : "mb-1"}>
                                    {line}
                                </p>
                            ))}
                        </div>
                    );
                })}
            </div>
        );
    };

    if (!isOpen) return (
        <button onClick={() => setIsOpen(true)} className="fixed bottom-8 right-8 bg-slate-900 text-amber-500 p-4 rounded-full shadow-2xl hover:scale-110 transition-all border border-amber-500/20 z-50">
            <MessageSquare size={24} />
        </button>
    );

    return (
        <div className="fixed bottom-8 right-8 w-96 h-[550px] bg-white border border-slate-200 rounded-[2rem] shadow-2xl flex flex-col overflow-hidden z-50 animate-in slide-in-from-bottom-4 duration-300">
            <div className="bg-slate-900 p-4 flex justify-between items-center text-white">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500"><Bot size={20} /></div>
                    <div>
                        <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">PQC Analyst v2</h4>
                        <p className="text-[9px] text-slate-400 font-bold">Scan: {scanId?.substring(0, 8)}</p>
                    </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white"><Minimize2 size={18} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50/50">
                {messages.length === 0 && (
                    <div className="text-center py-10 opacity-50">
                        <Bot size={32} className="mx-auto text-slate-300 mb-2" />
                        <p className="text-[10px] font-black uppercase text-slate-400">System Ready for Cryptographic Analysis</p>
                    </div>
                )}

                {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[92%] p-4 rounded-2xl shadow-sm ${
                            msg.role === 'user' 
                            ? 'bg-slate-900  rounded-tr-none text-xs font-medium' 
                            : 'bg-white border border-slate-100 rounded-tl-none'
                        }`}>
                            {msg.role === 'user' ? msg.text : renderBotMessage(msg.text)}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-white border border-slate-100 p-3 rounded-2xl rounded-tl-none w-48 space-y-2">
                            <SkeletonBlock className="h-3 w-36" />
                            <SkeletonBlock className="h-3 w-28" />
                        </div>
                    </div>
                )}
                <div ref={scrollRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-100 flex gap-2">
                <input
                    type="text" value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about PQC readiness..."
                    className="flex-1 bg-slate-200 border-none rounded-xl px-4 py-2 text-xs font-bold text-slate-900 outline-none focus:ring-1 ring-amber-500/50"
                />
                <button disabled={loading || !scanId} type="submit" className="bg-slate-900 text-slate-500 p-2 rounded-xl hover:bg-amber-500 transition-colors disabled:opacity-30">
                    <Send size={18} />
                </button>
            </form>
        </div>
    );
};

export default SecurityChatbot;