export interface SparePart {
    id: string;
    name: string;
    providerRef: string;
    contact: string;
    provider: string;
    machine: string;
    services: string[];
    price: string; // The JSON has "137,00 €", so it is a string. We might want to parse it later.
    category: string;
    internalCode: string;
    commonName: string;
    imageFile: string;
    additionalImages?: string[];
}
