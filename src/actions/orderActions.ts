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
        })).filter(order => order.createdAt !== null);
        return { success: true, orders };
    } catch (error: any) {
        console.error('Error fetching orders:', error);
        return { success: false, error: error.message, orders: [] };
    }
}

export async function getOrdersByPartId(partId: string) {
    try {
        console.log('Fetching orders for partId:', partId);
        const q = query(
            collection(db, 'pedidos'),
            where('partId', '==', partId)
        );
        const querySnapshot = await getDocs(q);
        const orders = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate() || new Date(),
        }));

        // Sort in memory to avoid needing a composite index
        const sortedOrders = orders.sort((a, b) =>
            b.createdAt.getTime() - a.createdAt.getTime()
        );

        console.log(`Found ${sortedOrders.length} orders for partId: ${partId}`);
        return { success: true, orders: sortedOrders };
    } catch (error: any) {
        console.error('Error fetching orders by partId:', error);
        return { success: false, error: error.message, orders: [] };
    }
}
