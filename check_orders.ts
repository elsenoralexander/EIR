import { db } from './src/lib/firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';

async function checkLastOrder() {
    try {
        const q = query(collection(db, 'pedidos'), orderBy('createdAt', 'desc'), limit(1));
        const snapshot = await getDocs(q);
        if (snapshot.empty) {
            console.log('No orders found in "pedidos" collection.');
            return;
        }
        const doc = snapshot.docs[0];
        console.log('Latest order ID:', doc.id);
        console.log('Data:', JSON.stringify(doc.data(), null, 2));
    } catch (error) {
        console.error('Error:', error);
    }
}

checkLastOrder();
