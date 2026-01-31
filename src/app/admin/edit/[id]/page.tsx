import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import AddPartForm from '@/components/AddPartForm';
import { SparePart } from '@/types';
import { redirect } from 'next/navigation';

async function getPart(id: string): Promise<SparePart | undefined> {
    try {
        const docRef = doc(db, 'parts', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return {
                id: docSnap.id,
                ...docSnap.data()
            } as SparePart;
        }
        return undefined;
    } catch (error) {
        console.error('Error fetching part from Firestore:', error);
        return undefined;
    }
}

export default async function AdminEditPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const part = await getPart(params.id);

    if (!part) {
        redirect('/');
    }

    return (
        <div className="min-h-screen bg-[#020617] overflow-y-auto">
            {/* Background Decorative Glows */}
            <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none z-0" />
            <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-amber-500/5 blur-[120px] rounded-full pointer-events-none z-0" />

            <header className="glass-panel border-b border-white/5 p-6 sm:p-8 flex items-center justify-center shrink-0 mb-12 relative z-10">
                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full group-hover:bg-emerald-500/40 transition-all duration-500" />
                        <div className="relative w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 rounded-full p-1 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                            <img src="/eir_logo.png" alt="Eir" className="w-full h-full object-cover rounded-full" />
                        </div>
                    </div>
                    <div>
                        <h1 className="text-2xl font-display font-black text-white tracking-tight">
                            EIR <span className="text-emerald-500/60 font-medium">ADMIN</span>
                        </h1>
                        <p className="text-[10px] uppercase tracking-[0.3em] font-medium text-emerald-500/40">Edición de Repuestos</p>
                    </div>
                </div>
            </header>

            <main className="px-6 relative z-10">
                <AddPartForm part={part} />
            </main>
        </div>
    );
}
