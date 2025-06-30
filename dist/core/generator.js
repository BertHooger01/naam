"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DutchPhoneticNameGenerator = void 0;
const constants_1 = require("./constants");
const random_1 = require("../utils/random");
const helpers_1 = require("../utils/helpers");
class DutchPhoneticNameGenerator {
    constructor(seed) {
        this.generatedNames = new Set();
        this.rng = new random_1.SeededRandom(seed);
    }
    getNamesByGeneration(gender, generation) {
        const isMale = gender === 'male';
        switch (generation) {
            case 'traditional':
                return isMale ? constants_1.TRADITIONAL_MALE_NAMES : constants_1.TRADITIONAL_FEMALE_NAMES;
            case 'modern':
                return isMale ? constants_1.MODERN_MALE_NAMES : constants_1.MODERN_FEMALE_NAMES;
            case 'contemporary':
                return isMale ? constants_1.CONTEMPORARY_MALE_NAMES : constants_1.CONTEMPORARY_FEMALE_NAMES;
            default:
                return [
                    ...(isMale ? constants_1.TRADITIONAL_MALE_NAMES : constants_1.TRADITIONAL_FEMALE_NAMES),
                    ...(isMale ? constants_1.MODERN_MALE_NAMES : constants_1.MODERN_FEMALE_NAMES),
                    ...(isMale ? constants_1.CONTEMPORARY_MALE_NAMES : constants_1.CONTEMPORARY_FEMALE_NAMES)
                ];
        }
    }
    getSurnameRootsByRegion(region) {
        switch (region) {
            case 'north':
                return [...constants_1.NORTHERN_SURNAME_ROOTS, ...constants_1.GENERAL_SURNAME_ROOTS];
            case 'south':
                return [...constants_1.SOUTHERN_SURNAME_ROOTS, ...constants_1.GENERAL_SURNAME_ROOTS];
            case 'randstad':
                return constants_1.GENERAL_SURNAME_ROOTS;
            default:
                return [...constants_1.NORTHERN_SURNAME_ROOTS, ...constants_1.SOUTHERN_SURNAME_ROOTS, ...constants_1.GENERAL_SURNAME_ROOTS];
        }
    }
    generateFirstName(gender, options = {}) {
        const generation = options.generation || 'general';
        const region = options.region || 'general';
        let syllables = this.getNamesByGeneration(gender, generation);
        if (region === 'north' && gender === 'male') {
            syllables = [...syllables, ...constants_1.NORTHERN_SYLLABLES];
        }
        else if (region === 'south' && gender === 'male') {
            syllables = [...syllables, ...constants_1.SOUTHERN_SYLLABLES];
        }
        else if (region === 'randstad') {
            syllables = [...syllables, ...constants_1.RANDSTAD_SYLLABLES];
        }
        if (this.rng.randomBoolean(0.8)) {
            const base = this.rng.randomElement(syllables);
            if (this.rng.randomBoolean(0.2)) {
                return this.addSimpleVariation(base, gender);
            }
            return (0, helpers_1.capitalizeFirst)(base);
        }
        else {
            return this.createDutchVariant(gender);
        }
    }
    addSimpleVariation(base, gender) {
        const endings = gender === 'male' ? constants_1.MALE_ENDINGS : constants_1.FEMALE_ENDINGS;
        if (this.rng.randomBoolean(0.5) && endings.length > 0) {
            const ending = this.rng.randomElement(endings);
            if (ending && !base.endsWith(ending)) {
                return (0, helpers_1.capitalizeFirst)(base + ending);
            }
        }
        return (0, helpers_1.capitalizeFirst)(base);
    }
    createDutchVariant(gender) {
        let name = '';
        name += this.rng.randomElement(constants_1.NAME_START_CONSONANTS);
        const vowelType = this.rng.random();
        if (vowelType < 0.5) {
            name += this.rng.randomElement(constants_1.SHORT_VOWELS);
        }
        else if (vowelType < 0.8) {
            name += this.rng.randomElement(constants_1.LONG_VOWELS);
        }
        else {
            name += this.rng.randomElement(constants_1.DIPHTHONGS);
        }
        if (this.rng.randomBoolean(0.6)) {
            const consonants = ['n', 'r', 's', 't', 'k', 'l', 'm'];
            name += this.rng.randomElement(consonants);
        }
        const endings = gender === 'male' ? constants_1.MALE_ENDINGS : constants_1.FEMALE_ENDINGS;
        const ending = this.rng.randomElement(endings);
        if (ending && !name.endsWith(ending)) {
            name += ending;
        }
        return (0, helpers_1.capitalizeFirst)(name);
    }
    generateLastName(options = {}) {
        const region = options.region || 'general';
        if (this.rng.randomBoolean(0.3)) {
            const commonSurnames = Array.from(constants_1.COMMON_SURNAME_WEIGHTS.keys());
            return (0, helpers_1.capitalizeFirst)(this.rng.randomElement(commonSurnames));
        }
        const nameType = this.rng.random();
        if (nameType < 0.6) {
            const prefix = this.rng.randomElement(constants_1.SURNAME_PREFIXES);
            const roots = this.getSurnameRootsByRegion(region);
            const root = this.rng.randomElement(roots);
            return `${prefix} ${(0, helpers_1.capitalizeFirst)(root)}`;
        }
        else if (nameType < 0.85) {
            return (0, helpers_1.capitalizeFirst)(this.rng.randomElement(constants_1.OCCUPATION_ROOTS));
        }
        else {
            return (0, helpers_1.capitalizeFirst)(this.generateSimpleSurname());
        }
    }
    generateSimpleSurname() {
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
                return this.rng.randomElement(constants_1.GENERAL_SURNAME_ROOTS);
            }
        ];
        return this.rng.randomElement(patterns)();
    }
    isUnique(fullName, avoidDuplicates) {
        if (!avoidDuplicates)
            return true;
        return !this.generatedNames.has(fullName.toLowerCase());
    }
    generateName(options = {}) {
        const selectedGender = options.gender || (this.rng.randomBoolean() ? 'male' : 'female');
        let attempts = 0;
        let name;
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
    generateNames(count, options = {}) {
        const names = [];
        for (let i = 0; i < count; i++) {
            names.push(this.generateName(options));
        }
        return names;
    }
    generateMaleName(options = {}) {
        return this.generateName({ ...options, gender: 'male' });
    }
    generateFemaleName(options = {}) {
        return this.generateName({ ...options, gender: 'female' });
    }
    generateTraditionalNames(count, gender) {
        return this.generateNames(count, { gender, generation: 'traditional' });
    }
    generateModernNames(count, gender) {
        return this.generateNames(count, { gender, generation: 'modern' });
    }
    generateRegionalNames(count, region, gender) {
        return this.generateNames(count, { gender, region });
    }
    clearDuplicateCache() {
        this.generatedNames.clear();
    }
    getStats() {
        return {
            totalGenerated: this.generatedNames.size,
            cacheSize: this.generatedNames.size
        };
    }
    setSeed(seed) {
        this.rng.setSeed(seed);
        this.clearDuplicateCache();
    }
}
exports.DutchPhoneticNameGenerator = DutchPhoneticNameGenerator;
//# sourceMappingURL=generator.js.map