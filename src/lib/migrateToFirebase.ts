// This script is meant to be run in a Node environment or via a temporary API route
// Since we are in a Next.js environment, we'll create a utility that can be called.

import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function migrateLocalDataToFirestore() {
    try {
        const filePath = join(process.cwd(), 'src/data/spare_parts_data.json');
        const fileContent = await readFile(filePath, 'utf-8');
        const parts = JSON.parse(fileContent);

        console.log(`Starting migration of ${parts.length} parts...`);

        const partsCollection = collection(db, 'parts');

        for (const part of parts) {
            // Check if part already exists by providerRef to avoid duplicates
            const q = query(partsCollection, where("providerRef", "==", part.providerRef));
            const existing = await getDocs(q);

            if (existing.empty) {
                // Remove local id to let Firestore generate one, or keep it if preferred
                const { id, ...partData } = part;
                await addDoc(partsCollection, partData);
                console.log(`Migrated: ${part.name}`);
            } else {
                console.log(`Skipped (already exists): ${part.name}`);
            }
        }

        console.log('Migration complete!');
        return { success: true, count: parts.length };
    } catch (error) {
        console.error('Migration failed:', error);
        return { success: false, error };
    }
}
