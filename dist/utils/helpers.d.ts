import { DutchName, NameStats } from '../core/types';
export declare function capitalizeFirst(str: string): string;
export declare function formatFileName(baseName: string, extension: string, options?: {
    region?: string;
    generation?: string;
    gender?: string;
    timestamp?: boolean;
}): string;
export declare function calculateStats(names: DutchName[]): NameStats;
export declare function ensureArray<T>(value: T | T[]): T[];
export declare function chunk<T>(array: T[], size: number): T[][];
export declare function sleep(ms: number): Promise<void>;
export declare function formatPercentage(value: number, total: number): string;
export declare function getFileExtension(filePath: string): string;
export declare function removeFileExtension(filePath: string): string;
export declare function mergeArrays<T>(...arrays: T[][]): T[];
export declare function unique<T>(array: T[]): T[];
export declare function groupBy<T, K extends string | number>(array: T[], keyFn: (item: T) => K): Record<K, T[]>;
//# sourceMappingURL=helpers.d.ts.map