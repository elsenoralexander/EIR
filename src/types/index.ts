export interface ProductVariant {
    id: string;
    name: string;
    internalCode: string;
    providerRef?: string;
    price?: string;
}

export interface SparePart {
    id: string;
    name: string;
    providerRef: string;
    contact: string;
    provider: string;
    machine: string;
    services: string[];
    price: string;
    category: string;
    internalCode: string;
    commonName: string;
    imageFile: string;
    thumbnailUrl?: string;
    additionalImages?: string[];
    variants?: ProductVariant[];
}
