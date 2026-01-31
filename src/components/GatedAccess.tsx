'use client';

import { useState, useEffect } from 'react';
import { Lock, Keyboard, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

const ACCESS_KEY = 'EIRteam22';
const STORAGE_KEY = 'eir-access-granted';

export default function GatedAccess({ children }: { children: React.ReactNode }) {
    const [accessGranted, setAccessGranted] = useState<boolean | null>(null);
    const [inputKey, setInputKey] = useState('');
    const [error, setError] = useState(false);
    const [shaking, setShaking] = useState(false);

    useEffect(() => {
        const isGranted = localStorage.getItem(STORAGE_KEY);
        setAccessGranted(isGranted === 'true');
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputKey === ACCESS_KEY) {
            localStorage.setItem(STORAGE_KEY, 'true');
            setAccessGranted(true);
        } else {
            setError(true);
            setShaking(true);
            setTimeout(() => setShaking(false), 500);
            setTimeout(() => setError(false), 3000);
        }
    };

    if (accessGranted === null) return null; // Prevent flicker during check

    if (accessGranted) {
        return <>{children}</>;
    }

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#020617] overflow-hidden">
            {/* Background Decorative Glows */}
            <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-amber-500/5 blur-[120px] rounded-full pointer-events-none" />

            <div className={`relative w-full max-w-lg px-6 transition-all duration-500 ${shaking ? 'animate-shake' : ''}`}>
                <div className="glass-panel border border-white/10 rounded-[40px] shadow-[0_0_50px_rgba(0,0,0,0.5)] p-10 flex flex-col items-center text-center overflow-hidden">
                    {/* Icon Header */}
                    <div className="relative mb-8">
                        <div className="absolute inset-0 bg-emerald-500/20 blur-3xl animate-pulse rounded-full" />
                        <div className="relative w-32 h-32 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center overflow-hidden p-1 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                            <img
                                src="/eir_logo.png"
                                alt="EIR Logo"
                                className="w-full h-full object-cover rounded-full filter drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                            />
                        </div>
                    </div>

                    {/* Text content */}
                    <h1 className="text-3xl font-display font-black text-white tracking-tight mb-4 leading-tight">
                        Acceso de <span className="text-emerald-500">Equipo</span>
                    </h1>

                    <p className="text-slate-400 text-sm font-medium leading-relaxed mb-10 max-w-[340px]">
                        Bienvenido a EIR: Tu buscador de repuestos de electromedicina, si has llegado hasta aquí es porque formas parte del equipo.
                        Para continuar por favor, introduce la clave que te ha facilitado Alex.
                    </p>

                    {/* Input Area */}
                    <form onSubmit={handleSubmit} className="w-full space-y-4">
                        <div className="relative group">
                            <div className={`absolute inset-0 rounded-2xl blur-lg transition-all duration-300 ${error ? 'bg-rose-500/20' : 'bg-emerald-500/10 group-focus-within:bg-emerald-500/20'}`} />
                            <div className="relative flex items-center">
                                <Lock className={`absolute left-4 w-5 h-5 transition-colors ${error ? 'text-rose-400' : 'text-slate-500 group-focus-within:text-emerald-400'}`} />
                                <input
                                    type="password"
                                    value={inputKey}
                                    onChange={(e) => setInputKey(e.target.value)}
                                    placeholder="Introduce la clave secreta..."
                                    className={`w-full bg-[#020617]/50 border py-5 pl-12 pr-6 rounded-2xl outline-none text-white font-medium transition-all placeholder:text-slate-600 ${error ? 'border-rose-500/50 text-rose-200' : 'border-white/5 focus:border-emerald-500/50'}`}
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="flex items-center justify-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-widest animate-in slide-in-from-top-1">
                                <AlertCircle className="w-4 h-4" />
                                Clave incorrecta, intenta de nuevo
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full relative group mt-4 py-5 rounded-2xl font-display font-black text-white transition-all active:scale-95 overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-emerald-400 group-hover:scale-110 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative flex items-center justify-center gap-3 text-sm tracking-widest uppercase">
                                Desbloquear Oráculo
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </button>
                    </form>

                    {/* Bottom detail */}
                    <div className="mt-10 flex items-center gap-3 opacity-40">
                        <div className="h-px w-12 bg-gradient-to-r from-transparent to-white/50" />
                        <img src="/eir_logo.png" alt="Eir" className="w-8 h-8 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
                        <div className="h-px w-12 bg-gradient-to-l from-transparent to-white/50" />
                    </div>
                </div>
            </div>

            <style jsx global>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-6px); }
                    20%, 40%, 60%, 80% { transform: translateX(6px); }
                }
                .animate-shake {
                    animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
                }
            `}</style>
        </div>
    );
}
