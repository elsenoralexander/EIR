import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

async function diagnoseData() {
    console.log('Fetching parts for diagnostic...');
    const partsCollection = collection(db, 'parts');
    const partsSnapshot = await getDocs(partsCollection);

    partsSnapshot.docs.forEach(doc => {
        const data = doc.data();
        console.log(`Checking Part ID: ${doc.id}`);
        for (const [key, value] of Object.entries(data)) {
            if (value && typeof value === 'object' && !(Array.isArray(value))) {
                // Check if it's a Timestamp or something else
                if (typeof (value as any).toDate === 'function') {
                    console.log(`  - Field "${key}" is a Timestamp object.`);
                } else {
                    console.log(`  - WARNING: Field "${key}" is a complex object:`, JSON.stringify(value));
                }
            } else if (value === undefined) {
                console.log(`  - Field "${key}" is undefined!`);
            }
        }
    });
    console.log('Diagnostic complete.');
}

diagnoseData().catch(console.error);
