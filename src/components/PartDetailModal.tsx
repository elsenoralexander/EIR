import { SparePart } from '@/types';
import { X, Phone, Mail, FileText, ShoppingCart, Image as ImageIcon, Edit3 } from 'lucide-react';
import { useEffect, useRef } from 'react';
import Link from 'next/link';

interface PartDetailModalProps {
    part: SparePart | null;
    onClose: () => void;
}

export default function PartDetailModal({ part, onClose }: PartDetailModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (part) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [part, onClose]);

    if (!part) return null;

    const hasImage = part.imageFile && part.imageFile !== 'NaN' && part.imageFile !== '';

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-[#020617]/90 backdrop-blur-xl">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />

            <div
                ref={modalRef}
                className="glass-panel border border-white/10 rounded-[40px] shadow-[0_0_50px_rgba(0,0,0,0.5)] w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-300 relative"
                role="dialog"
                aria-modal="true"
            >
                {/* Modal Header */}
                <div className="flex items-center justify-between p-8 border-b border-white/5 shrink-0 bg-white/5">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-3">
                            <h2 className="text-2xl font-display font-black text-white tracking-tight leading-none">
                                {part.commonName && part.commonName !== 'NaN' ? part.commonName : part.name}
                            </h2>
                            <Link
                                href={`/admin/edit/${part.id}`}
                                className="group relative px-4 py-1.5 rounded-full overflow-hidden transition-all active:scale-95"
                                onClick={onClose}
                            >
                                <div className="absolute inset-0 bg-emerald-500/10 border border-emerald-500/30 rounded-full" />
                                <div className="relative flex items-center gap-1.5 text-emerald-400 text-[10px] font-bold uppercase tracking-widest">
                                    <Edit3 className="w-3.5 h-3.5" />
                                    Editar
                                </div>
                            </Link>
                        </div>
                        <p className="text-[10px] text-emerald-500/60 font-medium uppercase tracking-[0.2em]">Ficha Técnica de Suministro</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-3 rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Modal Content */}
                <div className="p-8 space-y-8 overflow-y-auto scrollbar-hide">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {/* Image Section */}
                        <div className="aspect-square bg-[#020617] rounded-3xl flex items-center justify-center border border-white/5 overflow-hidden relative group">
                            <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            {hasImage ? (
                                <img
                                    src={part.imageFile.startsWith('http') || part.imageFile.startsWith('/') ? part.imageFile : `https://placehold.co/500x500/020617/10b981?text=${encodeURIComponent(part.name)}`}
                                    alt={part.name}
                                    className="w-full h-full object-contain p-6 relative z-10 transition-transform duration-700 group-hover:scale-105"
                                />
                            ) : (
                                <div className="flex flex-col items-center justify-center text-emerald-500/20">
                                    <ImageIcon className="w-20 h-20 mb-3 animate-pulse" />
                                    <span className="text-[10px] font-display font-bold uppercase tracking-[0.3em]">Sin Representación Visual</span>
                                </div>
                            )}
                        </div>

                        {/* Details Section */}
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-3xl bg-white/5 border border-white/5">
                                    <label className="text-[9px] font-bold text-emerald-500/40 uppercase tracking-widest block mb-1">Referencia</label>
                                    <p className="font-mono text-sm font-bold text-white truncate">{part.providerRef}</p>
                                </div>
                                <div className="p-4 rounded-3xl bg-emerald-500/5 border border-emerald-500/10">
                                    <label className="text-[9px] font-bold text-amber-500/40 uppercase tracking-widest block mb-1">Precio Divino</label>
                                    <p className="text-xl font-display font-black text-amber-400 tracking-tighter">{part.price !== 'NaN' ? part.price : 'Consultar'}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-start gap-4 p-4 rounded-3xl bg-white/5 border border-white/5 group hover:border-emerald-500/30 transition-colors">
                                    <div className="p-2.5 rounded-xl bg-white/5 text-emerald-500/50 group-hover:text-emerald-400">
                                        <ShoppingCart className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <label className="text-[9px] font-bold text-emerald-500/40 uppercase tracking-widest block mb-1">Proveedor Principal</label>
                                        <p className="text-white font-bold tracking-wide">{part.provider}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 p-4 rounded-3xl bg-white/5 border border-white/5 group hover:border-emerald-500/30 transition-colors">
                                    <div className="p-2.5 rounded-xl bg-white/5 text-emerald-500/50 group-hover:text-emerald-400">
                                        <FileText className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <label className="text-[9px] font-bold text-emerald-500/40 uppercase tracking-widest block mb-1">Equipo Asociado</label>
                                        <p className="text-slate-300 font-medium">{part.machine}</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="text-[9px] font-bold text-emerald-500/40 uppercase tracking-widest block mb-3 px-1">Ámbitos de Aplicación</label>
                                <div className="flex flex-wrap gap-2">
                                    {part.services.map(s => (
                                        <span key={s} className="px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-widest border border-emerald-500/20 shadow-sm">
                                            {s}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Section */}
                    <div className="group relative rounded-[32px] overflow-hidden p-1 shadow-2xl">
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/50 via-emerald-400/50 to-amber-400/50 opacity-20 group-hover:scale-110 transition-transform duration-1000" />
                        <div className="relative bg-[#020617] rounded-[28px] p-8 border border-white/5">
                            <h3 className="font-display font-black text-white text-lg mb-6 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                                    <Phone className="w-4 h-4" />
                                </div>
                                Logística de Adquisición
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {part.contact && (
                                    <div className="space-y-1">
                                        <span className="block text-[9px] font-bold text-emerald-500/40 uppercase tracking-widest">Enlace de Comunicación</span>
                                        <div className="flex items-center gap-3 text-slate-200 group/link">
                                            <Mail className="w-4 h-4 text-emerald-500/30 group-hover/link:text-emerald-400 transition-colors" />
                                            <span className="text-sm font-semibold break-all selection:bg-emerald-500/30">{part.contact}</span>
                                        </div>
                                    </div>
                                )}

                                {part.internalCode && part.internalCode !== 'NaN' && (
                                    <div className="space-y-1">
                                        <span className="block text-[9px] font-bold text-emerald-500/40 uppercase tracking-widest">Sello Interno</span>
                                        <div className="flex items-center gap-3 text-amber-400">
                                            <span className="font-display font-black text-2xl tracking-[0.15em]">{part.internalCode}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Final Action */}
                <div className="p-8 border-t border-white/5 bg-white/5 flex gap-4">
                    <button
                        onClick={onClose}
                        className="flex-1 py-4 px-6 bg-white/5 hover:bg-white/10 text-white font-display font-bold rounded-2xl border border-white/10 transition-all uppercase tracking-[0.2em] text-xs shadow-lg active:scale-95"
                    >
                        Retornar al Oráculo
                    </button>
                    <button
                        onClick={onClose}
                        className="flex-1 py-4 px-6 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] text-white font-display font-bold rounded-2xl transition-all uppercase tracking-[0.2em] text-xs shadow-lg active:scale-95"
                    >
                        Confirmar Petición
                    </button>
                </div>
            </div>
        </div>
    );
}
