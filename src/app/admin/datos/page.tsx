'use client';

import { useState, useEffect } from 'react';
import { getOrders } from '@/actions/orderActions';
import { getSuggestions } from '@/actions/suggestionActions';
import { ChevronLeft, Calendar, Package, TrendingUp, Lock, Search, Filter, Database, FileText, MessageSquare, Sparkles, Clock } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminDatosPage() {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [activeTab, setActiveTab] = useState<'pedidos' | 'sugerencias'>('pedidos');
    const [orders, setOrders] = useState<any[]>([]);
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);
    const [searchTerm, setSearchTerm] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === '9730') {
            setIsAuthenticated(true);
            fetchAllData();
        } else {
            alert('Contraseña incorrecta');
        }
    };

    const fetchAllData = async () => {
        setLoading(true);
        const [ordersRes, suggestionsRes] = await Promise.all([
            getOrders(),
            getSuggestions()
        ]);

        if (ordersRes.success) setOrders(ordersRes.orders);
        if (suggestionsRes.success) setSuggestions(suggestionsRes.suggestions);

        setLoading(false);
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchAllData();
        }
    }, [isAuthenticated]);

    const filteredOrders = orders.filter(order => {
        const orderDate = new Date(order.createdAt).toISOString().split('T')[0];
        const matchesDate = orderDate >= filterDate;
        const matchesSearch = order.partName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.provider?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesDate && matchesSearch;
    });

    // Analytics calculation
    const totalOrders = filteredOrders.length;
    const totalItems = filteredOrders.reduce((acc, order) => acc + (order.totalItems || 0), 0);
    const uniqueParts = new Set(filteredOrders.map(o => o.partId)).size;

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6">
                <div className="glass-panel border-2 border-emerald-500/20 rounded-[40px] p-10 max-w-md w-full shadow-[0_0_100px_rgba(16,185,129,0.1)] text-center space-y-8 animate-in zoom-in-95 duration-300">
                    <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                        <Lock className="w-10 h-10" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-2xl font-display font-black text-white tracking-tight">Acceso Restringido</h3>
                        <p className="text-sm text-slate-400 font-medium">Introduce la clave de acceso para visualizar los datos de pedidos.</p>
                    </div>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Clave de acceso"
                            autoFocus
                            className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-center text-xl font-display font-black text-emerald-400 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-700"
                        />
                        <button type="submit" className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-display font-black rounded-2xl transition-all uppercase tracking-widest text-xs active:scale-95 shadow-lg shadow-emerald-500/20">
                            ENTRAR AL SISTEMA
                        </button>
                    </form>
                    <Link href="/" className="inline-block text-[10px] text-slate-500 hover:text-emerald-400 uppercase tracking-widest transition-colors">Volver al Buscador</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#020617] text-white p-4 sm:p-10 font-sans">
            <div className="max-w-7xl mx-auto space-y-10">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => window.history.length > 1 ? router.back() : router.push('/')}
                            className="p-4 rounded-2xl bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-all shadow-xl group"
                        >
                            <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
                        </button>
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-display font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-300">
                                DASHBOARD DE DATOS
                            </h1>
                            <p className="text-[10px] uppercase tracking-[0.3em] font-black text-emerald-500/40">Análisis y Seguimiento de Pedidos</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 p-2 bg-white/5 rounded-3xl border border-white/10">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <input
                                type="text"
                                placeholder="Buscar pedido..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-12 pr-6 py-3 rounded-2xl bg-[#020617] border border-white/5 text-sm font-medium focus:border-emerald-500 outline-none transition-all w-full sm:w-64"
                            />
                        </div>
                        <input
                            type="date"
                            value={filterDate}
                            onChange={(e) => setFilterDate(e.target.value)}
                            className="px-4 py-3 rounded-2xl bg-[#020617] border border-white/5 text-sm font-medium focus:border-emerald-500 outline-none transition-all text-emerald-400"
                        />
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="glass-panel p-8 rounded-[40px] border border-white/5 flex items-center gap-6 shadow-2xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent" />
                        <div className="p-5 rounded-3xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
                            <TrendingUp className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-emerald-500/40 uppercase tracking-widest mb-1">Total Pedidos</p>
                            <p className="text-4xl font-display font-black">{totalOrders}</p>
                        </div>
                    </div>
                    <div className="glass-panel p-8 rounded-[40px] border border-white/5 flex items-center gap-6 shadow-2xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent" />
                        <div className="p-5 rounded-3xl bg-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform">
                            <Package className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-amber-500/40 uppercase tracking-widest mb-1">Artículos Totales</p>
                            <p className="text-4xl font-display font-black">{totalItems}</p>
                        </div>
                    </div>
                    <div className="glass-panel p-8 rounded-[40px] border border-white/5 flex items-center gap-6 shadow-2xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent" />
                        <div className="p-5 rounded-3xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
                            <Database className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-emerald-500/40 uppercase tracking-widest mb-1">Repuestos Distintos</p>
                            <p className="text-4xl font-display font-black">{uniqueParts}</p>
                        </div>
                    </div>
                </div>

                {/* Table Section */}
                <div className="glass-panel rounded-[40px] border border-white/5 overflow-hidden shadow-2xl bg-white/5">
                    <div className="p-8 border-b border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-emerald-400" />
                            <h3 className="text-lg font-display font-black text-white">HISTORIAL DETALLADO</h3>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-500/40 bg-emerald-500/5 px-4 py-1.5 rounded-full border border-emerald-500/10 uppercase tracking-widest">
                            Mostrando {filteredOrders.length} resultados
                        </span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/5">
                                    <th className="px-8 py-5 text-[10px] font-black text-emerald-500/60 uppercase tracking-widest">Fecha y Hora</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-emerald-500/60 uppercase tracking-widest">Material Solicitado</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-emerald-500/60 uppercase tracking-widest">Proveedor</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-emerald-500/60 uppercase tracking-widest">Artículos</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-emerald-500/60 uppercase tracking-widest text-right">Categoría</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-20 text-center">
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
                                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Consultando Oráculo...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredOrders.length > 0 ? filteredOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="px-8 py-6">
                                            <p className="text-xs font-bold text-white mb-1">
                                                {new Date(order.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                            </p>
                                            <p className="text-[10px] text-slate-500 font-medium">
                                                {new Date(order.createdAt).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="text-sm font-black text-emerald-400 group-hover:text-emerald-300 transition-colors">{order.partName}</p>
                                            <div className="flex flex-wrap gap-1 mt-2">
                                                {order.items?.map((item: any, i: number) => (
                                                    <span key={i} className="text-[9px] bg-white/5 px-2 py-0.5 rounded border border-white/5 text-slate-400">
                                                        {item.quantity}x {item.name.split('(')[1]?.replace(')', '') || 'Base'}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="text-xs font-bold text-slate-300">{order.provider}</p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <span className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 text-xs font-black">
                                                    {order.totalItems}
                                                </span>
                                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">unidades</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <span className={`inline-block px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${order.category === 'MANTENIMIENTO'
                                                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                                                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                                                }`}>
                                                {order.category}
                                            </span>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-20 text-center">
                                            <p className="text-slate-500 text-xs font-medium italic">No se han encontrado registros para los filtros seleccionados.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
