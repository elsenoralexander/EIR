'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createPart, updatePart } from '@/actions/partActions';
import { ArrowLeft, Package, Plus, Upload, Loader2, CheckCircle2, Save } from 'lucide-react';
import Link from 'next/link';
import { SparePart } from '@/types';

interface AddPartFormProps {
    part?: SparePart;
}

export default function AddPartForm({ part }: AddPartFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const isEditing = !!part;

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        setError('');

        const formData = new FormData(event.currentTarget);
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
            <div className="mb-10 flex items-center justify-between">
                <Link
                    href="/"
                    className="group flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-slate-400 hover:text-emerald-400 hover:border-emerald-500/30 transition-all duration-300 font-bold text-sm tracking-wide"
                >
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    Volver al Oráculo
                </Link>
                <div className="text-right">
                    <h1 className="text-4xl font-display font-black text-white tracking-tighter">
                        {isEditing ? 'Editar Repuesto' : 'Añadir Nuevo Repuesto'}
                    </h1>
                    <p className="text-emerald-500/40 text-[10px] uppercase tracking-[0.3em] font-medium mt-1">Configuración técnica de pieza</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="glass-panel rounded-[40px] border border-white/5 overflow-hidden shadow-2xl relative">
                {isEditing && <input type="hidden" name="id" value={part.id} />}
                {isEditing && <input type="hidden" name="currentImage" value={part.imageFile} />}

                <div className="p-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-emerald-500/50 uppercase tracking-[0.2em] block pl-1" htmlFor="name">
                                    Nombre Completo <span className="text-amber-500">*</span>
                                </label>
                                <input
                                    required
                                    id="name"
                                    name="name"
                                    type="text"
                                    defaultValue={part?.name}
                                    placeholder="Ej: Desfibrilador Zoll R Series..."
                                    className="w-full p-4 rounded-2xl bg-[#020617]/50 border border-white/5 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 outline-none text-white transition-all placeholder:text-slate-600 font-medium"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-emerald-500/50 uppercase tracking-[0.2em] block pl-1" htmlFor="commonName">
                                    Nombre Común / Descriptivo
                                </label>
                                <input
                                    id="commonName"
                                    name="commonName"
                                    type="text"
                                    defaultValue={part?.commonName}
                                    placeholder="Ej: Desfibrilador de transporte"
                                    className="w-full p-4 rounded-2xl bg-[#020617]/50 border border-white/5 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 outline-none text-white transition-all placeholder:text-slate-600 font-medium"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-emerald-500/50 uppercase tracking-[0.2em] block pl-1" htmlFor="providerRef">
                                        Referencia <span className="text-amber-500">*</span>
                                    </label>
                                    <input
                                        required
                                        id="providerRef"
                                        name="providerRef"
                                        type="text"
                                        defaultValue={part?.providerRef}
                                        placeholder="Cod. 12345"
                                        className="w-full p-4 font-mono text-sm leading-none bg-[#020617]/50 border border-white/5 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 outline-none text-white transition-all placeholder:text-slate-600"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-emerald-500/50 uppercase tracking-[0.2em] block pl-1" htmlFor="internalCode">
                                        Código Interno
                                    </label>
                                    <input
                                        id="internalCode"
                                        name="internalCode"
                                        type="text"
                                        defaultValue={part?.internalCode}
                                        placeholder="01-XXXXXX"
                                        className="w-full p-4 font-mono text-sm leading-none bg-[#020617]/50 border border-white/5 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 outline-none text-white transition-all placeholder:text-slate-600"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-emerald-500/50 uppercase tracking-[0.2em] block pl-1" htmlFor="price">
                                        Precio (€)
                                    </label>
                                    <div className="relative group/price">
                                        <input
                                            id="price"
                                            name="price"
                                            type="text"
                                            defaultValue={part?.price.replace(' €', '')}
                                            placeholder="85,00"
                                            className="w-full p-4 bg-[#020617]/50 border border-white/5 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 outline-none text-amber-400 font-display font-black tracking-tighter text-xl transition-all placeholder:text-slate-600"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-emerald-500/50 uppercase tracking-[0.2em] block pl-1" htmlFor="category">
                                        Categoría
                                    </label>
                                    <div className="relative">
                                        <select
                                            id="category"
                                            name="category"
                                            defaultValue={part?.category || 'COMPRAS'}
                                            className="w-full p-4 rounded-2xl bg-[#020617]/50 border border-white/5 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 outline-none text-white transition-all appearance-none font-bold text-sm"
                                        >
                                            <option value="COMPRAS">Compras</option>
                                            <option value="MANTENIMIENTO">Mantenimiento</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-emerald-500/40">
                                            <Package className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-emerald-500/50 uppercase tracking-[0.2em] block pl-1" htmlFor="provider">
                                    Proveedor <span className="text-amber-500">*</span>
                                </label>
                                <input
                                    required
                                    id="provider"
                                    name="provider"
                                    type="text"
                                    defaultValue={part?.provider}
                                    placeholder="Nombre de la empresa"
                                    className="w-full p-4 rounded-2xl bg-[#020617]/50 border border-white/5 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 outline-none text-white transition-all placeholder:text-slate-600 font-medium"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-emerald-500/50 uppercase tracking-[0.2em] block pl-1" htmlFor="machine">
                                    Equipo de Destino
                                </label>
                                <input
                                    id="machine"
                                    name="machine"
                                    type="text"
                                    defaultValue={part?.machine}
                                    placeholder="Ej: Monitor Infinity / Sin Máquina"
                                    className="w-full p-4 rounded-2xl bg-[#020617]/50 border border-white/5 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 outline-none text-white transition-all placeholder:text-slate-600 font-medium"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-emerald-500/50 uppercase tracking-[0.2em] block pl-1" htmlFor="services">
                                    Servicios (UCI, Quirófano...)
                                </label>
                                <input
                                    id="services"
                                    name="services"
                                    type="text"
                                    defaultValue={part?.services.join(', ')}
                                    placeholder="UCI, QUIROFANO, URGENCIAS"
                                    className="w-full p-4 rounded-2xl bg-[#020617]/50 border border-white/5 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 outline-none text-white transition-all placeholder:text-slate-600 font-medium"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-emerald-500/50 uppercase tracking-[0.2em] block pl-1" htmlFor="contact">
                                    Canal de Comunicación <span className="text-amber-500">*</span>
                                </label>
                                <input
                                    required
                                    id="contact"
                                    name="contact"
                                    type="text"
                                    defaultValue={part?.contact}
                                    placeholder="Email o Teléfono"
                                    className="w-full p-4 rounded-2xl bg-[#020617]/50 border border-white/5 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 outline-none text-white transition-all placeholder:text-slate-600 font-medium"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-emerald-500/50 uppercase tracking-[0.2em] block pl-1">
                                    Visualización del Producto
                                </label>
                                <div className="relative group/upload">
                                    <input
                                        id="imageFile"
                                        name="imageFile"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                            const fileName = e.target.files?.[0]?.name;
                                            const label = document.getElementById('file-label');
                                            if (label) label.textContent = fileName || 'Imagen seleccionada';
                                        }}
                                    />
                                    <label
                                        htmlFor="imageFile"
                                        className="flex flex-col items-center justify-center gap-4 p-8 w-full bg-[#020617]/50 border-2 border-dashed border-white/5 rounded-[32px] cursor-pointer hover:bg-emerald-500/5 hover:border-emerald-500/40 transition-all duration-500"
                                    >
                                        {isEditing && part.imageFile && !error && (
                                            <div className="relative w-20 h-20 rounded-2xl overflow-hidden border border-white/10 shadow-emerald-500/10 shadow-lg">
                                                <img src={part.imageFile} alt="preview" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-[#020617]/40 flex items-center justify-center opacity-0 group-hover/upload:opacity-100 transition-opacity">
                                                    <Upload className="w-5 h-5 text-white" />
                                                </div>
                                            </div>
                                        )}
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="p-3 rounded-full bg-emerald-500/10 text-emerald-400 group-hover/upload:scale-110 transition-transform duration-300">
                                                <Upload className="w-6 h-6" />
                                            </div>
                                            <span id="file-label" className="font-display font-bold text-xs uppercase tracking-widest text-emerald-500/60 group-hover/upload:text-emerald-400">
                                                {isEditing ? 'REEMPLAZAR ESENCIA' : 'INVOCAR IMAGEN'}
                                            </span>
                                            <p className="text-[9px] text-slate-600 uppercase tracking-tight">Formato JPG, PNG o WebP</p>
                                        </div>
                                    </label>
                                </div>
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

                <div className="p-10 bg-white/5 border-t border-white/5 flex items-center justify-end gap-6">
                    <Link
                        href="/"
                        className="px-8 py-3 text-slate-500 font-display font-bold uppercase tracking-widest text-xs hover:text-white transition-colors"
                    >
                        Desistir
                    </Link>
                    <button
                        disabled={loading}
                        type="submit"
                        className="relative group px-10 py-4 rounded-2xl font-display font-black text-white transition-all active:scale-95 overflow-hidden disabled:opacity-50 disabled:active:scale-100"
                    >
                        <div className={`absolute inset-0 bg-gradient-to-r ${isEditing ? 'from-emerald-600 to-emerald-400' : 'from-emerald-600 to-amber-500 animate-gradient-flow'} group-hover:scale-110 transition-transform duration-500`} />
                        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative flex items-center gap-3 text-sm tracking-widest uppercase">
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Sincronizando...
                                </>
                            ) : (
                                <>
                                    {isEditing ? <Save className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                                    {isEditing ? 'Guardar Cambios' : 'Crear Repuesto'}
                                </>
                            )}
                        </div>
                    </button>
                </div>
            </form>
        </div>
    );
}
