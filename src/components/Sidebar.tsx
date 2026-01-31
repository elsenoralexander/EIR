import { Filter, ChevronDown, ChevronRight, Building2, Monitor, Hammer } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

interface SidebarProps {
    services: string[];
    providers: string[];
    machines: string[];
}

export default function Sidebar({ services, providers, machines }: SidebarProps) {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [openSections, setOpenSections] = useState<Record<string, boolean>>({
        providers: true,
        services: false,
        machines: false
    });

    const selectedService = searchParams.get('service');
    const selectedProvider = searchParams.get('provider');
    const selectedMachine = searchParams.get('machine');

    const toggleSection = (section: string) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const handleFilter = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams);
        if (value === params.get(key)) {
            params.delete(key);
        } else {
            params.set(key, value);
        }
        router.replace(`/?${params.toString()}`);
    };

    const FilterSection = ({
        id,
        title,
        icon: Icon,
        items,
        selected,
        paramKey
    }: {
        id: string,
        title: string,
        icon: any,
        items: string[],
        selected: string | null,
        paramKey: string
    }) => {
        const isOpen = openSections[id];
        return (
            <div className="mb-4">
                <button
                    onClick={() => toggleSection(id)}
                    className="w-full flex items-center justify-between px-3 py-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all group"
                >
                    <div className="flex items-center gap-3">
                        <div className={`p-1.5 rounded-lg ${isOpen ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-slate-500'} transition-colors`}>
                            <Icon className="w-4 h-4" />
                        </div>
                        <span className={`text-[11px] font-black uppercase tracking-[0.15em] ${isOpen ? 'text-white' : 'text-slate-400'}`}>
                            {title}
                        </span>
                    </div>
                    {isOpen ? <ChevronDown className="w-4 h-4 text-emerald-500/50" /> : <ChevronRight className="w-4 h-4 text-slate-600" />}
                </button>

                {isOpen && (
                    <div className="mt-2 space-y-1 pl-1 animate-in slide-in-from-top-2 duration-300">
                        {items.length > 0 ? items.map((item) => (
                            <button
                                key={item}
                                onClick={() => handleFilter(paramKey, item)}
                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 group/item ${selected === item
                                    ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                                    : 'hover:bg-white/5 text-slate-500 hover:text-slate-300'
                                    }`}
                            >
                                <div className={`w-1.5 h-1.5 rounded-full ${selected === item ? 'bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.6)]' : 'bg-slate-700'}`} />
                                <span className={`text-[10px] font-bold uppercase tracking-wide truncate ${selected === item ? 'text-emerald-400' : ''}`}>
                                    {item}
                                </span>
                            </button>
                        )) : (
                            <p className="text-[9px] text-slate-600 italic px-4 py-2">Sin datos disponibles</p>
                        )}
                    </div>
                )}
            </div>
        );
    };

    return (
        <aside className="w-72 glass-panel border-r border-white/5 h-screen overflow-y-auto hidden md:block shrink-0 sticky top-0 scrollbar-hide">
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

                <div className="space-y-2">
                    <FilterSection
                        id="providers"
                        title="Proveedores"
                        icon={Building2}
                        items={providers}
                        selected={selectedProvider}
                        paramKey="provider"
                    />
                    <FilterSection
                        id="services"
                        title="Servicios"
                        icon={Monitor}
                        items={services}
                        selected={selectedService}
                        paramKey="service"
                    />
                    <FilterSection
                        id="machines"
                        title="Máquinas"
                        icon={Hammer}
                        items={machines}
                        selected={selectedMachine}
                        paramKey="machine"
                    />
                </div>
            </div>
        </aside>
    );
}
