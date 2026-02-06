'use client';

import { SparePart } from '@/types';
import { X, Phone, Mail, FileText, ShoppingCart, Image as ImageIcon, Edit3, Trash2, Tag, Loader2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { deletePart } from '@/actions/partActions';

interface PartDetailModalProps {
    part: SparePart | null;
    onClose: () => void;
}

export default function PartDetailModal({ part, onClose }: PartDetailModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);
    const [deleting, setDeleting] = useState(false);

    const [activeImage, setActiveImage] = useState<string | null>(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [isOrderMode, setIsOrderMode] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [isAxionalAlertOpen, setIsAxionalAlertOpen] = useState(false);
    const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);

    const selectedVariant = part?.variants?.find(v => v.id === selectedVariantId) || null;

    useEffect(() => {
        if (part) {
            setActiveImage(part.imageFile || null);
            setIsOrderMode(false);
            setQuantity(1);
            setSelectedVariantId(part.variants && part.variants.length > 0 ? part.variants[0].id : null);
        }
    }, [part?.id]);

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    async function handleDelete() {
        console.log('Confirmed deletion for:', part?.id);
        if (!part) return;

        setDeleting(true);
        try {
            const result = await deletePart(part.id);
            console.log('Delete result:', result);
            if (result.success) {
                onClose();
                window.location.reload();
            } else {
                alert(result.error);
                setDeleting(false);
                setShowDeleteConfirm(false);
            }
        } catch (error) {
            console.error('Error deleting part:', error);
            setDeleting(false);
            setShowDeleteConfirm(false);
        }
    }

    const handleOrder = () => {
        if (!part) return;

        const category = (part.category || 'COMPRAS').toUpperCase();
        let recipients = '';

        if (category === 'MANTENIMIENTO') {
            recipients = 'mantenimiento.gpk@quironsalud.es, alex.lesaka@quironsalud.es, unai.lecube@quironsalud.es';
        } else {
            // Lógica de Compras: Solo dos destinatarios según el servicio
            const hasQuirofano = part.services.some(s => s.toUpperCase().includes('QUIROFANO'));
            const mainMail = hasQuirofano ? 'comprasq.gpk@quironsalud.es' : 'compras.gpk@quironsalud.es';
            recipients = `${mainMail}, monica.pozuelo@quironsalud.es`;
        }

        const currentRef = selectedVariant?.providerRef || part.providerRef;
        const subject = `PEDIDO: ${part.name} [Ref: ${currentRef}]`;
        const body = `Hola,

Necesitamos pedir el siguiente material:

--------------------------------------------------
📦 DETALLES DEL PRODUCTO
--------------------------------------------------
ARTÍCULO:   ${part.commonName || part.name}${selectedVariant ? ` (${selectedVariant.name})` : ''}
CANTIDAD:   ${quantity} unidades
REFERENCIA: ${currentRef}
PROVEEDOR:  ${part.provider}

--------------------------------------------------
💰 INFORMACIÓN DE COMPRA
--------------------------------------------------
ÚLTIMO PRECIO: ${part.price}
CONTACTO:      ${part.contact || 'consultar'}

Muchas gracias.
--------------------------------------------------`;

        const mailtoUrl = `mailto:${recipients}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = mailtoUrl;
    };

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                if (isPreviewOpen) {
                    setIsPreviewOpen(false);
                } else {
                    onClose();
                }
            }
        };

        if (part) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [part, onClose, isPreviewOpen]);

    if (!part) return null;

    const allImages = [part.imageFile, ...(part.additionalImages || [])].filter(img => img && img !== 'NaN' && img !== '');
    const hasImages = allImages.length > 0;

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
                <div className="flex items-start justify-between p-6 sm:p-8 border-b border-white/5 shrink-0 bg-white/5 gap-4">
                    <div className="flex-1 min-w-0">
                        <h2 className="text-xl sm:text-2xl font-display font-black text-white tracking-tight leading-tight break-words mb-1">
                            {part.name}
                        </h2>
                        <p className="text-[9px] sm:text-[10px] text-emerald-500/60 font-medium uppercase tracking-[0.2em] mb-4 sm:mb-0">Ficha Técnica de Suministro</p>

                        {/* Mobile Admin Actions (Below Title) */}
                        <div className="flex sm:hidden items-center gap-3 mt-3">
                            <Link
                                href={`/admin/edit/${part.id}`}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-widest active:scale-95"
                                onClick={onClose}
                            >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span>Editar</span>
                            </Link>
                            <button
                                onClick={() => setShowDeleteConfirm(true)}
                                disabled={deleting}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[10px] font-bold uppercase tracking-widest active:scale-95 disabled:opacity-50"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>{deleting ? '...' : 'Borrar'}</span>
                            </button>
                        </div>
                    </div>

                    <div className="hidden sm:flex items-start gap-3 shrink-0">
                        <div className="flex flex-col gap-2">
                            <Link
                                href={`/admin/edit/${part.id}`}
                                className="group relative px-3 py-1.5 rounded-xl overflow-hidden transition-all active:scale-95"
                                onClick={onClose}
                            >
                                <div className="absolute inset-0 bg-emerald-500/10 border border-emerald-500/30 rounded-xl" />
                                <div className="relative flex items-center justify-center gap-1.5 text-emerald-400 text-[9px] font-bold uppercase tracking-widest">
                                    <Edit3 className="w-3.5 h-3.5" />
                                    <span className="hidden sm:inline">Editar</span>
                                </div>
                            </Link>
                            <button
                                onClick={() => setShowDeleteConfirm(true)}
                                disabled={deleting}
                                className="group relative px-3 py-1.5 rounded-xl overflow-hidden transition-all active:scale-95 disabled:opacity-50"
                            >
                                <div className="absolute inset-0 bg-rose-500/10 border border-rose-500/30 rounded-xl" />
                                <div className="relative flex items-center justify-center gap-1.5 text-rose-400 text-[9px] font-bold uppercase tracking-widest">
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span className="hidden sm:inline">{deleting ? '...' : 'Borrar'}</span>
                                </div>
                            </button>
                        </div>

                        <button
                            onClick={onClose}
                            className="p-2 sm:p-3 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition shrink-0"
                            title="Cerrar"
                        >
                            <X className="w-5 h-5 sm:w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Modal Content */}
                <div className="p-8 space-y-8 overflow-y-auto scrollbar-hide">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {/* Image Section */}
                        <div className="space-y-4">
                            <div className="aspect-square bg-[#020617] rounded-3xl flex items-center justify-center border border-white/5 overflow-hidden relative group">
                                <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                {hasImages ? (
                                    <Image
                                        src={activeImage || allImages[0]}
                                        alt={part.name}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        className="object-contain p-6 relative z-10 transition-all duration-700 hover:scale-105 cursor-zoom-in"
                                        onClick={() => setIsPreviewOpen(true)}
                                        priority
                                    />
                                ) : (
                                    <div className="flex flex-col items-center justify-center text-emerald-500/20">
                                        <ImageIcon className="w-20 h-20 mb-3 animate-pulse" />
                                        <span className="text-[10px] font-display font-bold uppercase tracking-[0.3em]">Sin Representación Visual</span>
                                    </div>
                                )}
                            </div>

                            {/* Thumbnails */}
                            {allImages.length > 1 && (
                                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                                    {allImages.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setActiveImage(img)}
                                            className={`relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${activeImage === img ? 'border-emerald-500 scale-105 shadow-lg shadow-emerald-500/20' : 'border-white/5 grayscale opacity-50 hover:grayscale-0 hover:opacity-100'}`}
                                        >
                                            <Image
                                                src={img}
                                                alt={`thumb-${idx}`}
                                                fill
                                                sizes="64px"
                                                className="object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Details Section */}
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-3xl bg-white/5 border border-white/5">
                                    <label className="text-[9px] font-bold text-emerald-500/40 uppercase tracking-widest block mb-1">Referencia</label>
                                    <p className="font-mono text-sm font-bold text-white truncate">{selectedVariant?.providerRef || part.providerRef}</p>
                                </div>
                                <div className="p-4 rounded-3xl bg-emerald-500/5 border border-emerald-500/10">
                                    <label className="text-[9px] font-bold text-emerald-500/40 uppercase tracking-widest block mb-1">Precio Divino</label>
                                    <p className="text-xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-300 tracking-tighter">{part.price !== 'NaN' ? part.price : 'Consultar'}</p>
                                </div>
                            </div>

                            {/* Variants Selection UI */}
                            {part.variants && part.variants.length > 0 && (
                                <div className="space-y-4 p-6 rounded-3xl bg-white/5 border border-white/10 animate-in zoom-in-95 duration-500 mt-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Tag className="w-4 h-4 text-emerald-400" />
                                        <h4 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Seleccionar Variante / Tamaño</h4>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {part.variants.map((variant) => (
                                            <button
                                                key={variant.id}
                                                onClick={() => setSelectedVariantId(variant.id)}
                                                className={`px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all border ${selectedVariantId === variant.id
                                                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                                                    : 'bg-white/5 border-white/10 text-slate-400 hover:border-emerald-500/30 hover:text-emerald-500/60'
                                                    }`}
                                            >
                                                {variant.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

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

                                {part.commonName && part.commonName !== 'NaN' && (
                                    <div className="flex items-start gap-4 p-4 rounded-3xl bg-amber-500/5 border border-amber-500/10 group hover:border-amber-500/30 transition-colors">
                                        <div className="p-2.5 rounded-xl bg-white/5 text-amber-500/50 group-hover:text-amber-400">
                                            <Tag className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <label className="text-[9px] font-bold text-amber-500/40 uppercase tracking-widest block mb-1">Nombre Común</label>
                                            <p className="text-white font-medium italic">"{part.commonName}"</p>
                                        </div>
                                    </div>
                                )}

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

                                {((selectedVariant ? selectedVariant.internalCode : part.internalCode) && (selectedVariant ? selectedVariant.internalCode : part.internalCode) !== 'NaN') && (
                                    <div className="space-y-1">
                                        <span className="block text-[9px] font-bold text-emerald-500/40 uppercase tracking-widest">Código Axional</span>
                                        <div className="flex items-center gap-3 text-amber-400">
                                            <span className="font-display font-black text-2xl tracking-[0.15em]">{selectedVariant ? selectedVariant.internalCode : part.internalCode}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Final Action */}
                <div className="p-8 border-t border-white/5 bg-white/5 space-y-4">
                    {isOrderMode && (
                        <div className="flex flex-col gap-3 p-6 rounded-[28px] bg-emerald-500/5 border border-emerald-500/20 animate-in slide-in-from-bottom-4 duration-500">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-emerald-500/60 uppercase tracking-widest pl-1">Cantidad a solicitar</span>
                                <div className="flex items-center gap-4 bg-[#020617] p-1.5 rounded-full border border-white/10">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
                                    >
                                        <span className="text-xl font-bold leading-none">-</span>
                                    </button>
                                    <span className="w-8 text-center font-display font-black text-white text-lg">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 hover:bg-emerald-500/30 transition-colors"
                                    >
                                        <span className="text-xl font-bold leading-none">+</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex gap-4">
                        <button
                            onClick={onClose}
                            className="flex-1 py-4 px-6 bg-white/5 hover:bg-white/10 text-white font-display font-bold rounded-2xl border border-white/10 transition-all uppercase tracking-[0.2em] text-xs shadow-lg active:scale-95"
                        >
                            Retornar al Oráculo
                        </button>
                        <button
                            onClick={() => {
                                const activeCode = selectedVariant ? selectedVariant.internalCode : part.internalCode;
                                if (activeCode && activeCode !== 'NaN' && activeCode !== '') {
                                    setIsAxionalAlertOpen(true);
                                } else if (isOrderMode) {
                                    handleOrder();
                                } else {
                                    setIsOrderMode(true);
                                }
                            }}
                            className={`flex-1 py-4 px-6 font-display font-bold rounded-2xl transition-all uppercase tracking-[0.2em] text-xs shadow-lg active:scale-95 flex items-center justify-center gap-2
                                ${isOrderMode || ((selectedVariant ? selectedVariant.internalCode : part.internalCode) && (selectedVariant ? selectedVariant.internalCode : part.internalCode) !== 'NaN' && (selectedVariant ? selectedVariant.internalCode : part.internalCode) !== '')
                                    ? 'bg-amber-500 hover:bg-amber-400 shadow-amber-500/20'
                                    : 'bg-gradient-to-r from-emerald-600 to-emerald-500 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                                } text-white`}
                        >
                            {(selectedVariant ? selectedVariant.internalCode : (part.internalCode && part.internalCode !== 'NaN' && part.internalCode !== ''))
                                ? 'Solicitar vía Axional'
                                : isOrderMode ? 'Confirmar y Enviar Mail' : 'Realizar solicitud'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Lightbox / Preview Overlay */}
            {isPreviewOpen && (
                <div
                    className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-md animate-in fade-in duration-300 cursor-zoom-out"
                    onClick={() => setIsPreviewOpen(false)}
                >
                    <button
                        className="absolute top-6 right-6 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all z-[210]"
                        onClick={(e) => { e.stopPropagation(); setIsPreviewOpen(false); }}
                    >
                        <X className="w-8 h-8" />
                    </button>

                    <div className="relative w-full h-full flex items-center justify-center p-4 sm:p-12">
                        <Image
                            src={activeImage || allImages[0]}
                            alt={part.name}
                            fill
                            sizes="100vw"
                            quality={100}
                            className="object-contain shadow-2xl animate-in zoom-in-95 duration-300"
                            onClick={(e) => e.stopPropagation()}
                            priority
                        />
                    </div>
                </div>
            )}

            {/* Axional Redirection Alert Modal */}
            {isAxionalAlertOpen && (
                <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-[#020617]/95 backdrop-blur-2xl animate-in fade-in duration-300">
                    <div className="glass-panel border-2 border-emerald-500/20 rounded-[40px] p-10 max-w-md w-full shadow-[0_0_100px_rgba(16,185,129,0.1)] text-center space-y-8 animate-in zoom-in-95 duration-300">
                        <div className="relative w-28 h-28 mx-auto group">
                            <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full animate-pulse" />
                            <div className="relative w-full h-full bg-emerald-500/10 border border-emerald-500/20 rounded-full p-1 overflow-hidden shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                                <img
                                    src="/eir_not_found.jpg"
                                    alt="EIR Goddess"
                                    className="w-full h-full object-cover rounded-full"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-2xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-300 tracking-tight leading-tight">
                                TRÁMITE VÍA AXIONAL
                            </h3>
                            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-2">
                                <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-emerald-500/40 text-center">Código Axional</p>
                                <p className="text-2xl font-display font-black text-amber-400 tracking-[0.15em] text-center drop-shadow-[0_0_10px_rgba(251,191,36,0.3)]">
                                    {selectedVariant ? selectedVariant.internalCode : part.internalCode}
                                </p>
                            </div>
                            <p className="text-sm text-slate-400 font-medium leading-relaxed">
                                Este artículo debe ser solicitado exclusivamente a través de la plataforma Axional utilizando el código indicado arriba.
                            </p>
                        </div>

                        <div className="flex flex-col gap-3 pt-4">
                            <button
                                onClick={() => window.open('https://axional.quironsalud.es/webOS/desktop/', '_blank')}
                                className="w-full py-4 px-6 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] text-white font-display font-black rounded-2xl transition-all uppercase tracking-[0.2em] text-xs active:scale-95"
                            >
                                IR A AXIONAL
                            </button>
                            <button
                                onClick={() => setIsAxionalAlertOpen(false)}
                                className="w-full py-4 px-6 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white font-display font-bold rounded-2xl border border-white/10 transition-all uppercase tracking-[0.2em] text-xs active:scale-95"
                            >
                                VOLVER
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-[#020617]/95 backdrop-blur-2xl animate-in fade-in duration-300">
                    <div className="glass-panel border-2 border-rose-500/20 rounded-[40px] p-10 max-w-sm w-full shadow-[0_0_100px_rgba(244,63,94,0.1)] text-center space-y-8 animate-in zoom-in-95 duration-300">
                        <div className="w-20 h-20 mx-auto rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500">
                            <Trash2 className="w-10 h-10" />
                        </div>

                        <div className="space-y-3">
                            <h3 className="text-2xl font-display font-black text-white tracking-tight">¿Eliminar Registro?</h3>
                            <p className="text-sm text-slate-400 leading-relaxed font-medium">
                                Esta acción es <span className="text-rose-400 font-bold">irreversible</span>. El repuesto desaparecerá de la biblioteca principal permanentemente.
                            </p>
                        </div>

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                className="w-full py-4 bg-rose-500 hover:bg-rose-400 text-white font-display font-bold rounded-2xl transition-all uppercase tracking-[0.2em] text-xs shadow-lg shadow-rose-500/20 active:scale-95 flex items-center justify-center gap-2"
                            >
                                {deleting ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <>
                                        <Trash2 className="w-4 h-4" />
                                        Confirmar Eliminación
                                    </>
                                )}
                            </button>
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                disabled={deleting}
                                className="w-full py-4 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white font-display font-bold rounded-2xl border border-white/5 transition-all uppercase tracking-[0.2em] text-xs active:scale-95"
                            >
                                Mantener Repuesto
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
