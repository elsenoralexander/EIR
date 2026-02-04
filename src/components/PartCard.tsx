import { useState, useRef } from 'react';
import { SparePart } from '@/types';
import { Tag, Building2, Monitor, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { GlowingEffect } from './ui/glowing-effect';

interface PartCardProps {
    part: SparePart;
    onClick: (part: SparePart) => void;
}

export default function PartCard({ part, onClick }: PartCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);

    const hasImage = part.imageFile && part.imageFile !== 'NaN' && part.imageFile !== '';
    const imageToDisplay = part.thumbnailUrl || part.imageFile;

    return (
        <div className="h-full w-full animate-reveal relative rounded-3xl" style={{ animationDelay: 'inherit' }}>
            <GlowingEffect
                spread={40}
                glow
                disabled={false}
                proximity={64}
                inactiveZone={0.01}
                borderWidth={3}
            />
            <div
                ref={cardRef}
                className="glass-panel rounded-3xl border border-white/5 overflow-hidden hover:shadow-[0_40px_80px_rgba(0,0,0,0.4)] hover:border-emerald-500/40 transition-all duration-500 group flex flex-col h-full relative"
            >
                <div
                    onClick={() => onClick(part)}
                    className="aspect-square relative bg-white/5 flex items-center justify-center overflow-hidden cursor-pointer"
                >
                    {/* Image Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-60 z-[1]" />

                    {hasImage ? (
                        <div className="relative w-full h-full">
                            <Image
                                src={imageToDisplay.startsWith('http') || imageToDisplay.startsWith('/') ? imageToDisplay : `https://placehold.co/400x400/020617/10b981?text=${encodeURIComponent(part.name)}`}
                                alt={part.name}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                quality={85}
                                className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                            />
                        </div>
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-emerald-500/20 bg-white/5">
                            <ImageIcon className="w-12 h-12 mb-2 animate-pulse" />
                            <span className="text-[10px] font-display font-bold uppercase tracking-[0.2em]">Sin Suministro</span>
                        </div>
                    )}
                </div>

                <div className="p-5 flex-1 flex flex-col cursor-pointer bg-gradient-to-b from-transparent to-white/[0.02]" onClick={() => onClick(part)}>
                    <div className="flex items-center justify-between mb-3 gap-2">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[9px] font-bold bg-emerald-500/10 text-emerald-400 uppercase tracking-widest border border-emerald-500/20 shadow-sm">
                            {part.providerRef}
                        </span>
                        <span className="font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-300 tracking-tight">
                            {part.price !== 'NaN' ? (
                                <span className="flex items-center gap-1">
                                    {part.price}
                                </span>
                            ) : ''}
                        </span>
                    </div>

                    <h3 className="font-display font-bold text-white mb-4 line-clamp-2 group-hover:text-emerald-400 transition-colors duration-300 text-base leading-tight">
                        {part.name}
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
        </div>
    );
}
