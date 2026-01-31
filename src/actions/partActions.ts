'use server';

import { db, storage } from '@/lib/firebase';
import { collection, addDoc, updateDoc, doc, Timestamp, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { revalidatePath } from 'next/cache';
import { SparePart } from '@/types';

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

        let imageURL = '';

        if (imageFile && imageFile.size > 0) {
            const bytes = await imageFile.arrayBuffer();
            const buffer = new Uint8Array(bytes);

            const fileExt = imageFile.name.split('.').pop();
            const fileName = `${Date.now()}-${name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.${fileExt}`;
            const storageRef = ref(storage, `parts/${fileName}`);

            await uploadBytes(storageRef, buffer);
            imageURL = await getDownloadURL(storageRef);
        }

        const services = servicesStr.split(',').map(s => s.trim()).filter(Boolean);

        const newPart = {
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
            imageFile: imageURL,
            createdAt: Timestamp.now(),
        };

        const docRef = await addDoc(collection(db, 'parts'), newPart);

        revalidatePath('/');
        return { success: true, id: docRef.id };
    } catch (error: any) {
        console.error('Error creating part in Firebase:', error);
        return { success: false, error: error.message || 'Error al crear el repuesto' };
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

        let imageURL = currentImage;

        if (imageFile && imageFile.size > 0) {
            const bytes = await imageFile.arrayBuffer();
            const buffer = new Uint8Array(bytes);

            const fileExt = imageFile.name.split('.').pop();
            const fileName = `${Date.now()}-${name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.${fileExt}`;
            const storageRef = ref(storage, `parts/${fileName}`);

            await uploadBytes(storageRef, buffer);
            imageURL = await getDownloadURL(storageRef);
        }

        const services = servicesStr.split(',').map(s => s.trim()).filter(Boolean);
        const partRef = doc(db, 'parts', id);

        await updateDoc(partRef, {
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
            imageFile: imageURL,
            updatedAt: Timestamp.now(),
        });

        revalidatePath('/');
        return { success: true };
    } catch (error: any) {
        console.error('Error updating part in Firebase:', error);
        return { success: false, error: error.message || 'Error al actualizar el repuesto' };
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

