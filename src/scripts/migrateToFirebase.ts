import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, writeBatch } from "firebase/firestore";
import { readFile } from 'fs/promises';
import { join } from 'path';

const firebaseConfig = {
    apiKey: "AIzaSyDJ_GXcWDKJibdHgH5U1AojFUh0Jf2GzNA",
    authDomain: "eir-goddes.firebaseapp.com",
    projectId: "eir-goddes",
    storageBucket: "eir-goddes.firebasestorage.app",
    messagingSenderId: "115772008630",
    appId: "1:115772008630:web:2a022c2ae417fd3b6fde17",
};

async function migrate() {
    console.log('--- Starting Migration to Firestore ---');
    try {
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);

        // 1. Read local data
        const filePath = join(process.cwd(), 'src/data/spare_parts_data.json');
        const fileContent = await readFile(filePath, 'utf-8');
        const localParts = JSON.parse(fileContent);
        console.log(`Read ${localParts.length} parts from local JSON.`);

        // 2. Clear existing parts in Firestore (optional but recommended for a clean sync)
        console.log('Cleaning existing parts in Firestore...');
        const snapshot = await getDocs(collection(db, 'parts'));
        const deletePromises = snapshot.docs.map(d => deleteDoc(doc(db, 'parts', d.id)));
        await Promise.all(deletePromises);
        console.log(`Deleted ${snapshot.size} old documents.`);

        // 3. Upload parts in batches
        console.log('Uploading new parts...');
        const BATCH_SIZE = 100;
        for (let i = 0; i < localParts.length; i += BATCH_SIZE) {
            const batch = writeBatch(db);
            const slice = localParts.slice(i, i + BATCH_SIZE);

            slice.forEach((part: any) => {
                const { id, ...data } = part; // Remove local ID string
                const docRef = doc(collection(db, 'parts'));
                batch.set(docRef, {
                    ...data,
                    providerRef: (data.providerRef || '').toUpperCase(),
                    category: (data.category || 'COMPRAS').toUpperCase(),
                    createdAt: new Date(),
                });
            });

            await batch.commit();
            console.log(`Uploaded batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(localParts.length / BATCH_SIZE)}`);
        }

        console.log('✅ Migration completed successfully!');
    } catch (error: any) {
        console.error('❌ Migration failed:');
        console.error(error);
    }
}

migrate();
