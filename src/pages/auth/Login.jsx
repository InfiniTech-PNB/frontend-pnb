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
            console.log("OTP Verification Response:", response.data);

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
        <div className="relative flex min-h-screen items-center justify-center overflow-x-hidden px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -left-24 top-1/2 h-[28rem] w-[28rem] -translate-y-1/2 rounded-full bg-blue-200/40 blur-3xl" />
                <div className="absolute -right-20 top-12 h-[26rem] w-[26rem] rounded-full bg-amber-200/35 blur-3xl" />
                <div className="absolute bottom-0 left-1/2 h-64 w-[38rem] -translate-x-1/2 rounded-full bg-slate-200/40 blur-3xl" />
            </div>

            <div className="relative z-10 mx-auto w-full max-w-6xl editorial-shell overflow-hidden rounded-[2rem] lg:rounded-[2.4rem]">
                <div className="grid lg:grid-cols-[1.12fr_1fr]">

                    <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-br from-slate-900 via-blue-900 to-blue-700 p-8 text-white sm:p-10 lg:border-b-0 lg:border-r lg:border-slate-700/50 lg:p-12">
                        <div
                            className="absolute inset-0 opacity-[0.18]"
                            style={{
                                backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.28) 1px, transparent 0)",
                                backgroundSize: '26px 26px'
                            }}
                        />

                        <div className="relative z-10 flex h-full flex-col justify-between gap-10">
                            <div className="space-y-7">
                                <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 backdrop-blur-sm">
                                    <Zap className="h-4 w-4 text-amber-200" />
                                    <span className="font-label text-[11px] font-bold uppercase tracking-[0.17em] text-white/90">Secure Access 2026</span>
                                </div>

                                <div className="space-y-4">
                                    <p className="editorial-label text-[11px] tracking-[0.22em] text-blue-100">PNB Quantum Security Program</p>
                                    <h1 className="editorial-title text-4xl leading-[1.05] text-white sm:text-5xl lg:text-6xl">
                                        Enter The
                                        <br />
                                        Risk Intelligence
                                        <br />
                                        Portal
                                    </h1>
                                    <p className="max-w-lg text-base font-medium leading-relaxed text-blue-50/90">
                                        Authenticate with your domain credentials and OTP to access cryptographic readiness insights.
                                    </p>
                                </div>

                                <div className="grid gap-3 sm:grid-cols-2">
                                    <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
                                        <p className="font-label text-[11px] text-blue-100">Security Mode</p>
                                        <p className="mt-2 text-lg font-bold text-white">Two-Factor Enabled</p>
                                    </div>
                                    <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
                                        <p className="font-label text-[11px] text-blue-100">Status</p>
                                        <div className="mt-2 flex items-center gap-2">
                                            <ShieldCheck className="h-5 w-5 text-emerald-300" />
                                            <p className="text-lg font-bold text-white">PQC-Ready</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 rounded-2xl border border-white/15 bg-white/5 p-3 backdrop-blur-sm sm:grid-cols-4">
                                <img src="/dfs.png" alt="Govt Logo" className="h-10 w-full rounded-xl bg-white/90 p-1.5 object-contain" />
                                <img src="/csh.jpg" alt="IITK Logo" className="h-10 w-full rounded-xl bg-white/90 p-1.5 object-contain" />
                                <img src="/pnb.png" alt="PNB Logo" className="h-10 w-full rounded-xl bg-white/90 p-1.5 object-contain" />
                                <img src="/iitk.png" alt="Partner Logo" className="h-10 w-full rounded-xl bg-white/90 p-1.5 object-contain" />
                            </div>
                        </div>
                    </section>

                    <section className="relative bg-white p-8 sm:p-10 lg:p-12">
                        {step === 2 && (
                            <button
                                onClick={() => { setStep(1); setError(null); setOtp(""); }}
                                className="mb-7 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-slate-500 transition-colors hover:border-blue-200 hover:text-blue-700"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Back To Credentials
                            </button>
                        )}

                        <div className="mb-8">
                            <div className="mb-5 flex items-center gap-3">
                                <div className={`h-2.5 w-2.5 rounded-full ${step === 1 ? 'bg-blue-600' : 'bg-slate-300'}`} />
                                <div className={`h-2.5 w-2.5 rounded-full ${step === 2 ? 'bg-blue-600' : 'bg-slate-300'}`} />
                                <span className="ml-2 font-label text-[11px] text-slate-500">Step {step} Of 2</span>
                            </div>

                            <h2 className="editorial-title text-3xl leading-tight text-slate-900 sm:text-4xl">
                                {step === 1 ? 'Portal Login' : 'Verify Security Code'}
                            </h2>
                            <p className="mt-3 text-base font-medium text-slate-500">
                                {step === 1
                                    ? 'Use your registered email and password to request OTP.'
                                    : `Enter the 6-digit OTP sent to ${email || 'your inbox'}.`}
                            </p>
                        </div>

                        <form onSubmit={step === 1 ? handleLogin : handleVerifyOtp} className="space-y-5">
                            {step === 1 ? (
                                <>
                                    <div className="space-y-2">
                                        <label className="font-label text-xs font-bold text-slate-500">Email Address</label>
                                        <div className="group relative">
                                            <Mail className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-300 transition-colors group-focus-within:text-blue-600" />
                                            <input
                                                type="email"
                                                required
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 pl-14 pr-5 text-base font-semibold text-slate-800 outline-none transition-all focus:border-blue-400 focus:bg-white focus:shadow-[0_0_0_4px_rgba(9,76,178,0.12)]"
                                                placeholder="name@company.com"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="font-label text-xs font-bold text-slate-500">Password</label>
                                        <div className="group relative">
                                            <Key className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-300 transition-colors group-focus-within:text-blue-600" />
                                            <input
                                                type="password"
                                                required
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 pl-14 pr-5 text-base font-semibold text-slate-800 outline-none transition-all focus:border-blue-400 focus:bg-white focus:shadow-[0_0_0_4px_rgba(9,76,178,0.12)]"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="space-y-2">
                                    <label className="font-label text-xs font-bold text-slate-500">Security OTP</label>
                                    <div className="group relative">
                                        <ShieldEllipsis className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-300 transition-colors group-focus-within:text-blue-600" />
                                        <input
                                            type="text"
                                            required
                                            maxLength={6}
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 pl-14 pr-5 text-center text-2xl font-black tracking-[0.35em] text-slate-800 outline-none transition-all focus:border-blue-400 focus:bg-white focus:shadow-[0_0_0_4px_rgba(9,76,178,0.12)]"
                                            placeholder="000000"
                                        />
                                    </div>
                                </div>
                            )}

                            {error && (
                                <div className="animate-in fade-in slide-in-from-top-1 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
                                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                                    <p className="text-sm font-bold leading-tight">{error}</p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-[var(--primary)] py-4 text-sm font-black uppercase tracking-[0.18em] text-white shadow-[0_20px_30px_-20px_rgba(9,76,178,0.8)] transition-all hover:bg-[var(--primary-soft)] active:scale-[0.99] disabled:pointer-events-none disabled:opacity-70"
                            >
                                <span>{loading ? 'Processing...' : step === 1 ? 'Send OTP' : 'Verify And Sign In'}</span>
                                {loading ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <LogIn className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                )}
                            </button>
                        </form>

                        {step === 2 && (
                            <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
                                <p className="font-label text-[11px] text-slate-500">Code Not Arrived?</p>
                                <button
                                    onClick={handleResendOtp}
                                    disabled={timer > 0 || loading}
                                    className={`mt-2 inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.12em] transition-colors ${timer > 0 ? 'cursor-not-allowed text-slate-400' : 'text-blue-700 hover:text-blue-800'}`}
                                >
                                    <RefreshCcw className={`h-3.5 w-3.5 ${loading && step === 2 && timer === 0 ? 'animate-spin' : ''}`} />
                                    {timer > 0 ? `Resend In 00:${timer < 10 ? `0${timer}` : timer}` : 'Resend Security Code'}
                                </button>
                            </div>
                        )}

                        <div className="mt-8 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                            <div className="rounded-xl bg-emerald-100 p-2">
                                <Cpu className="h-4 w-4 text-emerald-700" />
                            </div>
                            <div>
                                <p className="font-label text-[11px] text-slate-500">Security Posture</p>
                                <p className="text-sm font-bold text-slate-700">Quantum resilience checks are active for this session.</p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Login;