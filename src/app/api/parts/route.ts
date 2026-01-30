import { readFile } from 'fs/promises';
import { join } from 'path';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const filePath = join(process.cwd(), 'src/data/spare_parts_data.json');
        const fileContent = await readFile(filePath, 'utf-8');
        const data = JSON.parse(fileContent);
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to load data' }, { status: 500 });
    }
}
