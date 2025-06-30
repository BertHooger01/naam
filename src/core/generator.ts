import { DutchName, GenerationOptions, Region, Generation, Gender } from './types';
import {
    TRADITIONAL_MALE_NAMES, TRADITIONAL_FEMALE_NAMES,
    MODERN_MALE_NAMES, MODERN_FEMALE_NAMES,
    CONTEMPORARY_MALE_NAMES, CONTEMPORARY_FEMALE_NAMES,
    NORTHERN_SYLLABLES, SOUTHERN_SYLLABLES, RANDSTAD_SYLLABLES,
    NAME_START_CONSONANTS, SHORT_VOWELS, LONG_VOWELS, DIPHTHONGS,
    MALE_ENDINGS, FEMALE_ENDINGS,
    SURNAME_PREFIXES, NORTHERN_SURNAME_ROOTS, SOUTHERN_SURNAME_ROOTS,
    GENERAL_SURNAME_ROOTS, OCCUPATION_ROOTS, COMMON_SURNAME_WEIGHTS
} from './constants';
import { SeededRandom } from '../utils/random';
import { capitalizeFirst } from '../utils/helpers';

export class DutchPhoneticNameGenerator {
    private generatedNames: Set<string> = new Set();
    private rng: SeededRandom;

    constructor(seed?: number) {
        this.rng = new SeededRandom(seed);
    }

    private getNamesByGeneration(gender: Gender, generation: Generation): string[] {
        const isMale = gender === 'male';

        switch (generation) {
            case 'traditional':
                return isMale ? TRADITIONAL_MALE_NAMES : TRADITIONAL_FEMALE_NAMES;
            case 'modern':
                return isMale ? MODERN_MALE_NAMES : MODERN_FEMALE_NAMES;
            case 'contemporary':
                return isMale ? CONTEMPORARY_MALE_NAMES : CONTEMPORARY_FEMALE_NAMES;
            default:
                return [
                    ...(isMale ? TRADITIONAL_MALE_NAMES : TRADITIONAL_FEMALE_NAMES),
                    ...(isMale ? MODERN_MALE_NAMES : MODERN_FEMALE_NAMES),
                    ...(isMale ? CONTEMPORARY_MALE_NAMES : CONTEMPORARY_FEMALE_NAMES)
                ];
        }
    }

    private getSurnameRootsByRegion(region: Region): string[] {
        switch (region) {
            case 'north':
                return [...NORTHERN_SURNAME_ROOTS, ...GENERAL_SURNAME_ROOTS];
            case 'south':
                return [...SOUTHERN_SURNAME_ROOTS, ...GENERAL_SURNAME_ROOTS];
            case 'randstad':
                return GENERAL_SURNAME_ROOTS;
            default:
                return [...NORTHERN_SURNAME_ROOTS, ...SOUTHERN_SURNAME_ROOTS, ...GENERAL_SURNAME_ROOTS];
        }
    }

    private generateFirstName(gender: Gender, options: GenerationOptions = {}): string {
        const generation = options.generation || 'general';
        const region = options.region || 'general';

        let syllables = this.getNamesByGeneration(gender, generation);

        if (region === 'north' && gender === 'male') {
            syllables = [...syllables, ...NORTHERN_SYLLABLES];
        } else if (region === 'south' && gender === 'male') {
            syllables = [...syllables, ...SOUTHERN_SYLLABLES];
        } else if (region === 'randstad') {
            syllables = [...syllables, ...RANDSTAD_SYLLABLES];
        }

        if (this.rng.randomBoolean(0.8)) {
            const base = this.rng.randomElement(syllables);

            if (this.rng.randomBoolean(0.2)) {
                return this.addSimpleVariation(base, gender);
            }

            return capitalizeFirst(base);
        } else {
            return this.createDutchVariant(gender);
        }
    }

    private addSimpleVariation(base: string, gender: Gender): string {
        const endings = gender === 'male' ? MALE_ENDINGS : FEMALE_ENDINGS;

        if (this.rng.randomBoolean(0.5) && endings.length > 0) {
            const ending = this.rng.randomElement(endings);
            if (ending && !base.endsWith(ending)) {
                return capitalizeFirst(base + ending);
            }
        }

        return capitalizeFirst(base);
    }

    private createDutchVariant(gender: Gender): string {
        let name = '';

        name += this.rng.randomElement(NAME_START_CONSONANTS);

        const vowelType = this.rng.random();
        if (vowelType < 0.5) {
            name += this.rng.randomElement(SHORT_VOWELS);
        } else if (vowelType < 0.8) {
            name += this.rng.randomElement(LONG_VOWELS);
        } else {
            name += this.rng.randomElement(DIPHTHONGS);
        }

        if (this.rng.randomBoolean(0.6)) {
            const consonants = ['n', 'r', 's', 't', 'k', 'l', 'm'];
            name += this.rng.randomElement(consonants);
        }

        const endings = gender === 'male' ? MALE_ENDINGS : FEMALE_ENDINGS;
        const ending = this.rng.randomElement(endings);
        if (ending && !name.endsWith(ending)) {
            name += ending;
        }

        return capitalizeFirst(name);
    }

    private generateLastName(options: GenerationOptions = {}): string {
        const region = options.region || 'general';

        if (this.rng.randomBoolean(0.3)) {
            const commonSurnames = Array.from(COMMON_SURNAME_WEIGHTS.keys());
            return capitalizeFirst(this.rng.randomElement(commonSurnames));
        }

        const nameType = this.rng.random();

        if (nameType < 0.6) {
            const prefix = this.rng.randomElement(SURNAME_PREFIXES);
            const roots = this.getSurnameRootsByRegion(region);
            const root = this.rng.randomElement(roots);
            return `${prefix} ${capitalizeFirst(root)}`;
        } else if (nameType < 0.85) {
            return capitalizeFirst(this.rng.randomElement(OCCUPATION_ROOTS));
        } else {
            return capitalizeFirst(this.generateSimpleSurname());
        }
    }

    private generateSimpleSurname(): string {
        const patterns = [
            () => {
                const start = this.rng.randomElement(['jan', 'pet', 'hen', 'wil', 'ger', 'mar', 'klaas']);
                return start + 'sen';
            },
            () => {
                const roots = ['timmer', 'water', 'schip', 'hoek', 'veld'];
                return this.rng.randomElement(roots) + 'man';
            },
            () => {
                return this.rng.randomElement(GENERAL_SURNAME_ROOTS);
            }
        ];

        return this.rng.randomElement(patterns)();
    }

    private isUnique(fullName: string, avoidDuplicates: boolean): boolean {
        if (!avoidDuplicates) return true;
        return !this.generatedNames.has(fullName.toLowerCase());
    }

    generateName(options: GenerationOptions = {}): DutchName {
        const selectedGender = options.gender || (this.rng.randomBoolean() ? 'male' : 'female');
        let attempts = 0;
        let name: DutchName;

        do {
            const firstName = this.generateFirstName(selectedGender, options);
            const lastName = this.generateLastName(options);
            const fullName = `${firstName} ${lastName}`;

            name = {
                firstName,
                lastName,
                fullName,
                gender: selectedGender,
                region: options.region || 'general',
                generation: options.generation || 'modern'
            };

            attempts++;
        } while (!this.isUnique(name.fullName, options.avoidDuplicates || false) && attempts < 100);

        if (options.avoidDuplicates) {
            this.generatedNames.add(name.fullName.toLowerCase());
        }

        return name;
    }

    generateNames(count: number, options: GenerationOptions = {}): DutchName[] {
        const names: DutchName[] = [];
        for (let i = 0; i < count; i++) {
            names.push(this.generateName(options));
        }
        return names;
    }

    generateMaleName(options: Omit<GenerationOptions, 'gender'> = {}): DutchName {
        return this.generateName({ ...options, gender: 'male' });
    }

    generateFemaleName(options: Omit<GenerationOptions, 'gender'> = {}): DutchName {
        return this.generateName({ ...options, gender: 'female' });
    }

    generateTraditionalNames(count: number, gender?: Gender): DutchName[] {
        return this.generateNames(count, { gender, generation: 'traditional' });
    }

    generateModernNames(count: number, gender?: Gender): DutchName[] {
        return this.generateNames(count, { gender, generation: 'modern' });
    }

    generateRegionalNames(count: number, region: Region, gender?: Gender): DutchName[] {
        return this.generateNames(count, { gender, region });
    }

    clearDuplicateCache(): void {
        this.generatedNames.clear();
    }

    getStats(): { totalGenerated: number; cacheSize: number } {
        return {
            totalGenerated: this.generatedNames.size,
            cacheSize: this.generatedNames.size
        };
    }

    setSeed(seed: number): void {
        this.rng.setSeed(seed);
        this.clearDuplicateCache();
    }
}