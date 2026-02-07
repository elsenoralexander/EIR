'use client';

import { SparePart } from '@/types';
import { X, Phone, Mail, FileText, ShoppingCart, Image as ImageIcon, Edit3, Trash2, Tag, Loader2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { deletePart } from '@/actions/partActions';
import { recordOrder } from '@/actions/orderActions';

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
    const [cart, setCart] = useState<{
        id: string;
        variantId: string | null;
        name: string;
        reference: string;
        price: string;
        quantity: number;
        internalCode?: string;
    }[]>([]);

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
        if (!part) return;
        setDeleting(true);
        try {
            const result = await deletePart(part.id);
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

    const handleOrder = async () => {
        if (!part || cart.length === 0) return;

        const category = (part.category || 'COMPRAS').toUpperCase();
        let recipients = '';

        if (category === 'MANTENIMIENTO') {
            recipients = 'mantenimiento.gpk@quironsalud.es, alex.lesaka@quironsalud.es, unai.lecube@quironsalud.es';
        } else {
            const hasQuirofano = part.services.some(s => s.toUpperCase().includes('QUIROFANO'));
            const mainMail = hasQuirofano ? 'comprasq.gpk@quironsalud.es' : 'compras.gpk@quironsalud.es';
            recipients = `${mainMail}, monica.pozuelo@quironsalud.es`;
        }

        const subject = `PEDIDO MULTIPLE: ${part.name} - ${cart.length} artículos`;

        let cartDetails = '';
        cart.forEach((item, index) => {
            cartDetails += `
${index + 1}. ARTÍCULO: ${item.name}
   CANTIDAD:  ${item.quantity} unidades
   REF:       ${item.reference}
   PRECIO:    ${item.price}
   CÓDIGO AX: ${item.internalCode || 'N/A'}
`;
        });

        const body = `Hola,

Necesitamos pedir el siguiente material multivariante:

--------------------------------------------------
📦 DETALLES DEL PEDIDO
--------------------------------------------------${cartDetails}
--------------------------------------------------
💰 INFORMACIÓN DE COMPRA
--------------------------------------------------
PROVEEDOR:  ${part.provider}
CONTACTO:   ${part.contact || 'consultar'}

Muchas gracias.
--------------------------------------------------`;

        const mailtoUrl = `mailto:${recipients}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        await recordOrder({
            partId: part.id,
            partName: part.name,
            provider: part.provider,
            items: cart,
            totalItems: cart.reduce((sum, item) => sum + item.quantity, 0),
            category: category
        });

        window.location.href = mailtoUrl;
    };

    const addToCart = () => {
        if (!part) return;
        const currentRef = selectedVariant?.providerRef || part.providerRef;
        const currentPrice = (selectedVariant?.price && selectedVariant.price !== 'NaN' && selectedVariant.price !== '')
            ? (selectedVariant.price.includes('€') ? selectedVariant.price : `${selectedVariant.price} €`)
            : (part.price !== 'NaN' && part.price !== '' ? part.price : 'Consultar');
        const currentName = selectedVariant ? `${part.name} (${selectedVariant.name})` : part.name;
        const internalCode = selectedVariant ? selectedVariant.internalCode : part.internalCode;

        setCart(prev => {
            const existing = prev.find(item => item.variantId === selectedVariantId);
            if (existing) {
                return prev.map(item =>
                    item.variantId === selectedVariantId
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            return [...prev, {
                id: crypto.randomUUID(),
                variantId: selectedVariantId,
                name: currentName,
                reference: currentRef,
                price: currentPrice,
                quantity: quantity,
                internalCode: internalCode
            }];
        });
        setIsOrderMode(false);
        setQuantity(1);
    };

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                if (isPreviewOpen) setIsPreviewOpen(false);
                else onClose();
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#020617]/90 backdrop-blur-xl">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />

            <div
                ref={modalRef}
                className="glass-panel border border-white/10 rounded-[40px] shadow-[0_0_50px_rgba(0,0,0,0.5)] w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-300 relative"
            >
                <div className="flex items-start justify-between p-6 sm:p-8 border-b border-white/5 shrink-0 bg-white/5 gap-4">
                    <div className="flex-1 min-w-0">
                        <h2 className="text-xl sm:text-2xl font-display font-black text-white tracking-tight leading-tight break-words mb-1">
                            {part.name}
                        </h2>
                        <p className="text-[9px] sm:text-[10px] text-emerald-500/60 font-medium uppercase tracking-[0.2em]">Ficha Técnica de Suministro</p>
                    </div>
                    <div className="flex items-start gap-3 shrink-0">
                        <div className="flex flex-col gap-2">
                            <Link href={`/admin/edit/${part.id}`} className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[9px] font-bold uppercase tracking-widest hover:bg-emerald-500/20 transition-all" onClick={onClose}>
                                <Edit3 className="w-3.5 h-3.5 inline mr-1" /> Editar
                            </Link>
                            <button onClick={() => setShowDeleteConfirm(true)} className="px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[9px] font-bold uppercase tracking-widest hover:bg-rose-500/20 transition-all">
                                <Trash2 className="w-3.5 h-3.5 inline mr-1" /> Borrar
                            </button>
                        </div>
                        <button onClick={onClose} className="p-2 sm:p-3 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white transition">
                            <X className="w-5 h-5 sm:w-6 h-6" />
                        </button>
                    </div>
                </div>

                <div className="p-8 space-y-8 overflow-y-auto scrollbar-hide">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-4">
                            <div className="aspect-square bg-[#020617] rounded-3xl flex items-center justify-center border border-white/5 overflow-hidden relative group cursor-zoom-in" onClick={() => setIsPreviewOpen(true)}>
                                {hasImages ? (
                                    <Image src={activeImage || allImages[0]} alt={part.name} fill sizes="50vw" className="object-contain p-6" priority />
                                ) : (
                                    <div className="flex flex-col items-center justify-center text-emerald-500/20">
                                        <ImageIcon className="w-20 h-20 mb-3" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">Sin Imagen</span>
                                    </div>
                                )}
                            </div>
                            {allImages.length > 1 && (
                                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                    {allImages.map((img, idx) => (
                                        <button key={idx} onClick={() => setActiveImage(img)} className={`relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${activeImage === img ? 'border-emerald-500 scale-105' : 'border-white/5 opacity-50'}`}>
                                            <Image src={img} alt="thumb" fill sizes="56px" className="object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-3xl bg-white/5 border border-white/5">
                                    <label className="text-[9px] font-bold text-emerald-500/40 uppercase tracking-widest block mb-1">Referencia</label>
                                    <p className="font-mono text-sm font-bold text-white truncate">{selectedVariant?.providerRef || part.providerRef}</p>
                                </div>
                                <div className="p-4 rounded-3xl bg-emerald-500/5 border border-emerald-500/10">
                                    <label className="text-[9px] font-bold text-emerald-500/40 uppercase tracking-widest block mb-1">Precio Divino</label>
                                    <p className="text-xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-300 tracking-tighter">
                                        {(selectedVariant?.price && selectedVariant.price !== 'NaN' && selectedVariant.price !== '')
                                            ? (selectedVariant.price.includes('€') ? selectedVariant.price : `${selectedVariant.price} €`)
                                            : (part.price !== 'NaN' && part.price !== '' ? part.price : 'Consultar')}
                                    </p>
                                </div>
                            </div>

                            {part.variants && part.variants.length > 0 && (
                                <div className="space-y-4 p-5 rounded-3xl bg-white/5 border border-white/10">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Tag className="w-3.5 h-3.5 text-emerald-400" />
                                        <h4 className="text-[9px] font-black text-white uppercase tracking-[0.2em]">Variantes</h4>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {part.variants.map((v) => (
                                            <button key={v.id} onClick={() => setSelectedVariantId(v.id)} className={`px-3 py-2 rounded-xl text-[9px] font-bold uppercase transition-all border ${selectedVariantId === v.id ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-white/5 border-white/5 text-slate-500 hover:border-white/20'}`}>
                                                {v.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="space-y-3">
                                <div className="p-4 rounded-3xl bg-white/5 border border-white/5">
                                    <label className="text-[9px] font-bold text-emerald-500/40 uppercase tracking-widest block mb-1">Proveedor</label>
                                    <p className="text-white font-bold text-sm truncate">{part.provider}</p>
                                </div>
                                {part.commonName && part.commonName !== 'NaN' && (
                                    <div className="p-4 rounded-3xl bg-amber-500/5 border border-amber-500/10">
                                        <label className="text-[9px] font-bold text-amber-500/40 uppercase tracking-widest block mb-1">Nombre Común</label>
                                        <p className="text-white font-medium italic text-sm">"{part.commonName}"</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {cart.length > 0 && (
                        <div className="space-y-4 p-6 rounded-[32px] bg-emerald-500/5 border border-emerald-500/20">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <ShoppingCart className="w-4 h-4 text-emerald-400" />
                                    <h4 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Cesta ({cart.length})</h4>
                                </div>
                                <button onClick={() => setCart([])} className="text-[9px] font-bold text-rose-400/60 hover:text-rose-400 uppercase tracking-widest">Vaciar Todo</button>
                            </div>
                            <div className="space-y-2">
                                {cart.map((item) => (
                                    <div key={item.id} className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/10 group">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-bold text-white truncate">{item.name}</p>
                                            <p className="text-[9px] text-emerald-500/60 font-mono">{item.reference} • {item.price}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">{item.quantity} ud.</span>
                                            <button onClick={() => setCart(prev => prev.filter(i => i.id !== item.id))} className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="group relative rounded-[32px] overflow-hidden p-1 shadow-2xl">
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/50 via-emerald-400/50 to-amber-400/50 opacity-20" />
                        <div className="relative bg-[#020617] rounded-[28px] p-6 border border-white/5">
                            <h3 className="text-sm font-black text-white mb-4 flex items-center gap-2">
                                <Phone className="w-4 h-4 text-emerald-400" /> Logística
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {part.contact && (
                                    <div>
                                        <span className="block text-[9px] font-bold text-emerald-500/40 uppercase tracking-widest mb-1">Contacto</span>
                                        <div className="flex items-center gap-2 text-slate-200 text-xs truncate">
                                            <Mail className="w-3.5 h-3.5" /> {part.contact}
                                        </div>
                                    </div>
                                )}
                                {((selectedVariant?.internalCode || part.internalCode) && (selectedVariant?.internalCode || part.internalCode) !== 'NaN') && (
                                    <div>
                                        <span className="block text-[9px] font-bold text-emerald-500/40 uppercase tracking-widest mb-1">Código Axional</span>
                                        <span className="text-amber-400 font-display font-black text-xl tracking-wider">{selectedVariant?.internalCode || part.internalCode}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-8 border-t border-white/5 bg-white/5 space-y-4">
                    {isOrderMode && (
                        <div className="p-6 rounded-[28px] bg-emerald-500/5 border border-emerald-500/20 flex flex-col gap-4 animate-in slide-in-from-bottom-2">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-emerald-500/60 uppercase tracking-widest">Cantidad</span>
                                <div className="flex items-center gap-4 bg-[#020617] p-1 rounded-full border border-white/10">
                                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 rounded-full bg-white/5 text-white">-</button>
                                    <span className="w-6 text-center text-sm font-black text-white">{quantity}</span>
                                    <button onClick={() => setQuantity(quantity + 1)} className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400">+</button>
                                </div>
                            </div>
                            <button onClick={addToCart} className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-[10px] uppercase tracking-widest transition-all">
                                Añadir a la Cesta
                            </button>
                        </div>
                    )}

                    <div className="flex gap-4">
                        <button onClick={onClose} className="flex-1 py-4 bg-white/5 text-white font-bold rounded-2xl border border-white/10 uppercase tracking-widest text-xs">Retornar</button>
                        <button
                            onClick={() => {
                                const activeCode = selectedVariant?.internalCode || part.internalCode;
                                if (activeCode && activeCode !== 'NaN' && activeCode !== '' && cart.length === 0 && !isOrderMode) {
                                    setIsAxionalAlertOpen(true);
                                } else if (cart.length > 0) {
                                    handleOrder();
                                } else {
                                    setIsOrderMode(true);
                                }
                            }}
                            className={`flex-[2] py-4 font-bold rounded-2xl uppercase tracking-widest text-xs transition-all ${cart.length > 0 || isOrderMode ? 'bg-amber-500 text-white' : 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'}`}
                        >
                            {cart.length > 0 ? `Realizar Pedido (${cart.length})` : isOrderMode ? 'Cerrar Cantidad' : 'Realizar Solicitud'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Sub-modals (Preview, Axional, Delete) */}
            {isPreviewOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-md cursor-zoom-out" onClick={() => setIsPreviewOpen(false)}>
                    <button className="absolute top-6 right-6 p-3 rounded-full bg-white/10 text-white"><X className="w-8 h-8" /></button>
                    <div className="relative w-full h-full p-12">
                        <Image src={activeImage || allImages[0]} alt="preview" fill sizes="100vw" className="object-contain" priority />
                    </div>
                </div>
            )}

            {isAxionalAlertOpen && (
                <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-[#020617]/95 backdrop-blur-2xl">
                    <div className="glass-panel border-2 border-emerald-500/20 rounded-[40px] p-10 max-w-md w-full text-center space-y-8">
                        <div className="w-28 h-28 mx-auto relative bg-emerald-500/10 rounded-full p-1 overflow-hidden">
                            <img src="/eir_not_found.jpg" alt="EIR" className="w-full h-full object-cover rounded-full" />
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-300">TRÁMITE VÍA AXIONAL</h3>
                            <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
                                <p className="text-[10px] uppercase font-bold text-emerald-500/40 mb-1">Código Axional</p>
                                <p className="text-2xl font-black text-amber-400 tracking-widest">{selectedVariant?.internalCode || part.internalCode}</p>
                            </div>
                            <p className="text-sm text-slate-400">Este artículo debe solicitarse a través de Axional con el código indicado.</p>
                        </div>
                        <div className="flex flex-col gap-3">
                            <button onClick={() => window.open('https://axional.quironsalud.es/webOS/desktop/', '_blank')} className="py-4 bg-emerald-500 text-white font-black rounded-2xl uppercase tracking-widest text-xs">IR A AXIONAL</button>
                            <button onClick={() => setIsAxionalAlertOpen(false)} className="py-4 bg-white/5 text-slate-400 font-bold rounded-2xl border border-white/10 uppercase tracking-widest text-xs">VOLVER</button>
                        </div>
                    </div>
                </div>
            )}

            {showDeleteConfirm && (
                <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-[#020617]/95 backdrop-blur-2xl">
                    <div className="glass-panel border-2 border-rose-500/20 rounded-[40px] p-10 max-w-sm w-full text-center space-y-8">
                        <div className="w-20 h-20 mx-auto rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500"><Trash2 className="w-10 h-10" /></div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-black text-white">¿Eliminar Registro?</h3>
                            <p className="text-sm text-slate-400">Esta acción es irreversible.</p>
                        </div>
                        <div className="flex flex-col gap-3">
                            <button onClick={handleDelete} disabled={deleting} className="py-4 bg-rose-500 text-white font-bold rounded-2xl uppercase tracking-widest text-xs">{deleting ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Confirmar'}</button>
                            <button onClick={() => setShowDeleteConfirm(false)} className="py-4 bg-white/5 text-slate-400 font-bold rounded-2xl border border-white/10 uppercase tracking-widest text-xs">Mantener</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
