'use client';

import { Filter } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

interface SidebarProps {
    services: string[];
    providers: string[];
}

export default function Sidebar({ services, providers }: SidebarProps) {
    const searchParams = useSearchParams();
    const router = useRouter();

    const selectedService = searchParams.get('service');
    const selectedProvider = searchParams.get('provider');

    const handleFilter = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams);
        if (value === params.get(key)) {
            params.delete(key); // Toggle off
        } else {
            params.set(key, value);
        }
        router.replace(`/?${params.toString()}`);
    };

    return (
        <aside className="w-72 glass-panel border-r border-[#f59e0b22] h-screen overflow-y-auto hidden md:block shrink-0 sticky top-0">
            <div className="p-8">
                {/* Brand Logo Section */}
                <div className="flex flex-col items-center mb-10">
                    <div className="relative w-24 h-24 mb-4 group">
                        <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full group-hover:bg-emerald-500/40 transition-all duration-500"></div>
                        <div className="relative w-full h-full bg-emerald-500/10 border border-emerald-500/20 rounded-full p-1 overflow-hidden shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                            <img
                                src="/eir_logo.png"
                                alt="EIR Logo"
                                className="w-full h-full object-cover rounded-full"
                            />
                        </div>
                    </div>
                    <h1 className="text-3xl font-display font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-amber-300 to-emerald-400 bg-[length:200%_auto] animate-gradient-flow">
                        EIR
                    </h1>
                    <div className="flex flex-col items-center gap-0.5 mt-2">
                        <p className="text-[10px] uppercase tracking-[0.25em] font-black text-emerald-400">
                            TU BUSCADOR DE REPUESTOS
                        </p>
                        <p className="text-[9px] uppercase tracking-[0.1em] font-medium text-emerald-500/40">
                            Creado por Alex Lesaka
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3 mb-8 px-2">
                    <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                        <Filter className="w-4 h-4 text-emerald-400" />
                    </div>
                    <h2 className="font-display font-semibold text-lg text-white">Refinar Repuestos</h2>
                </div>

                <div className="mb-10">
                    <h3 className="font-display font-bold text-emerald-500/50 mb-4 px-2 text-[11px] uppercase tracking-widest">
                        Por Servicio
                    </h3>
                    <div className="space-y-1.5">
                        {services.map((service) => (
                            <button
                                key={service}
                                onClick={() => handleFilter('service', service)}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 group ${selectedService === service
                                    ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                                    : 'hover:bg-white/5 border border-transparent text-slate-400 hover:text-emerald-300'
                                    }`}
                            >
                                <div className={`w-2 h-2 rounded-full transition-all duration-300 ${selectedService === service ? 'bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.6)]' : 'bg-slate-600 group-hover:bg-emerald-500/40'
                                    }`} />
                                <span className="text-sm font-medium">{service}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="font-display font-bold text-emerald-500/50 mb-4 px-2 text-[11px] uppercase tracking-widest">
                        Por Proveedor
                    </h3>
                    <div className="space-y-1.5">
                        {providers.map((provider) => (
                            <button
                                key={provider}
                                onClick={() => handleFilter('provider', provider)}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 group ${selectedProvider === provider
                                    ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                                    : 'hover:bg-white/5 border border-transparent text-slate-400 hover:text-emerald-300'
                                    }`}
                            >
                                <div className={`w-2 h-2 rounded-full transition-all duration-300 ${selectedProvider === provider ? 'bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.6)]' : 'bg-slate-600 group-hover:bg-emerald-500/40'
                                    }`} />
                                <span className="text-sm font-medium">{provider}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </aside>
    );
}
