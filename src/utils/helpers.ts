import { DutchName, NameStats } from '../core/types';

export function capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function formatFileName(baseName: string, extension: string, options?: {
    region?: string;
    generation?: string;
    gender?: string;
    timestamp?: boolean;
}): string {
    let fileName = baseName;

    if (options?.region && options.region !== 'general') {
        fileName += `-${options.region}`;
    }

    if (options?.generation && options.generation !== 'general') {
        fileName += `-${options.generation}`;
    }

    if (options?.gender) {
        fileName += `-${options.gender}`;
    }

    if (options?.timestamp) {
        const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
        fileName += `-${timestamp}`;
    }

    return `${fileName}.${extension}`;
}

export function calculateStats(names: DutchName[]): NameStats {
    const maleCount = names.filter(n => n.gender === 'male').length;
    const femaleCount = names.filter(n => n.gender === 'female').length;

    const uniqueFirstNames = new Set(names.map(n => n.firstName)).size;
    const uniqueLastNames = new Set(names.map(n => n.lastName)).size;

    const avgFirstNameLength = names.reduce((sum, n) => sum + n.firstName.length, 0) / names.length;
    const avgLastNameLength = names.reduce((sum, n) => sum + n.lastName.length, 0) / names.length;

    const regionDistribution: Record<string, number> = {};
    const generationDistribution: Record<string, number> = {};

    names.forEach(name => {
        const region = name.region || 'general';
        const generation = name.generation || 'modern';

        regionDistribution[region] = (regionDistribution[region] || 0) + 1;
        generationDistribution[generation] = (generationDistribution[generation] || 0) + 1;
    });

    return {
        totalGenerated: names.length,
        maleCount,
        femaleCount,
        uniqueFirstNames,
        uniqueLastNames,
        avgFirstNameLength: Number(avgFirstNameLength.toFixed(1)),
        avgLastNameLength: Number(avgLastNameLength.toFixed(1)),
        regionDistribution,
        generationDistribution
    };
}

export function ensureArray<T>(value: T | T[]): T[] {
    return Array.isArray(value) ? value : [value];
}

export function chunk<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
    }
    return chunks;
}

export function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function formatPercentage(value: number, total: number): string {
    return ((value / total) * 100).toFixed(1) + '%';
}

export function getFileExtension(filePath: string): string {
    const parts = filePath.split('.');
    return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
}

export function removeFileExtension(filePath: string): string {
    const lastDotIndex = filePath.lastIndexOf('.');
    return lastDotIndex > 0 ? filePath.substring(0, lastDotIndex) : filePath;
}

export function mergeArrays<T>(...arrays: T[][]): T[] {
    return arrays.reduce((acc, arr) => acc.concat(arr), []);
}

export function unique<T>(array: T[]): T[] {
    return [...new Set(array)];
}

export function groupBy<T, K extends string | number>(
    array: T[],
    keyFn: (item: T) => K
): Record<K, T[]> {
    return array.reduce((groups, item) => {
        const key = keyFn(item);
        if (!groups[key]) {
            groups[key] = [];
        }
        groups[key].push(item);
        return groups;
    }, {} as Record<K, T[]>);
}