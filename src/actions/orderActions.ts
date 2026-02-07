'use server';

import { db } from '@/lib/firebase';
import { collection, addDoc, Timestamp, query, orderBy, getDocs, where } from 'firebase/firestore';

export async function recordOrder(orderData: {
    partId: string;
    partName: string;
    provider: string;
    items: {
        variantId: string | null;
        name: string;
        reference: string;
        price: string;
        quantity: number;
        internalCode?: string;
    }[];
    totalItems: number;
    category: string;
}) {
    try {
        await addDoc(collection(db, 'pedidos'), {
            ...orderData,
            createdAt: Timestamp.now(),
        });
        return { success: true };
    } catch (error: any) {
        console.error('Error recording order:', error);
        return { success: false, error: error.message };
    }
}

export async function getOrders() {
    try {
        const q = query(collection(db, 'pedidos'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const orders = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate() || new Date(),
        }));
        return { success: true, orders };
    } catch (error: any) {
        console.error('Error fetching orders:', error);
        return { success: false, error: error.message, orders: [] };
    }
}
