import { DutchName, GenerationOptions, Region, Gender } from './types';
export declare class DutchPhoneticNameGenerator {
    private generatedNames;
    private generatedFirstNames;
    private generatedLastNames;
    private rng;
    private dutchFirstNamePatterns;
    private dutchConsonantClusters;
    private dutchVowelPatterns;
    private commonDutchElements;
    constructor(seed?: number);
    private getNamesByGeneration;
    private getSurnameRootsByRegion;
    private isValidDutchPhonetics;
    private generateFirstName;
    private generateRealisticBaseNameVariation;
    private applyRealisticVariation;
    private generateRealisticNewName;
    private createRealisticDutchName;
    private generateLastName;
    private generatePrefixedSurname;
    private generateOccupationalSurname;
    private generatePatronymicSurname;
    private generateSimpleToponymicSurname;
    private isUnique;
    private selectRandomGeneration;
    private selectRandomRegion;
    generateName(options?: GenerationOptions): DutchName;
    generateNames(count: number, options?: GenerationOptions): DutchName[];
    generateMaleName(options?: Omit<GenerationOptions, 'gender'>): DutchName;
    generateFemaleName(options?: Omit<GenerationOptions, 'gender'>): DutchName;
    generateTraditionalNames(count: number, gender?: Gender): DutchName[];
    generateModernNames(count: number, gender?: Gender): DutchName[];
    generateRegionalNames(count: number, region: Region, gender?: Gender): DutchName[];
    generateMixedEraNames(count: number, options?: Omit<GenerationOptions, 'generation'>): DutchName[];
    generateRandomNames(count: number, options?: Omit<GenerationOptions, 'generation' | 'region'>): DutchName[];
    clearDuplicateCache(): void;
    getStats(): {
        totalGenerated: number;
        cacheSize: number;
        uniqueFirstNames: number;
        uniqueLastNames: number;
    };
    setSeed(seed: number): void;
}
//# sourceMappingURL=generator.d.ts.map