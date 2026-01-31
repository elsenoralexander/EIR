export function normalizeProvider(name: string): string {
    const upper = name.trim().toUpperCase();
    if (upper.includes('ONE DIRECT')) return 'ONE DIRECT COMUNICACIONES SL';
    if (upper.includes('SURVIVAL')) return 'SURVIVAL SOLUTIONS';
    if (upper === 'NAN' || upper === '') return 'OTROS';
    return upper;
}

export function normalizeService(service: any): string[] {
    if (!service) return [];

    const input = String(service).toUpperCase().trim();
    if (input === 'NAN' || input === '') return [];

    // Initial split by common separators
    let parts = input.split(/[,\/;]+/).map(p => p.trim());

    const result = new Set<string>();

    parts.forEach(p => {
        // Special case: known multi-word services
        if (p === 'CONSULTAS EXTERNAS' || p === 'EXTERNA' || p === 'EXT') {
            result.add('CONSULTAS EXTERNAS');
            return;
        }

        // Potential combination like "URGENCIAS UCI"
        if (p.includes(' ')) {
            const subParts = p.split(/\s+/).filter(sp => sp.length > 2);
            if (subParts.length > 1) {
                subParts.forEach(sp => {
                    if (sp === 'URG' || sp === 'URGENCIAS') result.add('URGENCIAS');
                    else result.add(sp);
                });
                return;
            }
        }

        if (p === 'URG' || p === 'URGENCIAS') result.add('URGENCIAS');
        else if (p !== 'NAN' && p !== '') result.add(p);
    });

    return Array.from(result).sort();
}

export function normalizeMachine(machine: string | null | undefined): string {
    const upper = (machine || '').trim().toUpperCase();
    if (upper === 'NAN' || upper === '' || upper === 'SIN MÁQUINA') return 'BIBLIOTECA GENERAL';
    return upper;
}
