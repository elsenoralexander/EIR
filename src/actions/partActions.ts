'use server';

import { db } from '@/lib/firebase';
import { collection, addDoc, updateDoc, doc, Timestamp, deleteDoc } from 'firebase/firestore';
import { uploadToImgBB } from '@/utils/imgbb';
import { revalidatePath } from 'next/cache';
import { SparePart } from '@/types';
import { normalizeProvider, normalizeService, normalizeMachine } from '@/utils/normalization';

export async function createPart(formData: FormData) {
    try {
        const name = formData.get('name') as string;
        const providerRef = formData.get('providerRef') as string;
        const contact = formData.get('contact') as string;
        const provider = normalizeProvider(formData.get('provider') as string);
        const machine = normalizeMachine(formData.get('machine') as string);
        const rawServices = formData.getAll('services').map(s => s.toString());
        const services = Array.from(new Set(rawServices.flatMap(s => normalizeService(s)))).sort();
        const price = formData.get('price') as string;
        const category = (formData.get('category') as string || 'COMPRAS').toUpperCase();
        const internalCode = (formData.get('internalCode') as string || '').toUpperCase();
        const commonName = formData.get('commonName') as string;

        // Primary and additional images
        const imageFile = formData.get('imageFile') as File;
        const additionalImagesFiles = formData.getAll('additionalImages') as File[];

        let imageURL = '';
        const additionalImages: string[] = [];

        // Upload primary image
        if (imageFile && imageFile.size > 0) {
            imageURL = await uploadToImgBB(imageFile);
        }

        // Upload additional images
        for (const file of additionalImagesFiles) {
            if (file && file.size > 0) {
                const url = await uploadToImgBB(file);
                additionalImages.push(url);
            }
        }

        const newPart = {
            name,
            providerRef: providerRef.toUpperCase(),
            contact,
            provider,
            machine,
            services,
            price: price.includes('€') ? price : `${price} €`,
            category,
            internalCode,
            commonName,
            imageFile: imageURL,
            additionalImages,
            createdAt: Timestamp.now(),
        };

        const docRef = await addDoc(collection(db, 'parts'), newPart);

        revalidatePath('/');
        return { success: true, id: docRef.id };
    } catch (error: any) {
        console.error('Error creating part in Firebase:', error);

        let errorMessage = 'Error al crear el repuesto';
        if (error.message?.includes('ImgBB')) {
            errorMessage = error.message;
        }

        return { success: false, error: errorMessage };
    }
}

export async function updatePart(formData: FormData) {
    try {
        const id = formData.get('id') as string;
        const name = formData.get('name') as string;
        const providerRef = formData.get('providerRef') as string;
        const contact = formData.get('contact') as string;
        const provider = normalizeProvider(formData.get('provider') as string);
        const machine = normalizeMachine(formData.get('machine') as string);
        const rawServices = formData.getAll('services').map(s => s.toString());
        const services = Array.from(new Set(rawServices.flatMap(s => normalizeService(s)))).sort();
        const price = formData.get('price') as string;
        const category = (formData.get('category') as string || 'COMPRAS').toUpperCase();
        const internalCode = (formData.get('internalCode') as string || '').toUpperCase();
        const commonName = formData.get('commonName') as string;
        const currentImage = formData.get('currentImage') as string;
        const currentAdditionalImages = JSON.parse(formData.get('currentAdditionalImages') as string || '[]');

        // Primary and additional images from form
        const imageFile = formData.get('imageFile') as File;
        const additionalImagesFiles = formData.getAll('additionalImages') as File[];

        let imageURL = currentImage;
        const additionalImages: string[] = [...currentAdditionalImages];

        // Upload primary image if changed
        if (imageFile && imageFile.size > 0) {
            imageURL = await uploadToImgBB(imageFile);
        }

        // Upload NEW additional images
        for (const file of additionalImagesFiles) {
            if (file && file.size > 0) {
                const url = await uploadToImgBB(file);
                additionalImages.push(url);
            }
        }

        const partRef = doc(db, 'parts', id);

        await updateDoc(partRef, {
            name,
            providerRef: providerRef.toUpperCase(),
            contact,
            provider,
            machine,
            services,
            price: price.includes('€') ? price : `${price} €`,
            category,
            internalCode,
            commonName,
            imageFile: imageURL,
            additionalImages,
            updatedAt: Timestamp.now(),
        });

        revalidatePath('/');
        return { success: true };
    } catch (error: any) {
        console.error('Error updating part in Firebase:', error);

        let errorMessage = 'Error al actualizar el repuesto';
        if (error.message?.includes('ImgBB')) {
            errorMessage = error.message;
        }

        return { success: false, error: errorMessage };
    }
}

export async function deletePart(id: string) {
    try {
        const partRef = doc(db, 'parts', id);
        await deleteDoc(partRef);

        revalidatePath('/');
        return { success: true };
    } catch (error: any) {
        console.error('Error deleting part from Firebase:', error);
        return { success: false, error: error.message || 'Error al eliminar el repuesto' };
    }
}

