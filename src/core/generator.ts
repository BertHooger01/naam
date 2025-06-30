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
    private generatedFirstNames: Set<string> = new Set();
    private generatedLastNames: Set<string> = new Set();
    private rng: SeededRandom;

    private dutchFirstNamePatterns = {
        male: ['an', 'en', 'ik', 'us', 'er', 'el', 'ar', 'or'],
        female: ['a', 'e', 'ie', 'ine', 'ien', 'ke', 'je', 'se']
    };

    private dutchConsonantClusters = ['br', 'cr', 'dr', 'fl', 'fr', 'gr', 'kl', 'kr', 'pl', 'pr', 'sc', 'sl', 'sm', 'sn', 'sp', 'st', 'tr', 'tw', 'zw'];

    private dutchVowelPatterns = ['a', 'e', 'i', 'o', 'u', 'aa', 'ee', 'ie', 'oo', 'uu', 'ei', 'ij', 'au', 'ou', 'eu', 'ui'];

    private commonDutchElements = {
        prefixes: ['van', 'de', 'den', 'der', 'ten', 'ter', 'op', 'in'],
        suffixes: ['s', 'sen', 'sz', 'man', 'er', 'huis', 'dijk', 'berg', 'burg', 'horst']
    };

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

    private isValidDutchPhonetics(name: string): boolean {
        const invalidPatterns = [
            /[qxz]/i,
            /[aeiou]{3,}/i,
            /[bcdfghjklmnpqrstvwxyz]{3,}/i,
            /uu[aeiou]/i,
            /[^aeiou]u[^aeiouijnr]/i,
            /sch[^aeiouhr]/i,
            /[bcdfghjklmnpqrstvwxyz]$[bcdfghjklmnpqrstvwxyz]/i,
            /^[bcdfghjklmnpqrstvwxyz]{2}[bcdfghjklmnpqrstvwxyz]/i,
            /[yw]/i,
            /^[tp][aeiou]{2}/i,
            /[kg][aeiou][kg]/i,
            /^[bcdfghjklmnpqrstvwxyz][bcdfghjklmnpqrstvwxyz][aeiou]$/i,
            /^[bcdfghjklmnpqrstvwxyz][aeiou][aeiou]$/i,
            /^[bcdfghjklmnpqrstvwxyz][aeiou][bcdfghjklmnpqrstvwxyz]$/i,
            /ou[aeiou]/i,
            /[aeiou]ou[aeiou]/i,
        ];

        if (name.length < 3 || name.length > 9) return false;

        const vowelPattern = /[aeiou]/g;
        const vowelCount = (name.match(vowelPattern) || []).length;
        if (vowelCount < 1 || vowelCount > 3) return false;

        if (/(.)\1{2,}/.test(name)) return false;

        const suspiciousPatterns = [
            /ij[bcdfghjklmnpqrstvwxyz]/i,
            /[bcdfghjklmnpqrstvwxyz]ij[bcdfghjklmnpqrstvwxyz]/i,
        ];

        if (suspiciousPatterns.some(pattern => pattern.test(name))) return false;

        return !invalidPatterns.some(pattern => pattern.test(name));
    }

    private generateFirstName(gender: Gender, options: GenerationOptions = {}): string {
        const generation = options.generation || 'general';
        const region = options.region || 'general';

        if (this.rng.randomBoolean(0.95)) {
            return this.generateRealisticBaseNameVariation(gender, generation, region);
        } else {
            return this.generateRealisticNewName(gender);
        }
    }

    private generateRealisticBaseNameVariation(gender: Gender, generation: Generation, region: Region): string {
        let baseNames = this.getNamesByGeneration(gender, generation);

        if (region === 'north' && gender === 'male') {
            baseNames = [...baseNames, ...NORTHERN_SYLLABLES];
        } else if (region === 'south' && gender === 'male') {
            baseNames = [...baseNames, ...SOUTHERN_SYLLABLES];
        } else if (region === 'randstad') {
            baseNames = [...baseNames, ...RANDSTAD_SYLLABLES];
        }

        const baseName = this.rng.randomElement(baseNames);

        if (this.rng.randomBoolean(0.1)) {
            return this.applyRealisticVariation(baseName, gender);
        }

        return capitalizeFirst(baseName);
    }

    private applyRealisticVariation(baseName: string, gender: Gender): string {
        const variationType = this.rng.random();

        if (variationType < 0.4) {
            const endings = gender === 'male' ? MALE_ENDINGS : FEMALE_ENDINGS;
            const ending = this.rng.randomElement(endings.filter(e => e !== ''));

            if (ending) {
                const candidate = baseName + ending;
                if (this.isValidDutchPhonetics(candidate) && candidate.length <= 9) {
                    return capitalizeFirst(candidate);
                }
            }
        } else if (variationType < 0.7) {
            if (gender === 'female') {
                const diminutives = ['je', 'ke', 'tje', 'ien'];
                const diminutive = this.rng.randomElement(diminutives);
                const candidate = baseName + diminutive;
                if (this.isValidDutchPhonetics(candidate) && candidate.length <= 8) {
                    return capitalizeFirst(candidate);
                }
            } else {
                if (this.rng.randomBoolean(0.1)) {
                    const candidate = baseName + 'us';
                    if (this.isValidDutchPhonetics(candidate) && candidate.length <= 10) {
                        return capitalizeFirst(candidate);
                    }
                }
            }
        } else {
            if (baseName.length > 3) {
                const vowelIndex = baseName.search(/[aeiou]/);
                if (vowelIndex !== -1) {
                    const newVowel = this.rng.randomElement(SHORT_VOWELS);
                    const candidate = baseName.substring(0, vowelIndex) + newVowel + baseName.substring(vowelIndex + 1);
                    if (this.isValidDutchPhonetics(candidate)) {
                        return capitalizeFirst(candidate);
                    }
                }
            }
        }

        return capitalizeFirst(baseName);
    }

    private generateRealisticNewName(gender: Gender): string {
        let attempts = 0;
        let name = '';

        do {
            name = this.createRealisticDutchName(gender);
            attempts++;
        } while (!this.isValidDutchPhonetics(name) && attempts < 20);

        if (!this.isValidDutchPhonetics(name) || name.length > 12) {
            const baseNames = this.getNamesByGeneration(gender, 'general');
            name = this.rng.randomElement(baseNames);
        }

        return capitalizeFirst(name);
    }

    private createRealisticDutchName(gender: Gender): string {
        const syllableCount = this.rng.randomInt(1, 2);
        let name = '';

        for (let i = 0; i < syllableCount; i++) {
            if (i === 0) {
                if (this.rng.randomBoolean(0.3)) {
                    name += this.rng.randomElement(this.dutchConsonantClusters);
                } else {
                    name += this.rng.randomElement(['b', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'r', 's', 't', 'v', 'w']);
                }
            } else {
                if (this.rng.randomBoolean(0.6)) {
                    name += this.rng.randomElement(['n', 'r', 's', 't', 'k', 'l', 'm', 'd']);
                }
            }

            const vowelPattern = this.rng.randomElement(this.dutchVowelPatterns);
            name += vowelPattern;

            if (i === syllableCount - 1 && this.rng.randomBoolean(0.4)) {
                const finalConsonants = gender === 'male' ? ['n', 'r', 's', 't', 'k'] : ['n', 'r', 's'];
                name += this.rng.randomElement(finalConsonants);
            }
        }

        const patterns = this.dutchFirstNamePatterns[gender];
        if (this.rng.randomBoolean(0.4)) {
            const ending = this.rng.randomElement(patterns);
            if (!name.endsWith(ending)) {
                name += ending;
            }
        }

        return name;
    }

    private generateLastName(options: GenerationOptions = {}): string {
        const region = options.region || 'general';

        if (this.rng.randomBoolean(0.25)) {
            const commonSurnames = Array.from(COMMON_SURNAME_WEIGHTS.keys());
            return capitalizeFirst(this.rng.randomElement(commonSurnames));
        }

        const nameType = this.rng.random();

        if (nameType < 0.45) {
            return this.generatePrefixedSurname(region);
        } else if (nameType < 0.7) {
            return this.generateOccupationalSurname();
        } else if (nameType < 0.85) {
            return this.generatePatronymicSurname();
        } else {
            return this.generateSimpleToponymicSurname(region);
        }
    }

    private generatePrefixedSurname(region: Region): string {
        const prefix = this.rng.randomElement(SURNAME_PREFIXES);
        const roots = this.getSurnameRootsByRegion(region);
        const root = this.rng.randomElement(roots);

        if (this.rng.randomBoolean(0.2)) {
            const modifier = this.rng.randomElement(['burg', 'hout', 'dorp']);
            return `${prefix} ${capitalizeFirst(root)}${modifier}`;
        }

        return `${prefix} ${capitalizeFirst(root)}`;
    }

    private generateOccupationalSurname(): string {
        const occupation = this.rng.randomElement(OCCUPATION_ROOTS);

        if (this.rng.randomBoolean(0.7)) {
            return capitalizeFirst(occupation);
        } else {
            const suffixes = ['s', 'sen', 'man'];
            return capitalizeFirst(occupation + this.rng.randomElement(suffixes));
        }
    }

    private generatePatronymicSurname(): string {
        const patronymicBases = [
            'jan', 'piet', 'henk', 'klaas', 'dirk', 'gerard', 'willem', 'cornelis',
            'jacob', 'martin', 'anton', 'bernard', 'simon', 'theodor'
        ];

        const base = this.rng.randomElement(patronymicBases);
        const suffixes = ['sen', 'sz', 'zoon', 's'];

        return capitalizeFirst(base + this.rng.randomElement(suffixes));
    }

    private generateSimpleToponymicSurname(region: Region): string {
        const roots = this.getSurnameRootsByRegion(region);
        const root = this.rng.randomElement(roots);

        if (this.rng.randomBoolean(0.3)) {
            const simpleModifiers = ['dijk', 'berg', 'huis', 'hof'];
            return capitalizeFirst(root + this.rng.randomElement(simpleModifiers));
        }

        return capitalizeFirst(root);
    }

    private isUnique(fullName: string, avoidDuplicates: boolean): boolean {
        if (!avoidDuplicates) return true;
        return !this.generatedNames.has(fullName.toLowerCase());
    }

    private selectRandomGeneration(): 'traditional' | 'modern' | 'contemporary' {
        const distributions = [
            [0.4, 0.7, 1.0],
            [0.33, 0.66, 1.0],
            [0.2, 0.7, 1.0],
            [0.2, 0.5, 1.0],
            [0.25, 0.6, 1.0]
        ];

        const selectedDistribution = this.rng.randomElement(distributions);
        const rand = this.rng.random();

        if (rand < selectedDistribution[0]) return 'traditional';
        if (rand < selectedDistribution[1]) return 'modern';
        return 'contemporary';
    }

    private selectRandomRegion(): 'north' | 'south' | 'randstad' | 'general' {
        const distributions = [
            [0.4, 0.6, 0.8, 1.0],
            [0.15, 0.5, 0.75, 1.0],
            [0.15, 0.3, 0.7, 1.0],
            [0.25, 0.5, 0.75, 1.0],
            [0.15, 0.3, 0.45, 1.0]
        ];

        const selectedDistribution = this.rng.randomElement(distributions);
        const rand = this.rng.random();

        if (rand < selectedDistribution[0]) return 'north';
        if (rand < selectedDistribution[1]) return 'south';
        if (rand < selectedDistribution[2]) return 'randstad';
        return 'general';
    }

    generateName(options: GenerationOptions = {}): DutchName {
        const selectedGender = options.gender || (this.rng.randomBoolean() ? 'male' : 'female');

        let selectedGeneration: 'traditional' | 'modern' | 'contemporary';
        if (!options.generation || options.generation === 'general') {
            selectedGeneration = this.selectRandomGeneration();
        } else {
            selectedGeneration = options.generation;
        }

        let selectedRegion: 'north' | 'south' | 'randstad' | 'general';
        if (!options.region || options.region === 'general') {
            selectedRegion = this.selectRandomRegion();
        } else {
            selectedRegion = options.region;
        }

        let attempts = 0;
        let name: DutchName;

        do {
            const firstName = this.generateFirstName(selectedGender, {
                ...options,
                generation: selectedGeneration,
                region: selectedRegion
            });
            const lastName = this.generateLastName({
                ...options,
                generation: selectedGeneration,
                region: selectedRegion
            });
            const fullName = `${firstName} ${lastName}`;

            name = {
                firstName,
                lastName,
                fullName,
                gender: selectedGender,
                region: selectedRegion,
                generation: selectedGeneration
            };

            attempts++;
        } while (!this.isUnique(name.fullName, options.avoidDuplicates || false) && attempts < 100);

        if (options.avoidDuplicates) {
            this.generatedNames.add(name.fullName.toLowerCase());
        }

        this.generatedFirstNames.add(name.firstName.toLowerCase());
        this.generatedLastNames.add(name.lastName.toLowerCase());

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

    generateMixedEraNames(count: number, options: Omit<GenerationOptions, 'generation'> = {}): DutchName[] {
        return this.generateNames(count, { ...options, generation: 'general' });
    }

    generateRandomNames(count: number, options: Omit<GenerationOptions, 'generation' | 'region'> = {}): DutchName[] {
        return this.generateNames(count, {
            ...options,
            generation: 'general',
            region: 'general'
        });
    }

    clearDuplicateCache(): void {
        this.generatedNames.clear();
        this.generatedFirstNames.clear();
        this.generatedLastNames.clear();
    }

    getStats(): { totalGenerated: number; cacheSize: number; uniqueFirstNames: number; uniqueLastNames: number } {
        return {
            totalGenerated: this.generatedNames.size,
            cacheSize: this.generatedNames.size,
            uniqueFirstNames: this.generatedFirstNames.size,
            uniqueLastNames: this.generatedLastNames.size
        };
    }

    setSeed(seed: number): void {
        this.rng.setSeed(seed);
        this.clearDuplicateCache();
    }
}