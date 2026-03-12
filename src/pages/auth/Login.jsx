import React, { useState, useEffect } from 'react';
import { ShieldCheck, LogIn, Mail, Key, Cpu, Zap, Loader2, AlertCircle, ShieldEllipsis, RefreshCcw, ArrowLeft } from 'lucide-react';
import API from "../../services/api";
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [step, setStep] = useState(1); // 1: Login, 2: OTP
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [timer, setTimer] = useState(0);

    const { login } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        let interval = null;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            setError("Please fill in all fields");
            return;
        }

        try {
            setLoading(true);
            setError(null);
            await API.post("/auth/login", { email, password });

            // Success: Switch to OTP step and start timer
            setStep(2);
            setTimer(59);
        } catch (err) {
            setError(err.response?.data?.message || "Invalid credentials. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Handle Step 2: OTP Verification
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        if (!otp || otp.length < 6) {
            setError("Please enter a valid 6-digit code");
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const response = await API.post("/auth/verify-otp", { email, otp });

            login(response.data.token);
            navigate("/dashboard");
        } catch (err) {
            setError(err.response?.data?.message || "Invalid OTP. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        if (timer > 0 || loading) return;
        try {
            setLoading(true);
            setError(null);
            await API.post("/auth/login", { email, password });
            setTimer(59);
        } catch (err) {
            setError("Failed to resend OTP.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#f0f2f5] p-4 font-sans relative overflow-hidden">
            {/* BACKGROUND LAYERS */}
            <div className="absolute inset-0 z-0">
                <div className="absolute -bottom-24 -left-24 w-[600px] h-[600px] bg-amber-200/40 rounded-full blur-[120px]"></div>
                <div className="absolute -top-24 -right-24 w-[500px] h-[500px] bg-orange-100/50 rounded-full blur-[100px]"></div>
            </div>
            <div className="absolute inset-0 z-0 opacity-[0.08]"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23475569' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}>
            </div>

            {/* MAIN CONTAINER */}
            <div className="max-w-5xl w-full bg-white rounded-[3rem] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col md:flex-row border border-white/60 relative z-10">

                {/* Left Section: Info Panel */}
                <div className="w-full md:w-[45%] p-10 lg:p-14 flex flex-col justify-between bg-gradient-to-br from-yellow-400 via-amber-400 to-orange-500 text-amber-950 relative">
                    {/* Subtle circuit overlay */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none"
                        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 10h80v80h-80z' fill='none' stroke='%23000' stroke-width='0.5'/%3E%3C/svg%3E")` }}>
                    </div>

                    <div className="relative z-10 space-y-6">
                        {/* --- NEW LOGO STRIP (Matches the image) --- */}
                        <div className="bg-white/90 backdrop-blur-sm p-3 rounded-2xl flex items-center justify-between shadow-sm mb-8">
                            <img src="/dfs.png" alt="Govt Logo" className="h-10 w-auto object-contain" />
                            <div className="h-8 w-[1px] bg-slate-300 mx-2"></div>
                            <img src="/csh.jpg" alt="IITK Logo" className="h-10 w-auto object-contain" />
                            <div className="h-8 w-[1px] bg-slate-300 mx-2"></div>
                            <img src="/pnb.png" alt="PNB Logo" className="h-10 w-auto object-contain" />
                            <div className="h-8 w-[1px] bg-slate-300 mx-2"></div>
                            <img src="/iitk.png" alt="Partner Logo" className="h-10 w-auto object-contain" />
                        </div>
                        <div className="flex items-center gap-3 px-4 py-2 bg-white/30 backdrop-blur-md rounded-2xl w-fit border border-white/40 shadow-sm">
                            <Zap className="w-4 h-4 fill-amber-950" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                                2026 Hackathon
                            </span>
                        </div>

                        <div className="space-y-2">
                            <h1 className="text-5xl lg:text-6xl font-black leading-[1.1] tracking-tighter">
                                PSB<br />
                                <span className="text-white drop-shadow-md">
                                    Hackathon
                                </span> <br />
                                Series
                            </h1>
                            <div className="h-1.5 w-20 bg-amber-950/20 rounded-full overflow-hidden">
                                <div className="h-full bg-amber-950 w-full opacity-60"></div>
                            </div>
                        </div>

                        <p className="text-amber-900/90 text-lg font-medium leading-tight">
                            In collaboration with IIT Kanpur.
                        </p>
                    </div>

                    <div className="relative z-10 pt-8 flex items-center gap-4">
                        <div className="p-3 bg-amber-950 rounded-2xl shadow-lg">
                            <ShieldCheck className="w-6 h-6 text-yellow-400" />
                        </div>
                        <div className="text-sm">
                            <p className="font-black uppercase tracking-widest text-[10px] opacity-60">Status</p>
                            <p className="font-bold">System PQC-Ready</p>
                        </div>
                    </div>
                </div>

                {/* Right Section: Form Panel */}
                <div className="w-full md:w-[55%] p-10 lg:p-16 flex flex-col justify-center bg-white relative">
                    {/* Back Button for OTP Step */}
                    {step === 2 && (
                        <button
                            onClick={() => { setStep(1); setError(null); setOtp("") }}
                            className="absolute top-10 left-10 flex items-center gap-2 text-slate-400 hover:text-yellow-600 transition-colors font-bold text-xs uppercase tracking-widest"
                        >
                            <ArrowLeft className="w-4 h-4" /> Back
                        </button>
                    )}

                    <div className="mb-8">
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                            {step === 1 ? "Portal Login" : "Enter Code"}
                        </h2>
                        <p className="text-slate-500 mt-2 font-medium">
                            {step === 1 ? "Verify your credentials." : "Please check your inbox."}
                        </p>
                    </div>

                    <form onSubmit={step === 1 ? handleLogin : handleVerifyOtp} className="space-y-5">
                        {step === 1 ? (
                            <>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-5">Email</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5 group-focus-within:text-yellow-500 transition-colors duration-300" />
                                        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                                            className="w-full bg-slate-50 border-2 border-slate-100 rounded-[2rem] py-3.5 pl-14 pr-6 text-slate-800 focus:outline-none focus:border-yellow-400 focus:bg-white transition-all duration-300 font-bold"
                                            placeholder="Email" />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-5">Password</label>
                                    <div className="relative group">
                                        <Key className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5 group-focus-within:text-yellow-500 transition-colors duration-300" />
                                        <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                                            className="w-full bg-slate-50 border-2 border-slate-100 rounded-[2rem] py-3.5 pl-14 pr-6 text-slate-800 focus:outline-none focus:border-yellow-400 focus:bg-white transition-all duration-300 font-bold"
                                            placeholder="••••••••" />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-5">Security OTP</label>
                                <div className="relative group">
                                    <ShieldEllipsis className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5 group-focus-within:text-yellow-500 transition-colors duration-300" />
                                    <input type="text" required maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value)}
                                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-[2rem] py-4 pl-14 pr-6 text-slate-800 focus:outline-none focus:border-yellow-400 focus:bg-white transition-all duration-300 font-bold tracking-[0.5em] text-center text-xl"
                                        placeholder="000000" />
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="bg-red-50 border border-red-100 rounded-xl p-3 flex items-center gap-3 text-red-600 animate-in fade-in slide-in-from-top-1">
                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                <p className="text-[11px] font-bold leading-tight">{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-slate-900 hover:bg-yellow-400 hover:text-amber-950 text-white font-black py-4 rounded-[2rem] shadow-xl shadow-slate-200 active:scale-95 disabled:opacity-70 disabled:pointer-events-none transition-all duration-300 flex items-center justify-center gap-3 group"
                        >
                            <span className="uppercase tracking-[0.2em] text-xs">
                                {loading ? "Processing..." : step === 1 ? "Send OTP" : "Verify & Signin"}
                            </span>
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                        </button>
                    </form>

                    {step === 2 && (
                        <div className="mt-8 flex flex-col items-center">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 text-center">
                                Code not arrived?
                            </p>
                            <button
                                onClick={handleResendOtp}
                                disabled={timer > 0 || loading}
                                className={`flex items-center gap-2 text-[11px] font-black uppercase tracking-widest transition-all ${timer > 0 ? 'text-slate-300 cursor-not-allowed' : 'text-yellow-600 hover:text-amber-700 underline'}`}
                            >
                                <RefreshCcw className={`w-3 h-3 ${loading && step === 2 && timer === 0 && 'animate-spin'}`} />
                                {timer > 0 ? `Resend in 00:${timer < 10 ? `0${timer}` : timer}` : "Resend Security Code"}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Login;