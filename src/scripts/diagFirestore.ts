import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, limit, query } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDJ_GXcWDKJibdHgH5U1AojFUh0Jf2GzNA",
    authDomain: "eir-goddes.firebaseapp.com",
    projectId: "eir-goddes",
    storageBucket: "eir-goddes.firebasestorage.app",
    messagingSenderId: "115772008630",
    appId: "1:115772008630:web:2a022c2ae417fd3b6fde17",
};

async function diagFirestore() {
    console.log('--- Firestore Diagnosis ---');
    try {
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);

        console.log('Attempting to read "parts" collection...');
        const q = query(collection(db, 'parts'), limit(5));
        const snapshot = await getDocs(q);

        console.log(`✅ Success! Found ${snapshot.size} documents.`);
        snapshot.forEach(doc => {
            console.log(`- ID: ${doc.id}, Name: ${doc.data().name}`);
        });

        if (snapshot.size === 0) {
            console.log('⚠️ The collection is EMPTY. This is why "edit" fails to find IDs like "1".');
        }
    } catch (error: any) {
        console.error('❌ Firestore Error:');
        console.error('Code:', error.code);
        console.error('Message:', error.message);
    }
}

diagFirestore();
