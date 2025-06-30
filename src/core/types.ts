export interface DutchName {
    firstName: string;
    lastName: string;
    fullName: string;
    gender: 'male' | 'female';
    region?: 'north' | 'south' | 'randstad' | 'general';
    generation?: 'traditional' | 'modern' | 'contemporary';
}

export interface GenerationOptions {
    gender?: 'male' | 'female';
    region?: 'north' | 'south' | 'randstad' | 'general';
    generation?: 'traditional' | 'modern' | 'contemporary';
    avoidDuplicates?: boolean;
    seed?: number;
}

export interface NameStats {
    totalGenerated: number;
    maleCount: number;
    femaleCount: number;
    uniqueFirstNames: number;
    uniqueLastNames: number;
    avgFirstNameLength: number;
    avgLastNameLength: number;
    regionDistribution?: Record<string, number>;
    generationDistribution?: Record<string, number>;
}

export interface ExportMetadata {
    totalNames: number;
    maleCount: number;
    femaleCount: number;
    generatedAt: string;
    options?: GenerationOptions;
}

export interface ExportData {
    metadata: ExportMetadata;
    names: DutchName[];
}

export type Region = 'north' | 'south' | 'randstad' | 'general';
export type Generation = 'traditional' | 'modern' | 'contemporary' | 'general';
export type Gender = 'male' | 'female';
export type ExportFormat = 'csv' | 'json' | 'txt';