import { Gender, ExportFormat } from '../core/types';
export declare class ValidationError extends Error {
    constructor(message: string);
}
export declare function validateCount(count: string | number): number;
export declare function validateGender(gender: string): Gender | undefined;
export declare function validateRegion(region: string): 'north' | 'south' | 'randstad' | undefined;
export declare function validateGeneration(generation: string): 'traditional' | 'modern' | 'contemporary' | undefined;
export declare function validateExportFormat(format: string): ExportFormat;
export declare function validateSeed(seed?: string | number): number | undefined;
export declare function validateFilePath(filePath: string): string;
//# sourceMappingURL=validations.d.ts.map