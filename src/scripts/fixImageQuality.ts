import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, updateDoc, doc } from "firebase/firestore";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

async function fixImageQuality() {
    console.log('🚀 Iniciando actualización de calidad de imágenes...');

    if (!firebaseConfig.projectId) {
        throw new Error('Project ID no encontrado en .env.local');
    }

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    const partsCollection = collection(db, 'parts');
    const partsSnapshot = await getDocs(partsCollection);

    console.log(`📦 Encontrados ${partsSnapshot.size} repuestos.`);

    let count = 0;
    for (const document of partsSnapshot.docs) {
        const data = document.data();
        const partRef = doc(db, 'parts', document.id);

        if (data.imageFile) {
            await updateDoc(partRef, {
                thumbnailUrl: data.imageFile
            });
        }

        count++;
        if (count % 10 === 0 || count === partsSnapshot.size) {
            console.log(`✅ Progress: ${count}/${partsSnapshot.size}...`);
        }
    }

    console.log('✨ Proceso completado con éxito.');
    process.exit(0);
}

fixImageQuality().catch((err) => {
    console.error('❌ Error durante la migración:', err);
    process.exit(1);
});
