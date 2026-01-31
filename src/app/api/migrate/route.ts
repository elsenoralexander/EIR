import { NextResponse } from 'next/server';
import { migrateLocalDataToFirestore } from '@/lib/migrateToFirebase';

export async function POST() {
    // Basic protection - could be improved with auth
    try {
        const result = await migrateLocalDataToFirestore();
        return NextResponse.json(result);
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
