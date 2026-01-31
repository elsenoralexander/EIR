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

    private normalizeText(text: string): string {
        return text
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');
    }

    private initFuse() {
        this.fuse = new Fuse(this.parts, {
            keys: [
                { name: 'name', weight: 0.5 },
                { name: 'commonName', weight: 0.3 },
                { name: 'provider', weight: 0.1 },
                { name: 'machine', weight: 0.1 },
                { name: 'providerRef', weight: 0.2 }
            ],
            threshold: 0.3, // More restrictive for better relevance
            distance: 100,
            ignoreLocation: true,
            minMatchCharLength: 2,
            findAllMatches: true,
            getFn: (obj: any, path: string | string[]) => {
                const key = Array.isArray(path) ? path[0] : path;
                const value = obj[key];
                return typeof value === 'string' ? this.normalizeText(value) : value;
            }
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
            additionalImages: Array.isArray(item.additionalImages) ? item.additionalImages : [],
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

        const normalizedQuery = this.normalizeText(queryStr);
        return this.fuse.search(normalizedQuery).map(result => result.item);
    }

    getPartsByService(service: string): SparePart[] {
        return this.parts.filter(p => p.services.includes(service));
    }
}

export const partService = new PartService();
