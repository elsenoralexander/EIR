'use client';

import { Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useRef } from 'react';
import { GlowingEffect } from './ui/glowing-effect';

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

    // Debounce logic using useRef to persist across re-renders
    const debounceTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);

    const debouncedSearch = (term: string) => {
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }
        debounceTimerRef.current = setTimeout(() => handleSearch(term), 300);
    };

    return (
        <div className="relative w-full group rounded-2xl">
            <div className="hidden sm:block rounded-[inherit]">
                <GlowingEffect
                    blur={0}
                    borderWidth={2}
                    spread={80}
                    glow
                    proximity={64}
                    inactiveZone={0.01}
                    disabled={false}
                />
            </div>
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-emerald-500/50 z-10">
                <Search className="w-5 h-5" />
            </div>
            <input
                type="text"
                className="block w-full p-4 pl-12 text-sm text-white border border-white/5 rounded-2xl bg-white/5 backdrop-blur-md focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/50 transition-all placeholder:text-slate-500 shadow-inner relative z-0"
                placeholder="Invocar repuesto por nombre, referencia o máquina..."
                defaultValue={searchParams.get('q')?.toString()}
                onChange={(e) => debouncedSearch(e.target.value)}
            />
        </div>
    );
}
