import AddPartForm from '@/components/AddPartForm';
import { Package } from 'lucide-react';

export default function AdminAddPage() {
    return (
        <div className="min-h-screen bg-[#020617] overflow-y-auto selection:bg-emerald-500/30">
            {/* Background Decorative Glows - Increased intensity */}
            <div className="fixed top-0 left-0 w-[600px] h-[600px] bg-emerald-500/15 blur-[140px] rounded-full pointer-events-none z-0" />
            <div className="fixed bottom-0 right-0 w-[600px] h-[600px] bg-amber-500/10 blur-[140px] rounded-full pointer-events-none z-0" />
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/5 blur-[160px] rounded-full pointer-events-none z-0" />

            <header className="glass-panel border-b border-white/10 p-4 sm:p-8 flex items-center justify-center shrink-0 mb-6 sm:mb-12 relative z-10 backdrop-blur-xl">
                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-emerald-500/30 blur-2xl rounded-full group-hover:bg-emerald-500/50 transition-all duration-500 animate-pulse" />
                        <div className="relative w-14 h-14 bg-emerald-500/10 border border-emerald-500/30 rounded-full p-1 shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all duration-500 group-hover:scale-110">
                            <img src="/eir_logo.png" alt="Eir" className="w-full h-full object-cover rounded-full" />
                        </div>
                    </div>
                    <div>
                        <h1 className="text-3xl font-display font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-amber-300 to-emerald-400 group-hover:animate-gradient-flow">
                            EIR <span className="text-white/90 font-medium">ADMIN</span>
                        </h1>
                        <p className="text-[10px] uppercase tracking-[0.4em] font-black text-emerald-400/60 mt-0.5">Gestión de Repuestos Divinos</p>
                    </div>
                </div>
            </header>

            <main className="px-6 relative z-10">
                <AddPartForm />
            </main>
        </div>
    );
}
