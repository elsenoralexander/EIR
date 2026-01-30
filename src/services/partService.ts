import { SparePart } from '../types';
import Fuse from 'fuse.js';

type RawSparePart = {
    id?: string;
    name: string;
    providerRef: string;
    contact: string;
    provider: string;
    machine: string;
    services: string[];
    price: string;
    category: string;
    internalCode: string | number;
    commonName: string | number;
    imageFile: string | number;
};

export class PartService {
    private parts: SparePart[] = [];
    private fuse: Fuse<SparePart> | null = null;

    async fetchData(): Promise<SparePart[]> {
        try {
            const response = await fetch('/api/parts');
            const data = await response.json();
            this.parts = this.normalizeData(data);
            this.initFuse();
            return this.parts;
        } catch (error) {
            console.error('Error fetching parts:', error);
            return [];
        }
    }

    private initFuse() {
        this.fuse = new Fuse(this.parts, {
            keys: ['name', 'commonName', 'provider', 'machine', 'providerRef'],
            threshold: 0.4,
            ignoreLocation: true,
            minMatchCharLength: 2,
        });
    }

    private normalizeData(rawData: any[]): SparePart[] {
        if (!Array.isArray(rawData)) return [];

        return rawData.map(item => ({
            id: String(item.id || ''),
            name: String(item.name || ''),
            providerRef: String(item.providerRef || ''),
            contact: String(item.contact || ''),
            provider: String(item.provider || ''),
            machine: String(item.machine || ''),
            services: Array.isArray(item.services)
                ? item.services.flatMap((s: any) => typeof s === 'string' ? s.split(',').map(sub => sub.trim()) : [])
                : [],
            price: String(item.price || ''),
            category: String(item.category || ''),
            internalCode: String(item.internalCode || '').replace('NaN', ''),
            commonName: String(item.commonName || '').replace('NaN', ''),
            imageFile: String(item.imageFile || '').replace('NaN', ''),
        })).filter(part => part.name && part.name !== 'NaN');
    }

    getAllParts(): SparePart[] {
        return this.parts;
    }

    getPartById(id: string): SparePart | undefined {
        return this.parts.find(p => p.id === id);
    }

    searchParts(query: string): SparePart[] {
        if (!query) return this.parts;
        if (!this.fuse) return this.parts;
        return this.fuse.search(query).map(result => result.item);
    }

    getPartsByProvider(provider: string): SparePart[] {
        return this.parts.filter(p => p.provider === provider);
    }

    getPartsByService(service: string): SparePart[] {
        return this.parts.filter(p => p.services.includes(service));
    }
}

export const partService = new PartService();
