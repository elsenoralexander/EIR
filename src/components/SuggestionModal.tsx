'use client';

import { useState, useEffect } from 'react';
import { X, Send, Sparkles, MessageSquare, Loader2 } from 'lucide-react';
import { saveSuggestion } from '@/actions/suggestionActions';

export default function SuggestionModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [suggestion, setSuggestion] = useState('');
    const [isSent, setIsSent] = useState(false);

    useEffect(() => {
        const handleOpen = () => setIsOpen(true);
        window.addEventListener('open-suggestions', handleOpen);
        return () => window.removeEventListener('open-suggestions', handleOpen);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!suggestion.trim()) return;

        // In a real app, save to Firestore. For now, we'll simulate it.
        console.log('Suggestion submitted:', suggestion);
        setIsSent(true);

        // Reset after 3 seconds
        setTimeout(() => {
            setIsOpen(false);
            setIsSent(false);
            setSuggestion('');
        }, 3000);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-[#020617]/95 backdrop-blur-2xl animate-in fade-in duration-300">
            <div className="glass-panel border-2 border-amber-500/20 rounded-[40px] p-8 max-w-md w-full shadow-[0_0_100px_rgba(245,158,11,0.1)] relative animate-in zoom-in-95 duration-300">
                <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 border border-white/10 text-slate-500 hover:text-white transition"
                >
                    <X className="w-5 h-5" />
                </button>

                {!isSent ? (
                    <div className="space-y-8 mt-2">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full border border-amber-500/30 overflow-hidden bg-[#020617] p-1 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                                <img src="/eir_not_found.jpg" alt="EIR Goddess" className="w-full h-full object-cover rounded-full" />
                            </div>
                            <div>
                                <h3 className="text-xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-emerald-400 tracking-tight leading-tight">
                                    CONSEJO DEL ORÁCULO
                                </h3>
                                <p className="text-[10px] text-emerald-500/40 font-black uppercase tracking-[0.2em]">Mejora la Biblioteca EIR</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <p className="text-sm text-slate-400 font-medium leading-relaxed">
                                "¿Qué nuevas funciones o mejoras te gustaría ver en esta plataforma? Tus ideas son la luz que guía mi evolución."
                            </p>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="relative">
                                    <MessageSquare className="absolute left-4 top-4 w-4 h-4 text-emerald-500/30" />
                                    <textarea
                                        autoFocus
                                        value={suggestion}
                                        onChange={(e) => setSuggestion(e.target.value)}
                                        placeholder="Escribe tu sugerencia aquí..."
                                        className="w-full h-32 pl-12 pr-6 py-4 rounded-3xl bg-white/5 border border-white/10 text-sm font-medium focus:border-amber-500/50 outline-none transition-all resize-none text-white placeholder:text-slate-700"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full py-4 bg-gradient-to-r from-amber-500 to-emerald-500 hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] text-white font-display font-black rounded-2xl transition-all uppercase tracking-[0.2em] text-[10px] active:scale-95 flex items-center justify-center gap-2"
                                >
                                    <Send className="w-4 h-4" />
                                    Enviar Sugerencia
                                </button>
                            </form>
                        </div>
                    </div>
                ) : (
                    <div className="py-12 flex flex-col items-center text-center space-y-6 animate-in fade-in duration-500">
                        <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 animate-bounce">
                            <Sparkles className="w-10 h-10" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-display font-black text-white">¡RECIBIDO!</h3>
                            <p className="text-sm text-slate-400">Tus palabras han sido grabadas en los anales del Oráculo. Gracias por ayudarme a crecer.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
