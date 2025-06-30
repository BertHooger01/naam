import { DutchName, GenerationOptions, Region, Gender } from './types';
export declare class DutchPhoneticNameGenerator {
    private generatedNames;
    private rng;
    constructor(seed?: number);
    private getNamesByGeneration;
    private getSurnameRootsByRegion;
    private generateFirstName;
    private addSimpleVariation;
    private createDutchVariant;
    private generateLastName;
    private generateSimpleSurname;
    private isUnique;
    generateName(options?: GenerationOptions): DutchName;
    generateNames(count: number, options?: GenerationOptions): DutchName[];
    generateMaleName(options?: Omit<GenerationOptions, 'gender'>): DutchName;
    generateFemaleName(options?: Omit<GenerationOptions, 'gender'>): DutchName;
    generateTraditionalNames(count: number, gender?: Gender): DutchName[];
    generateModernNames(count: number, gender?: Gender): DutchName[];
    generateRegionalNames(count: number, region: Region, gender?: Gender): DutchName[];
    clearDuplicateCache(): void;
    getStats(): {
        totalGenerated: number;
        cacheSize: number;
    };
    setSeed(seed: number): void;
}
//# sourceMappingURL=generator.d.ts.map