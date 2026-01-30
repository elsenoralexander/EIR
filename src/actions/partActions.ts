'use server';

import { writeFile, readFile } from 'fs/promises';
import { join } from 'path';
import { revalidatePath } from 'next/cache';
import { SparePart } from '@/types';

const DATA_FILE_PATH = join(process.cwd(), 'src/data/spare_parts_data.json');
const UPLOADS_DIR = join(process.cwd(), 'public/uploads');

export async function createPart(formData: FormData) {
    try {
        const name = formData.get('name') as string;
        const providerRef = formData.get('providerRef') as string;
        const contact = formData.get('contact') as string;
        const provider = formData.get('provider') as string;
        const machine = formData.get('machine') as string;
        const servicesStr = formData.get('services') as string;
        const price = formData.get('price') as string;
        const category = formData.get('category') as string;
        const internalCode = formData.get('internalCode') as string;
        const commonName = formData.get('commonName') as string;
        const imageFile = formData.get('imageFile') as File;

        let imageFileName = '';

        if (imageFile && imageFile.size > 0) {
            const bytes = await imageFile.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const fileExt = imageFile.name.split('.').pop();
            imageFileName = `/uploads/${Date.now()}-${name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.${fileExt}`;
            const path = join(UPLOADS_DIR, imageFileName.replace('/uploads/', ''));

            await writeFile(path, buffer);
        }

        const services = servicesStr.split(',').map(s => s.trim()).filter(Boolean);

        const newPart: SparePart = {
            id: 'part_' + Date.now(),
            name,
            providerRef,
            contact,
            provider,
            machine,
            services,
            price: price.includes('€') ? price : `${price} €`,
            category,
            internalCode,
            commonName,
            imageFile: imageFileName,
        };

        const fileContent = await readFile(DATA_FILE_PATH, 'utf-8');
        const parts = JSON.parse(fileContent) as SparePart[];

        parts.push(newPart);

        await writeFile(DATA_FILE_PATH, JSON.stringify(parts, null, 2));

        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error('Error creating part:', error);
        return { success: false, error: 'Error al crear el repuesto' };
    }
}

export async function updatePart(formData: FormData) {
    try {
        const id = formData.get('id') as string;
        const name = formData.get('name') as string;
        const providerRef = formData.get('providerRef') as string;
        const contact = formData.get('contact') as string;
        const provider = formData.get('provider') as string;
        const machine = formData.get('machine') as string;
        const servicesStr = formData.get('services') as string;
        const price = formData.get('price') as string;
        const category = formData.get('category') as string;
        const internalCode = formData.get('internalCode') as string;
        const commonName = formData.get('commonName') as string;
        const imageFile = formData.get('imageFile') as File;
        const currentImage = formData.get('currentImage') as string;

        let imageFileName = currentImage;

        if (imageFile && imageFile.size > 0) {
            const bytes = await imageFile.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const fileExt = imageFile.name.split('.').pop();
            imageFileName = `/uploads/${Date.now()}-${name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.${fileExt}`;
            const path = join(UPLOADS_DIR, imageFileName.replace('/uploads/', ''));

            await writeFile(path, buffer);
        }

        const services = servicesStr.split(',').map(s => s.trim()).filter(Boolean);

        const fileContent = await readFile(DATA_FILE_PATH, 'utf-8');
        let parts = JSON.parse(fileContent) as SparePart[];

        const index = parts.findIndex(p => String(p.id) === String(id));
        if (index === -1) {
            return { success: false, error: 'Repuesto no encontrado' };
        }

        parts[index] = {
            ...parts[index],
            name,
            providerRef,
            contact,
            provider,
            machine,
            services,
            price: price.includes('€') ? price : `${price} €`,
            category,
            internalCode,
            commonName,
            imageFile: imageFileName,
        };

        await writeFile(DATA_FILE_PATH, JSON.stringify(parts, null, 2));

        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error('Error updating part:', error);
        return { success: false, error: 'Error al actualizar el repuesto' };
    }
}
