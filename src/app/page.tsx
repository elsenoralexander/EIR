'use client';

import { Suspense, useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { partService } from '@/services/partService';
import { SparePart } from '@/types';
import Sidebar from '@/components/Sidebar';
import SearchBar from '@/components/SearchBar';
import PartCard from '@/components/PartCard';
import PartDetailModal from '@/components/PartDetailModal';
import { LayoutGrid, AlertCircle, Menu, X, Plus, Loader2 } from 'lucide-react';
import Link from 'next/link';

function HomeContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const serviceFilter = searchParams.get('service');
  const providerFilter = searchParams.get('provider');
  const machineFilter = searchParams.get('machine');

  const [parts, setParts] = useState<SparePart[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPart, setSelectedPart] = useState<SparePart | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Cargar datos iniciales
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await partService.fetchData();
      setParts(data);
      setLoading(false);
    }
    loadData();
  }, []);

  // Memoize filters and dynamic metadata
  const { filteredParts, services, providers, machines } = useMemo(() => {
    let results = partService.searchParts(query);

    if (serviceFilter) {
      results = results.filter(p => p.services.includes(serviceFilter));
    }

    if (providerFilter) {
      results = results.filter(p => p.provider === providerFilter);
    }

    if (machineFilter) {
      results = results.filter(p => p.machine === machineFilter);
    }

    const allParts = partService.getAllParts();
    const uniqueServices = Array.from(new Set(allParts.flatMap(p => p.services))).sort();
    const uniqueProviders = Array.from(new Set(allParts.map(p => p.provider))).filter(Boolean).sort();
    const uniqueMachines = Array.from(new Set(allParts.map(p => p.machine))).filter(Boolean).sort();

    return {
      filteredParts: results,
      services: uniqueServices,
      providers: uniqueProviders,
      machines: uniqueMachines
    };
  }, [parts, query, serviceFilter, providerFilter, machineFilter]);

  return (
    <div className="flex h-screen bg-[#020617] overflow-hidden">

      {/* Sidebar - Desktop */}
      <div className="hidden md:block h-full shrink-0 z-20">
        <Sidebar services={services} providers={providers} machines={machines} />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-[#020617]/80 backdrop-blur-md" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-72 h-full z-50 flex flex-col animate-in slide-in-from-left duration-500 ease-out">
            <div className="flex-1 overflow-y-auto">
              <Sidebar services={services} providers={providers} machines={machines} />
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative w-full z-10">
        {/* Header */}
        <header className="glass-panel border-b border-white/5 p-5 sm:p-7 flex items-center justify-between shrink-0 z-30 gap-6">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden p-2.5 text-emerald-400 hover:bg-emerald-500/10 border border-emerald-500/20 rounded-xl shrink-0 transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-4 shrink-0 md:hidden">
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-full p-1 shadow-[0_0_10px_rgba(16,185,129,0.3)]">
              <img src="/eir_logo.png" alt="Eir" className="w-8 h-8 object-cover rounded-full" />
            </div>
            <h1 className="text-xl font-display font-black tracking-tighter text-white">EIR</h1>
          </div>

          <div className="flex-1 max-w-2xl mx-auto min-w-0">
            <SearchBar />
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <Link
              href="/admin/add"
              className="group relative px-4 py-2.5 sm:px-6 sm:py-3 rounded-2xl font-display font-bold text-white transition-all active:scale-95 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-emerald-400 group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative flex items-center gap-2">
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline text-sm tracking-wide">Nuevo Repuesto</span>
              </div>
            </Link>
          </div>
        </header>

        {/* Results Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 scrollbar-hide">
          <div className="max-w-7xl mx-auto">
            {/* Page Header Detail */}
            <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-white/5">
              <div>
                <h2 className="text-3xl sm:text-4xl font-display font-black text-white tracking-tight mb-2">
                  Biblioteca de <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-300">Repuestos</span>
                </h2>
                <p className="text-emerald-500/60 font-medium text-sm tracking-widest uppercase">
                  {loading ? 'Consultando Oráculo...' : `Localizados ${filteredParts.length} repuestos divinos`}
                </p>
              </div>

            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center h-[50vh] text-emerald-500/40">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-emerald-500/20 blur-2xl animate-pulse rounded-full" />
                  <Loader2 className="w-16 h-16 animate-spin-slow relative z-10" />
                </div>
                <p className="font-display font-bold text-lg tracking-widest uppercase animate-pulse">Sincronizando con Eir...</p>
              </div>
            ) : filteredParts.length > 0 ? (
              <div className={`grid gap-8 pb-32 transition-all duration-500 ${filteredParts.length === 1
                ? 'grid-cols-1 max-w-xl mx-auto'
                : filteredParts.length === 2
                  ? 'grid-cols-1 lg:grid-cols-2 max-w-5xl mx-auto'
                  : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                }`}>
                {filteredParts.map((part, index) => (
                  <div
                    key={`${part.providerRef}-${index}`}
                    className="flex h-full"
                    style={{ animationDelay: `${index * 80}ms` }}
                  >
                    <PartCard
                      part={part}
                      onClick={setSelectedPart}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-20 text-slate-500 glass-panel rounded-[40px] border border-white/5 border-dashed">
                <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-8">
                  <AlertCircle className="w-12 h-12 text-emerald-500/30" />
                </div>
                <p className="text-2xl font-display font-black text-white mb-2 tracking-tight">El oráculo no encuentra rastro</p>
                <p className="text-sm text-slate-400 max-w-sm text-center font-medium leading-relaxed">
                  No hemos podido localizar piezas que coincidan con tu búsqueda. Intenta refinar los filtros para invocar los resultados correctos.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Detail Modal */}
      {selectedPart && (
        <PartDetailModal
          part={selectedPart}
          onClose={() => setSelectedPart(null)}
        />
      )}
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen bg-white">
      <Loader2 className="w-8 h-8 animate-spin text-sky-600" />
    </div>}>
      <HomeContent />
    </Suspense>
  );
}
