'use client';

import { Search, X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
// import { useDebouncedCallback } from 'use-debounce'; // Removed unused import

// Simple debounce hook implementation to avoid extra dependency if not needed, 
// but use-debounce is standard. I'll just use a timer here.

export default function SearchBar() {
    const searchParams = useSearchParams();
    const { replace } = useRouter();

    const handleSearch = (term: string) => {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set('q', term);
        } else {
            params.delete('q');
        }
        replace(`/?${params.toString()}`);
    };

    // Debounce logic
    let debounceTimer: NodeJS.Timeout;
    const debouncedSearch = (term: string) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => handleSearch(term), 300);
    };

    return (
        <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-emerald-500/50">
                <Search className="w-5 h-5" />
            </div>
            <input
                type="text"
                className="block w-full p-4 pl-12 text-sm text-white border border-white/5 rounded-2xl bg-white/5 backdrop-blur-md focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/50 transition-all placeholder:text-slate-500 shadow-inner"
                placeholder="Invocar repuesto por nombre, referencia o máquina..."
                defaultValue={searchParams.get('q')?.toString()}
                onChange={(e) => debouncedSearch(e.target.value)}
            />
        </div>
    );
}
