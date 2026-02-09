'use server';

import { db } from '@/lib/firebase';
import { collection, addDoc, Timestamp, query, orderBy, getDocs } from 'firebase/firestore';

export async function saveSuggestion(content: string, userName: string) {
    try {
        await addDoc(collection(db, 'sugerencias'), {
            content,
            userName,
            createdAt: Timestamp.now(),
        });
        return { success: true };
    } catch (error: any) {
        console.error('Error saving suggestion:', error);
        return { success: false, error: error.message };
    }
}

export async function getSuggestions() {
    try {
        const q = query(collection(db, 'sugerencias'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const suggestions = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate() || new Date(),
        }));
        return { success: true, suggestions };
    } catch (error: any) {
        console.error('Error fetching suggestions:', error);
        return { success: false, error: error.message, suggestions: [] };
    }
}
