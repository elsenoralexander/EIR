import AddPartForm from '@/components/AddPartForm';
import { Package } from 'lucide-react';

export default function AdminAddPage() {
    return (
        <div className="min-h-screen bg-[#020617] overflow-y-auto">
            {/* Background Decorative Glows */}
            <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none z-0" />
            <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-amber-500/5 blur-[120px] rounded-full pointer-events-none z-0" />

            <header className="glass-panel border-b border-white/5 p-6 sm:p-8 flex items-center justify-center shrink-0 mb-12 relative z-10">
                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full group-hover:bg-emerald-500/40 transition-all duration-500" />
                        <img src="/eir_logo.png" alt="Eir" className="relative w-12 h-12 object-contain filter drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-display font-black text-white tracking-tight">
                            EIR <span className="text-emerald-500/60 font-medium">ADMIN</span>
                        </h1>
                        <p className="text-[10px] uppercase tracking-[0.3em] font-medium text-emerald-500/40">Creación de Repuestos</p>
                    </div>
                </div>
            </header>

            <main className="px-6 relative z-10">
                <AddPartForm />
            </main>
        </div>
    );
}
