'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Plus, X, Search } from 'lucide-react';
import { GlowingEffect } from './ui/glowing-effect';

interface CustomSelectorProps {
    label: string;
    name: string;
    options: string[];
    defaultValue?: string | string[];
    multiple?: boolean;
    required?: boolean;
    placeholder?: string;
}

export default function CustomSelector({
    label,
    name,
    options,
    defaultValue,
    multiple = false,
    required = false,
    placeholder = 'Seleccionar...'
}: CustomSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selected, setSelected] = useState<string[]>(() => {
        if (!defaultValue) return [];
        return Array.isArray(defaultValue) ? defaultValue : [defaultValue];
    });
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredOptions = (options || []).filter(opt => {
        if (typeof opt !== 'string') return false;
        return opt.toLowerCase().includes((searchTerm || '').toLowerCase());
    });

    const isCustomOption = searchTerm &&
        !(options || []).some(opt => typeof opt === 'string' && opt.toLowerCase() === searchTerm.toLowerCase());

    const toggleOption = (opt: any) => {
        const normalized = String(opt || '').toUpperCase();
        if (multiple) {
            setSelected(prev =>
                prev.includes(normalized)
                    ? prev.filter(s => s !== normalized)
                    : [...prev, normalized]
            );
        } else {
            setSelected([normalized]);
            setIsOpen(false);
        }
        setSearchTerm('');
    };

    const removeOption = (opt: string) => {
        setSelected(prev => prev.filter(s => s !== opt));
    };

    return (
        <div className="space-y-2 relative" ref={containerRef}>
            <label className="text-[11px] font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-300 uppercase tracking-[0.25em] block pl-1 mb-1">
                {label} {required && <span className="text-amber-500">*</span>}
            </label>

            <div className="relative rounded-2xl group/selector">
                <GlowingEffect
                    blur={0}
                    borderWidth={2}
                    spread={40}
                    glow
                    proximity={64}
                    inactiveZone={0.01}
                    disabled={false}
                />
                <div
                    className={`min-h-[56px] w-full p-2.5 rounded-2xl bg-[#020617]/50 border transition-all cursor-pointer flex flex-wrap gap-2 items-center relative z-10
                        ${isOpen ? 'border-emerald-500/50 ring-2 ring-emerald-500/20' : 'border-white/5 hover:border-white/10'}`}
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {selected.length > 0 ? (
                        selected.map(val => (
                            <span key={String(val)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black tracking-wider uppercase shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                                {String(val)}
                                {multiple && (
                                    <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); removeOption(String(val)); }}
                                        className="hover:text-amber-400 transition-colors"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                )}
                            </span>
                        ))
                    ) : (
                        <span className="text-slate-600 text-sm pl-2 font-medium">{placeholder}</span>
                    )}

                    <div className="ml-auto pr-2 text-slate-600">
                        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180 text-emerald-500' : ''}`} />
                    </div>

                    {/* Hidden Inputs for Form Submission */}
                    {selected.map((val, idx) => (
                        <input key={idx} type="hidden" name={name} value={String(val)} />
                    ))}
                </div>
            </div>

            {isOpen && (
                <div className="absolute z-[100] top-full mt-2 w-full bg-[#0f172a] rounded-3xl border border-white/10 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="p-3 border-b border-white/5 bg-white/5">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                            <input
                                autoFocus
                                type="text"
                                placeholder="Buscar o crear nuevo..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                                className="w-full pl-9 pr-4 py-2.5 bg-[#0f172a] border border-white/10 rounded-xl outline-none text-xs text-white placeholder:text-slate-500 font-medium focus:border-emerald-500/50"
                            />
                        </div>
                    </div>

                    <div className="max-h-60 overflow-y-auto p-2 scrollbar-hide">
                        {isCustomOption && (
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); toggleOption(searchTerm); }}
                                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-emerald-500/10 text-emerald-400 transition-all text-left"
                            >
                                <div className="p-1.5 rounded-lg bg-emerald-500/20">
                                    <Plus className="w-3 h-3" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest">Crear Nuevo</p>
                                    <p className="text-xs font-bold text-white">{searchTerm.toUpperCase()}</p>
                                </div>
                            </button>
                        )}

                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((opt) => (
                                <button
                                    key={opt}
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); toggleOption(opt); }}
                                    className={`w-full px-4 py-3 rounded-xl text-left text-sm transition-all flex items-center justify-between
                                        ${selected.includes(opt) ? 'bg-emerald-500/10 text-emerald-400 font-bold' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                                >
                                    <span className="uppercase tracking-wide text-xs">{opt}</span>
                                    {selected.includes(opt) && <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.6)]" />}
                                </button>
                            ))
                        ) : !isCustomOption && (
                            <p className="p-4 text-xs text-slate-600 italic text-center">No se encontraron resultados</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
