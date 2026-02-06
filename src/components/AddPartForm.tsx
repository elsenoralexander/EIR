'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createPart, updatePart } from '@/actions/partActions';
import { ArrowLeft, Package, Plus, Upload, Loader2, CheckCircle2, Save } from 'lucide-react';
import { GlowingEffect } from './ui/glowing-effect';
import Link from 'next/link';
import { SparePart, ProductVariant } from '@/types';
import CustomSelector from './CustomSelector';
import { partService } from '@/services/partService';
import { useEffect } from 'react';
import { compressImage, compressImages } from '@/utils/imageUtils';

interface AddPartFormProps {
    part?: SparePart;
}

export default function AddPartForm({ part }: AddPartFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [options, setOptions] = useState<{
        providers: string[];
        machines: string[];
        services: string[];
    }>({ providers: [], machines: [], services: [] });

    // Image states
    const [primaryFile, setPrimaryFile] = useState<File | null>(null);
    const [primaryPreview, setPrimaryPreview] = useState<string | null>(null);
    const [extraFiles, setExtraFiles] = useState<File[]>([]);
    const [extraPreviews, setExtraPreviews] = useState<string[]>([]);
    const [compressing, setCompressing] = useState(false);
    const [variants, setVariants] = useState<ProductVariant[]>(
        part?.variants?.map(v => ({ ...v, id: v.id || crypto.randomUUID() })) || []
    );

    useEffect(() => {
        const loadOptions = async () => {
            try {
                await partService.fetchData();
                setOptions({
                    providers: partService.getUniqueProviders(),
                    machines: partService.getUniqueMachines(),
                    services: partService.getUniqueServices()
                });
            } catch (err) {
                console.error('Error loading options:', err);
            }
        };
        loadOptions();
    }, []);

    const isEditing = !!part;

    const addVariant = () => {
        setVariants([...variants, { id: crypto.randomUUID(), name: '', internalCode: '', providerRef: '', price: '' }]);
    };

    const removeVariant = (index: number) => {
        setVariants(variants.filter((_, i) => i !== index));
    };

    const updateVariant = (index: number, field: keyof ProductVariant, value: string) => {
        const newVariants = [...variants];
        newVariants[index] = { ...newVariants[index], [field]: value };
        setVariants(newVariants);
    };

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        setError('');

        const formData = new FormData(event.currentTarget);

        // Use compressed images if available
        if (primaryFile) {
            formData.set('imageFile', primaryFile);
        }

        if (extraFiles.length > 0) {
            formData.delete('additionalImages');
            extraFiles.forEach(file => formData.append('additionalImages', file));
        }

        // Add variants
        formData.set('variants', JSON.stringify(variants));

        const result = isEditing ? await updatePart(formData) : await createPart(formData);

        if (result.success) {
            setSuccess(true);
            setTimeout(() => {
                router.push('/');
                router.refresh();
            }, 1500);
        } else {
            setError(result.error || 'Ocurrió un error');
            setLoading(false);
        }
    }

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center p-16 text-center glass-panel rounded-[40px] border border-emerald-500/30 shadow-2xl animate-in zoom-in-95 duration-500">
                <div className="relative mb-6">
                    <div className="absolute inset-0 bg-emerald-500/20 blur-2xl animate-pulse rounded-full" />
                    <CheckCircle2 className="w-20 h-20 text-emerald-400 relative z-10" />
                </div>
                <h2 className="text-3xl font-display font-black text-white tracking-tight mb-2">
                    {isEditing ? '¡Esencia Actualizada!' : '¡Invocación Exitosa!'}
                </h2>
                <p className="text-emerald-500/60 font-medium tracking-wide">El oráculo ha registrado los cambios correctamente.</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto pb-32">
            <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="w-full sm:order-2 sm:text-right">
                    <h1 className="text-3xl sm:text-4xl font-display font-black text-white tracking-tighter">
                        {isEditing ? 'Editar Repuesto' : 'Añadir Nuevo Repuesto'}
                    </h1>
                    <p className="text-emerald-500/40 text-[10px] uppercase tracking-[0.3em] font-medium mt-1">Configuración técnica de pieza</p>
                </div>

                <div className="relative rounded-2xl group/btn w-fit sm:order-1">
                    <GlowingEffect
                        blur={0}
                        borderWidth={2}
                        spread={40}
                        glow
                        proximity={64}
                        inactiveZone={0.01}
                        disabled={false}
                    />
                    <Link
                        href="/"
                        className="relative z-10 flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white/5 border border-white/10 transition-all duration-300 group-hover/btn:bg-white/10"
                    >
                        <ArrowLeft className="w-4 h-4 text-emerald-400 transition-transform group-hover/btn:-translate-x-1" />
                        <span className="font-display font-black text-xs tracking-[0.15em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-300">
                            Volver al Oráculo
                        </span>
                    </Link>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="glass-panel rounded-[40px] border border-white/5 overflow-hidden shadow-2xl relative">
                {isEditing && <input type="hidden" name="id" value={part.id} />}
                {isEditing && <input type="hidden" name="currentImage" value={part.imageFile} />}

                <div className="p-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-8">
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-300 uppercase tracking-[0.25em] block pl-1 mb-1" htmlFor="name">
                                    Nombre Completo <span className="text-amber-500">*</span>
                                </label>
                                <div className="relative rounded-2xl group/input">
                                    <GlowingEffect
                                        blur={0}
                                        borderWidth={2}
                                        spread={40}
                                        glow
                                        proximity={64}
                                        inactiveZone={0.01}
                                        disabled={false}
                                    />
                                    <input
                                        required
                                        id="name"
                                        name="name"
                                        type="text"
                                        defaultValue={part?.name}
                                        placeholder="Ej: Desfibrilador Zoll R Series..."
                                        className="w-full p-4 rounded-2xl bg-[#020617]/50 border border-white/5 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 outline-none text-white transition-all placeholder:text-slate-600 font-medium relative z-10"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-300 uppercase tracking-[0.25em] block pl-1 mb-1" htmlFor="commonName">
                                    Nombre Común / Descriptivo
                                </label>
                                <div className="relative rounded-2xl group/input">
                                    <GlowingEffect
                                        blur={0}
                                        borderWidth={2}
                                        spread={40}
                                        glow
                                        proximity={64}
                                        inactiveZone={0.01}
                                        disabled={false}
                                    />
                                    <input
                                        id="commonName"
                                        name="commonName"
                                        type="text"
                                        defaultValue={part?.commonName}
                                        placeholder="Ej: Desfibrilador de transporte"
                                        className="w-full p-4 rounded-2xl bg-[#020617]/50 border border-white/5 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 outline-none text-white transition-all placeholder:text-slate-600 font-medium relative z-10"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-300 uppercase tracking-[0.25em] block pl-1 mb-1" htmlFor="providerRef">
                                        Referencia <span className="text-amber-500">*</span>
                                    </label>
                                    <div className="relative rounded-2xl group/input font-mono">
                                        <GlowingEffect
                                            blur={0}
                                            borderWidth={2}
                                            spread={40}
                                            glow
                                            proximity={64}
                                            inactiveZone={0.01}
                                            disabled={false}
                                        />
                                        <input
                                            required
                                            id="providerRef"
                                            name="providerRef"
                                            type="text"
                                            defaultValue={part?.providerRef}
                                            placeholder="Cod. 12345"
                                            className="w-full p-4 font-mono text-sm leading-none bg-[#020617]/50 border border-white/5 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 outline-none text-white transition-all placeholder:text-slate-600 relative z-10 rounded-2xl"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-300 uppercase tracking-[0.25em] block pl-1 mb-1" htmlFor="internalCode">
                                        Código Axional
                                    </label>
                                    <div className="relative rounded-2xl group/input font-mono">
                                        <GlowingEffect
                                            blur={0}
                                            borderWidth={2}
                                            spread={40}
                                            glow
                                            proximity={64}
                                            inactiveZone={0.01}
                                            disabled={false}
                                        />
                                        <input
                                            id="internalCode"
                                            name="internalCode"
                                            type="text"
                                            defaultValue={part?.internalCode}
                                            placeholder="01-XXXXXX"
                                            className="w-full p-4 font-mono text-sm leading-none bg-[#020617]/50 border border-white/5 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 outline-none text-white transition-all placeholder:text-slate-600 relative z-10 rounded-2xl"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-300 uppercase tracking-[0.25em] block pl-1 mb-1" htmlFor="price">
                                        Precio (€)
                                    </label>
                                    <div className="relative group/price rounded-2xl">
                                        <GlowingEffect
                                            blur={0}
                                            borderWidth={2}
                                            spread={40}
                                            glow
                                            proximity={64}
                                            inactiveZone={0.01}
                                            disabled={false}
                                        />
                                        <input
                                            id="price"
                                            name="price"
                                            type="text"
                                            defaultValue={String(part?.price || '').replace(' €', '')}
                                            placeholder="85,00"
                                            className="w-full p-4 bg-[#020617]/50 border border-white/5 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 outline-none text-amber-400 font-display font-black tracking-tighter text-xl transition-all placeholder:text-slate-600 relative z-10 rounded-2xl"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-300 uppercase tracking-[0.25em] block pl-1 mb-1" htmlFor="category">
                                        Categoría
                                    </label>
                                    <div className="relative rounded-2xl group/input">
                                        <GlowingEffect
                                            blur={0}
                                            borderWidth={2}
                                            spread={40}
                                            glow
                                            proximity={64}
                                            inactiveZone={0.01}
                                            disabled={false}
                                        />
                                        <select
                                            id="category"
                                            name="category"
                                            defaultValue={part?.category || 'COMPRAS'}
                                            className="w-full p-4 rounded-2xl bg-[#020617]/50 border border-white/5 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 outline-none text-white transition-all appearance-none font-bold text-sm relative z-10"
                                        >
                                            <option value="COMPRAS">Compras</option>
                                            <option value="MANTENIMIENTO">Mantenimiento</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-emerald-500/40 z-20">
                                            <Package className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <CustomSelector
                                label="Proveedor"
                                name="provider"
                                required
                                options={options.providers}
                                defaultValue={part?.provider}
                                placeholder="Seleccionar o crear nuevo..."
                            />

                            <CustomSelector
                                label="Equipo de Destino"
                                name="machine"
                                options={options.machines}
                                defaultValue={part?.machine}
                                placeholder="Ej: Monitor Infinity / Sin Máquina"
                            />

                            <CustomSelector
                                label="Ámbitos de Aplicación"
                                name="services"
                                options={options.services}
                                defaultValue={part?.services}
                                multiple
                                placeholder="Añadir servicios..."
                            />

                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-300 uppercase tracking-[0.25em] block pl-1 mb-1" htmlFor="contact">
                                    Canal de Comunicación <span className="text-amber-500">*</span>
                                </label>
                                <div className="relative rounded-2xl group/input">
                                    <GlowingEffect
                                        blur={0}
                                        borderWidth={2}
                                        spread={40}
                                        glow
                                        proximity={64}
                                        inactiveZone={0.01}
                                        disabled={false}
                                    />
                                    <input
                                        required
                                        id="contact"
                                        name="contact"
                                        type="text"
                                        defaultValue={part?.contact}
                                        placeholder="Email o Teléfono"
                                        className="w-full p-4 rounded-2xl bg-[#020617]/50 border border-white/5 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 outline-none text-white transition-all placeholder:text-slate-600 font-medium relative z-10"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[11px] font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-300 uppercase tracking-[0.25em] block pl-1 mb-1">
                                    Imagen Principal
                                </label>
                                <div className="relative group/upload">
                                    <input
                                        id="imageFile"
                                        name="imageFile"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (!file) return;

                                            setCompressing(true);
                                            const compressed = await compressImage(file);
                                            setPrimaryFile(compressed);
                                            setPrimaryPreview(URL.createObjectURL(compressed));
                                            setCompressing(false);

                                            const label = document.getElementById('file-label');
                                            if (label) label.textContent = compressed.name;
                                        }}
                                    />
                                    <label
                                        htmlFor="imageFile"
                                        className="flex flex-col items-center justify-center gap-4 p-8 w-full bg-[#020617]/50 border-2 border-dashed border-white/5 rounded-[32px] cursor-pointer hover:bg-emerald-500/5 hover:border-emerald-500/40 transition-all duration-500 overflow-hidden relative"
                                    >
                                        {(primaryPreview || (isEditing && part?.imageFile)) && (
                                            <div className="absolute inset-0 z-0">
                                                <img
                                                    src={primaryPreview || part?.imageFile}
                                                    alt="preview"
                                                    className="w-full h-full object-cover opacity-20 grayscale"
                                                />
                                                <div className="absolute inset-0 bg-[#020617]/60" />
                                            </div>
                                        )}
                                        {((isEditing && part?.imageFile) || primaryPreview) && (
                                            <div className="relative w-24 h-24 rounded-2xl overflow-hidden border border-white/10 shadow-emerald-500/10 shadow-lg mb-2 z-10">
                                                <img src={primaryPreview || part?.imageFile} alt="primary" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <div className="p-3 rounded-full bg-white/20 backdrop-blur-md">
                                                        <Upload className="w-6 h-6 text-white" />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        <div className="flex flex-col items-center gap-2 text-center relative z-10">
                                            <div className="p-3 rounded-full bg-emerald-500/10 text-emerald-400 group-hover/upload:scale-110 transition-transform duration-300">
                                                <Upload className="w-6 h-6" />
                                            </div>
                                            <span id="file-label" className="font-display font-bold text-[10px] uppercase tracking-widest text-emerald-500/60 group-hover/upload:text-emerald-400">
                                                {compressing ? 'COMPRIMIENDO...' : (isEditing ? 'REEMPLAZAR PRINCIPAL' : 'IMAGEN PRINCIPAL')}
                                            </span>
                                            {primaryPreview && !compressing && (
                                                <span className="text-[9px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                                                    LISTA PARA SUBIR
                                                </span>
                                            )}
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between pl-1">
                                    <label className="text-[11px] font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-300 uppercase tracking-[0.25em] block">
                                        Galería Adicional
                                    </label>
                                    <span className="text-[9px] text-slate-500 font-mono uppercase tracking-tighter">Varias vistas</span>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        id="additionalImages"
                                        name="additionalImages"
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        className="hidden"
                                        onChange={async (e) => {
                                            const files = e.target.files;
                                            if (!files || files.length === 0) return;

                                            setCompressing(true);
                                            const compressed = await compressImages(files);
                                            setExtraFiles(prev => [...prev, ...compressed]);

                                            const newPreviews = compressed.map(f => URL.createObjectURL(f));
                                            setExtraPreviews(prev => [...prev, ...newPreviews]);

                                            setCompressing(false);

                                            const label = document.getElementById('additional-label');
                                            if (label) label.textContent = `${extraFiles.length + compressed.length} imágenes listas`;
                                        }}
                                    />

                                    <label
                                        htmlFor="additionalImages"
                                        className="flex flex-col items-center justify-center gap-3 p-6 bg-white/5 border border-white/5 rounded-[24px] cursor-pointer hover:bg-amber-500/5 hover:border-amber-500/30 transition-all group/extra h-full aspect-square"
                                    >
                                        <Plus className="w-5 h-5 text-amber-500/40 group-hover/extra:text-amber-400 transition-colors" />
                                        <span id="additional-label" className="text-[9px] font-bold text-slate-500 uppercase tracking-widest text-center">
                                            Añadir Vistas
                                        </span>
                                    </label>
                                    {/* Previews of new files */}
                                    {extraPreviews.map((url, idx) => (
                                        <div key={`new-${idx}`} className="relative group/thumb w-full aspect-square rounded-[20px] overflow-hidden border border-emerald-500/30">
                                            <img src={url} alt="preview" className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setExtraFiles(prev => prev.filter((_, i) => i !== idx));
                                                    setExtraPreviews(prev => prev.filter((_, i) => i !== idx));
                                                }}
                                                className="absolute top-1 right-1 p-1.5 rounded-full bg-rose-500 text-white opacity-0 group-hover/thumb:opacity-100 transition-opacity"
                                            >
                                                <Plus className="w-3 h-3 rotate-45" />
                                            </button>
                                        </div>
                                    ))}

                                    {isEditing && part?.additionalImages && part?.additionalImages.length > 0 && (
                                        <div className="contents">
                                            {part.additionalImages.map((img, idx) => (
                                                <div key={idx} className="relative w-full aspect-square rounded-[20px] overflow-hidden border border-white/5 opacity-60">
                                                    <img src={img} alt={`extra-${idx}`} className="w-full h-full object-cover grayscale" />
                                                    <div className="absolute inset-0 bg-[#020617]/40 flex items-center justify-center">
                                                        <span className="text-[8px] font-bold text-white/40 uppercase tracking-widest">Existente</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                {isEditing && (
                                    <>
                                        <input type="hidden" name="id" value={part.id} />
                                        <input type="hidden" name="currentImage" value={part.imageFile} />
                                        <input type="hidden" name="currentThumb" value={part.thumbnailUrl || ''} />
                                        <input type="hidden" name="currentAdditionalImages" value={JSON.stringify(part.additionalImages || [])} />
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="mt-10 p-5 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl text-xs font-bold uppercase tracking-widest flex items-center gap-3">
                            <CheckCircle2 className="w-5 h-5 opacity-50 rotate-180" />
                            {error}
                        </div>
                    )}
                </div>

                {/* Variants Section */}
                <div className="p-10 border-t border-white/5 space-y-8 bg-black/20">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-display font-black text-white tracking-tight">Variantes / Tamaños</h3>
                            <p className="text-emerald-500/40 text-[10px] uppercase tracking-[0.3em] font-medium mt-1">Configuración de piezas específicas</p>
                        </div>
                        <button
                            type="button"
                            onClick={addVariant}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500/20 transition-all active:scale-95"
                        >
                            <Plus className="w-4 h-4" />
                            Añadir Variante
                        </button>
                    </div>

                    <div className="space-y-4">
                        {variants.map((variant, index) => (
                            <div key={index} className="grid grid-cols-1 sm:grid-cols-5 gap-4 p-6 rounded-3xl bg-white/5 border border-white/5 relative group/variant animate-in slide-in-from-top-2 duration-300">
                                <div className="sm:col-span-2 space-y-2">
                                    <label className="text-[9px] font-black text-emerald-500/40 uppercase tracking-[0.2em] block pl-1">Nombre Variante (Ej: Pequeño)</label>
                                    <input
                                        type="text"
                                        value={variant.name}
                                        onChange={(e) => updateVariant(index, 'name', e.target.value)}
                                        placeholder="Descripción"
                                        className="w-full p-3 rounded-xl bg-[#020617]/50 border border-white/5 focus:border-emerald-500/50 outline-none text-white text-sm transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-emerald-500/40 uppercase tracking-[0.2em] block pl-1">Referencia</label>
                                    <input
                                        type="text"
                                        value={variant.providerRef || ''}
                                        onChange={(e) => updateVariant(index, 'providerRef', e.target.value)}
                                        placeholder="Cod. Var"
                                        className="w-full p-3 rounded-xl bg-[#020617]/50 border border-white/5 focus:border-emerald-500/50 outline-none text-emerald-400 font-mono text-xs transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-emerald-500/40 uppercase tracking-[0.2em] block pl-1">Código Axional</label>
                                    <input
                                        type="text"
                                        value={variant.internalCode}
                                        onChange={(e) => updateVariant(index, 'internalCode', e.target.value)}
                                        placeholder="01-XXXX"
                                        className="w-full p-3 rounded-xl bg-[#020617]/50 border border-white/5 focus:border-emerald-500/50 outline-none text-emerald-400 font-mono text-xs transition-all"
                                    />
                                </div>
                                <div className="flex items-end justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => removeVariant(index)}
                                        className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 transition-all"
                                    >
                                        <Plus className="w-5 h-5 rotate-45" />
                                    </button>
                                </div>
                            </div>
                        ))}

                        {variants.length === 0 && (
                            <div className="text-center py-10 border-2 border-dashed border-white/5 rounded-[30px]">
                                <p className="text-slate-500 text-xs font-medium italic">No hay variantes definidas para este repuesto.</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-10 bg-white/5 border-t border-white/5 flex flex-col sm:flex-row items-center sm:justify-end gap-6">
                    <div className="relative rounded-2xl group/submit w-full sm:w-auto order-1 sm:order-2">
                        <GlowingEffect
                            blur={0}
                            borderWidth={2}
                            spread={40}
                            glow
                            proximity={64}
                            inactiveZone={0.01}
                            disabled={loading || compressing}
                        />
                        <button
                            disabled={loading || compressing}
                            type="submit"
                            className="relative z-10 flex items-center justify-center gap-3 w-full sm:w-auto px-10 py-4 rounded-2xl bg-white/5 border border-white/10 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 group-hover/submit:bg-white/10"
                        >
                            <div className="flex items-center gap-3 text-sm font-display font-black tracking-widest uppercase">
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin text-emerald-400" />
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-300">
                                            Sincronizando...
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        {isEditing ? <Save className="w-5 h-5 text-emerald-400" /> : <Plus className="w-5 h-5 text-emerald-400" />}
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-300">
                                            {isEditing ? 'Guardar Cambios' : 'Crear Repuesto'}
                                        </span>
                                    </>
                                )}
                            </div>
                        </button>
                    </div>
                    <Link
                        href="/"
                        className="w-full sm:w-auto text-center px-8 py-3 text-slate-500 font-display font-bold uppercase tracking-widest text-xs hover:text-white transition-colors order-2 sm:order-1"
                    >
                        Desistir
                    </Link>
                </div>
            </form>
        </div>
    );
}
