import { db } from '../lib/firebase';
import { collection, query, getDocs, doc, getDoc, where } from 'firebase/firestore';
import { SparePart } from '../types';
import Fuse from 'fuse.js';

export class PartService {
    private parts: SparePart[] = [];
    private fuse: Fuse<SparePart> | null = null;
    private initialized = false;

    async fetchData(): Promise<SparePart[]> {
        try {
            // First try to fetch from Firestore
            const partsCollection = collection(db, 'parts');
            const partsSnapshot = await getDocs(partsCollection);

            if (!partsSnapshot.empty) {
                this.parts = partsSnapshot.docs.map(doc => ({
                    ...doc.data(),
                    id: doc.id
                })) as SparePart[];
            } else {
                // Fallback or empty state
                this.parts = [];
            }

            this.initFuse();
            this.initialized = true;
            return this.parts;
        } catch (error) {
            console.error('Error fetching parts from Firestore:', error);
            // Fallback to local API if Firebase fails (useful during setup)
            try {
                const response = await fetch('/api/parts');
                const data = await response.json();
                this.parts = this.normalizeData(data);
                this.initFuse();
                return this.parts;
            } catch (localError) {
                return [];
            }
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
            services: Array.isArray(item.services) ? item.services : [],
            price: String(item.price || ''),
            category: String(item.category || ''),
            internalCode: String(item.internalCode || ''),
            commonName: String(item.commonName || ''),
            imageFile: String(item.imageFile || ''),
        }));
    }

    getAllParts(): SparePart[] {
        return this.parts;
    }

    getPartById(id: string): SparePart | undefined {
        return this.parts.find(p => p.id === id);
    }

    searchParts(queryStr: string): SparePart[] {
        if (!queryStr) return this.parts;
        if (!this.fuse) return this.parts;
        return this.fuse.search(queryStr).map(result => result.item);
    }

    getPartsByService(service: string): SparePart[] {
        return this.parts.filter(p => p.services.includes(service));
    }
}

export const partService = new PartService();
