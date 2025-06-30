export interface DutchName {
    firstName: string;
    lastName: string;
    fullName: string;
    gender: 'male' | 'female';
}
export declare class DutchPhoneticNameGenerator {
    private maleSyllables;
    private femaleSyllables;
    private nameStartConsonants;
    private shortVowels;
    private longVowels;
    private diphthongs;
    private maleEndings;
    private femaleEndings;
    private surnamePrefix;
    private surnameRoots;
    private occupationRoots;
    private generateFirstName;
    private addSimpleVariation;
    private createDutchVariant;
    private generateLastName;
    private generateSimpleSurname;
    generateName(gender?: 'male' | 'female'): DutchName;
    generateNames(count: number, gender?: 'male' | 'female'): DutchName[];
    generateMaleName(): DutchName;
    generateFemaleName(): DutchName;
    private getRandomElement;
    private capitalizeFirst;
}
//# sourceMappingURL=generator.d.ts.map