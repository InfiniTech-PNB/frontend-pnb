import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, X, Bot, User, Loader2, Minimize2 } from 'lucide-react';
import API from "../../services/api";

const SecurityChatbot = ({ scanId }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef(null);

    // 1. Load chat history when scanId changes or chat opens
    useEffect(() => {
        if (scanId && isOpen) {
            fetchChatHistory();
        }
    }, [scanId, isOpen]);

    // Auto-scroll to bottom
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const fetchChatHistory = async () => {
        try {
            const res = await API.get(`/chatbot/${scanId}`);
            // Map backend Chat model to local state
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

    if (!isOpen) return (
        <button 
            onClick={() => setIsOpen(true)}
            className="fixed bottom-8 right-8 bg-slate-900 text-amber-500 p-4 rounded-full shadow-2xl hover:scale-110 transition-all border border-amber-500/20 z-50"
        >
            <MessageSquare size={24} />
        </button>
    );

    return (
        <div className="fixed bottom-8 right-8 w-96 h-[500px] bg-white border border-slate-200 rounded-[2rem] shadow-2xl flex flex-col overflow-hidden z-50 animate-in slide-in-from-bottom-4 duration-300">
            {/* Header */}
            <div className="bg-slate-900 p-4 flex justify-between items-center text-white">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500">
                        <Bot size={20} />
                    </div>
                    <div>
                        <h4 className="text-xs font-black uppercase tracking-widest">PQC Analyst</h4>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">Scan ID: {scanId?.substring(0,8)}</p>
                    </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                    <Minimize2 size={18} />
                </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
                {messages.length === 0 && (
                    <div className="text-center py-10 space-y-2 opacity-50">
                        <Bot size={32} className="mx-auto text-slate-300" />
                        <p className="text-[10px] font-black uppercase text-slate-400">Ask me about your TLS vulnerabilities</p>
                    </div>
                )}
                
                {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-3 rounded-2xl text-xs font-medium leading-relaxed shadow-sm ${
                            msg.role === 'user' 
                            ? 'bg-slate-900 text-white rounded-tr-none' 
                            : 'bg-white border border-slate-100 text-slate-700 rounded-tl-none'
                        }`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                
                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-white border border-slate-100 p-3 rounded-2xl rounded-tl-none">
                            <Loader2 className="animate-spin text-amber-500" size={16} />
                        </div>
                    </div>
                )}
                <div ref={scrollRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-100 flex gap-2">
                <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about crypto risks..."
                    className="flex-1 bg-slate-50 border-none rounded-xl px-4 py-2 text-xs font-bold outline-none focus:ring-1 ring-amber-500/50 transition-all"
                />
                <button 
                    disabled={loading || !scanId}
                    type="submit" 
                    className="bg-slate-900 text-white p-2 rounded-xl hover:bg-amber-500 transition-colors disabled:opacity-30"
                >
                    <Send size={18} />
                </button>
            </form>
        </div>
    );
};

export default SecurityChatbot;