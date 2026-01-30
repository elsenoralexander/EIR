import { SparePart } from '@/types';
import { Tag, Building2, Monitor, Image as ImageIcon, Edit2 } from 'lucide-react';
import Link from 'next/link';

interface PartCardProps {
    part: SparePart;
    onClick: (part: SparePart) => void;
}

export default function PartCard({ part, onClick }: PartCardProps) {
    const hasImage = part.imageFile && part.imageFile !== 'NaN' && part.imageFile !== '';

    return (
        <div
            className="glass-panel rounded-3xl border border-white/5 overflow-hidden hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] hover:border-emerald-500/30 transition-all duration-500 group flex flex-col h-full relative"
        >
            <div
                onClick={() => onClick(part)}
                className="aspect-square relative bg-white/5 flex items-center justify-center overflow-hidden cursor-pointer"
            >
                {/* Image Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-60 z-[1]" />

                {hasImage ? (
                    <div className="relative w-full h-full">
                        <img
                            src={part.imageFile.startsWith('http') || part.imageFile.startsWith('/') ? part.imageFile : `https://placehold.co/400x400/020617/10b981?text=${encodeURIComponent(part.name)}`}
                            alt={part.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                        />
                    </div>
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-emerald-500/20 bg-white/5">
                        <ImageIcon className="w-12 h-12 mb-2 animate-pulse" />
                        <span className="text-[10px] font-display font-bold uppercase tracking-[0.2em]">Sin Suministro</span>
                    </div>
                )}
            </div>

            <Link
                href={`/admin/edit/${part.id}`}
                className="absolute top-4 right-4 p-2.5 bg-[#f59e0b]/10 backdrop-blur-md border border-[#f59e0b]/20 rounded-xl text-[#f59e0b] hover:bg-[#f59e0b] hover:text-white transition-all duration-300 opacity-0 group-hover:opacity-100 z-10"
                title="Editar repuesto"
                onClick={(e) => e.stopPropagation()}
            >
                <Edit2 className="w-4 h-4" />
            </Link>

            <div className="p-5 flex-1 flex flex-col cursor-pointer bg-gradient-to-b from-transparent to-white/[0.02]" onClick={() => onClick(part)}>
                <div className="flex items-center justify-between mb-3 gap-2">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[9px] font-bold bg-emerald-500/10 text-emerald-400 uppercase tracking-widest border border-emerald-500/20 shadow-sm">
                        {part.providerRef}
                    </span>
                    <span className="font-display font-black text-amber-400 tracking-tight">
                        {part.price !== 'NaN' ? (
                            <span className="flex items-center gap-1">
                                {part.price}
                            </span>
                        ) : ''}
                    </span>
                </div>

                <h3 className="font-display font-bold text-white mb-4 line-clamp-2 group-hover:text-emerald-400 transition-colors duration-300 text-base leading-tight">
                    {part.commonName && part.commonName !== 'NaN' ? part.commonName : part.name}
                </h3>

                <div className="space-y-2 mt-auto pt-4 border-t border-white/5">
                    <div className="flex items-center text-[11px] text-slate-400 gap-2.5 group/info">
                        <div className="p-1 rounded-md bg-white/5 group-hover/info:bg-emerald-500/10 transition-colors">
                            <Building2 className="w-3 h-3 shrink-0 text-emerald-500/50" />
                        </div>
                        <span className="truncate font-semibold tracking-wide">{part.provider}</span>
                    </div>
                    <div className="flex items-center text-[11px] text-slate-400 gap-2.5 group/info">
                        <div className="p-1 rounded-md bg-white/5 group-hover/info:bg-emerald-500/10 transition-colors">
                            <Monitor className="w-3 h-3 shrink-0 text-emerald-500/50" />
                        </div>
                        <span className="truncate tracking-wide">{part.machine}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
