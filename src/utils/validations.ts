import { Gender, ExportFormat } from '../core/types';
import { GENDERS, EXPORT_FORMATS } from '../core/constants';

export class ValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ValidationError';
    }
}

export function validateCount(count: string | number): number {
    const num = typeof count === 'string' ? parseInt(count, 10) : count;

    if (isNaN(num) || num <= 0) {
        throw new ValidationError('Count must be a positive number');
    }

    if (num > 100000) {
        throw new ValidationError('Count cannot exceed 100,000 for performance reasons');
    }

    return num;
}

export function validateGender(gender: string): Gender | undefined {
    if (gender === 'random') return undefined;

    if (!Object.values(GENDERS).includes(gender as Gender)) {
        throw new ValidationError(`Gender must be one of: ${Object.values(GENDERS).join(', ')}, or "random"`);
    }

    return gender as Gender;
}

export function validateRegion(region: string): 'north' | 'south' | 'randstad' | undefined {
    if (region === 'general') return undefined;

    const validRegions = ['north', 'south', 'randstad'] as const;
    if (!validRegions.includes(region as any)) {
        throw new ValidationError(`Region must be one of: ${validRegions.join(', ')}, or "general"`);
    }

    return region as 'north' | 'south' | 'randstad';
}

export function validateGeneration(generation: string): 'traditional' | 'modern' | 'contemporary' | undefined {
    if (generation === 'general') return undefined;

    const validGenerations = ['traditional', 'modern', 'contemporary'] as const;
    if (!validGenerations.includes(generation as any)) {
        throw new ValidationError(`Generation must be one of: ${validGenerations.join(', ')}, or "general"`);
    }

    return generation as 'traditional' | 'modern' | 'contemporary';
}

export function validateExportFormat(format: string): ExportFormat {
    if (!Object.values(EXPORT_FORMATS).includes(format as ExportFormat)) {
        throw new ValidationError(`Format must be one of: ${Object.values(EXPORT_FORMATS).join(', ')}`);
    }

    return format as ExportFormat;
}

export function validateSeed(seed?: string | number): number | undefined {
    if (seed === undefined || seed === '') return undefined;

    const num = typeof seed === 'string' ? parseInt(seed, 10) : seed;

    if (isNaN(num)) {
        throw new ValidationError('Seed must be a valid number');
    }

    return num;
}

export function validateFilePath(filePath: string): string {
    if (!filePath || filePath.trim() === '') {
        throw new ValidationError('File path cannot be empty');
    }

    const normalizedPath = filePath.trim();

    const invalidChars = /[<>:"|?*]/;
    if (invalidChars.test(normalizedPath)) {
        throw new ValidationError('File path contains invalid characters');
    }

    return normalizedPath;
}