"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DutchPhoneticNameGenerator = void 0;
const constants_1 = require("./constants");
const random_1 = require("../utils/random");
const helpers_1 = require("../utils/helpers");
class DutchPhoneticNameGenerator {
    constructor(seed) {
        this.generatedNames = new Set();
        this.generatedFirstNames = new Set();
        this.generatedLastNames = new Set();
        // Add realistic Dutch name patterns
        this.dutchFirstNamePatterns = {
            male: ['an', 'en', 'ik', 'us', 'er', 'el', 'ar', 'or'],
            female: ['a', 'e', 'ie', 'ine', 'ien', 'ke', 'je', 'se']
        };
        // Common Dutch consonant clusters that sound natural
        this.dutchConsonantClusters = ['br', 'cr', 'dr', 'fl', 'fr', 'gr', 'kl', 'kr', 'pl', 'pr', 'sc', 'sl', 'sm', 'sn', 'sp', 'st', 'tr', 'tw', 'zw'];
        // Realistic Dutch vowel combinations
        this.dutchVowelPatterns = ['a', 'e', 'i', 'o', 'u', 'aa', 'ee', 'ie', 'oo', 'uu', 'ei', 'ij', 'au', 'ou', 'eu', 'ui'];
        // Common Dutch name elements for variation
        this.commonDutchElements = {
            prefixes: ['van', 'de', 'den', 'der', 'ten', 'ter', 'op', 'in'],
            suffixes: ['s', 'sen', 'sz', 'man', 'er', 'huis', 'dijk', 'berg', 'burg', 'horst']
        };
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
    isValidDutchPhonetics(name) {
        // Ultra-strict validation for maximum realism
        const invalidPatterns = [
            /[qxz]/i, // These letters are rare in Dutch
            /[aeiou]{3,}/i, // Max 2 consecutive vowels
            /[bcdfghjklmnpqrstvwxyz]{3,}/i, // Max 2 consecutive consonants
            /^[aeiou]/i, // Names shouldn't start with vowels
            /uu[aeiou]/i, // uu followed by other vowels is uncommon
            /[^aeiou]u[^aeiouijnr]/i, // u in wrong positions
            /sch[^aeiouhr]/i, // sch should be followed by vowels or h/r
            /[bcdfghjklmnpqrstvwxyz]$[bcdfghjklmnpqrstvwxyz]/i, // No consonant clusters at end
            /^[bcdfghjklmnpqrstvwxyz]{2}[bcdfghjklmnpqrstvwxyz]/i, // No triple consonants at start
            /[yw]/i, // Y and W in middle of names are rare in Dutch
            /^[tp][aeiou]{2}/i, // Avoid patterns like "Tik", "Pee"
            /[kg][aeiou][kg]/i, // Avoid k-vowel-k or g-vowel-g patterns
            /^[bcdfghjklmnpqrstvwxyz][bcdfghjklmnpqrstvwxyz][aeiou]$/i, // Avoid 2-consonant+vowel short names
            /^[bcdfghjklmnpqrstvwxyz][aeiou][aeiou]$/i, // Avoid consonant+double vowel short names like "Hou", "Suu"
            /^[bcdfghjklmnpqrstvwxyz][aeiou][bcdfghjklmnpqrstvwxyz]$/i, // Avoid single-vowel 3-letter names that sound odd
            /ou[aeiou]/i, // ou followed by vowels is uncommon
            /[aeiou]ou[aeiou]/i, // vowel-ou-vowel patterns are rare
        ];
        // Name length validation - be even more restrictive
        if (name.length < 3 || name.length > 9)
            return false;
        // Check for realistic vowel patterns
        const vowelPattern = /[aeiou]/g;
        const vowelCount = (name.match(vowelPattern) || []).length;
        if (vowelCount < 1 || vowelCount > 3)
            return false; // Reduced max vowels
        // Check for too many repeated letters
        if (/(.)\1{2,}/.test(name))
            return false;
        // Reject names with unusual letter combinations
        const suspiciousPatterns = [
            /ij[bcdfghjklmnpqrstvwxyz]/i, // ij followed by consonants (except proper Dutch)
            /[bcdfghjklmnpqrstvwxyz]ij[bcdfghjklmnpqrstvwxyz]/i, // ij in middle with consonants
        ];
        if (suspiciousPatterns.some(pattern => pattern.test(name)))
            return false;
        return !invalidPatterns.some(pattern => pattern.test(name));
    }
    generateFirstName(gender, options = {}) {
        const generation = options.generation || 'general';
        const region = options.region || 'general';
        // Push base name usage to 95% for maximum realism: 95% base, 5% generated
        if (this.rng.randomBoolean(0.95)) {
            return this.generateRealisticBaseNameVariation(gender, generation, region);
        }
        else {
            return this.generateRealisticNewName(gender);
        }
    }
    generateRealisticBaseNameVariation(gender, generation, region) {
        let baseNames = this.getNamesByGeneration(gender, generation);
        // Add regional variations
        if (region === 'north' && gender === 'male') {
            baseNames = [...baseNames, ...constants_1.NORTHERN_SYLLABLES];
        }
        else if (region === 'south' && gender === 'male') {
            baseNames = [...baseNames, ...constants_1.SOUTHERN_SYLLABLES];
        }
        else if (region === 'randstad') {
            baseNames = [...baseNames, ...constants_1.RANDSTAD_SYLLABLES];
        }
        const baseName = this.rng.randomElement(baseNames);
        // Reduce variation chance to 10% for maximum realism
        if (this.rng.randomBoolean(0.1)) {
            return this.applyRealisticVariation(baseName, gender);
        }
        return (0, helpers_1.capitalizeFirst)(baseName);
    }
    applyRealisticVariation(baseName, gender) {
        const variationType = this.rng.random();
        if (variationType < 0.4) {
            // Use the proper MALE_ENDINGS and FEMALE_ENDINGS constants
            const endings = gender === 'male' ? constants_1.MALE_ENDINGS : constants_1.FEMALE_ENDINGS;
            const ending = this.rng.randomElement(endings.filter(e => e !== ''));
            if (ending) {
                const candidate = baseName + ending;
                if (this.isValidDutchPhonetics(candidate) && candidate.length <= 9) {
                    return (0, helpers_1.capitalizeFirst)(candidate);
                }
            }
        }
        else if (variationType < 0.7) {
            // Diminutive forms using proper Dutch patterns
            if (gender === 'female') {
                const diminutives = ['je', 'ke', 'tje', 'ien'];
                const diminutive = this.rng.randomElement(diminutives);
                const candidate = baseName + diminutive;
                if (this.isValidDutchPhonetics(candidate) && candidate.length <= 8) {
                    return (0, helpers_1.capitalizeFirst)(candidate);
                }
            }
            else {
                // For males, very occasional formal endings
                if (this.rng.randomBoolean(0.1)) {
                    const candidate = baseName + 'us';
                    if (this.isValidDutchPhonetics(candidate) && candidate.length <= 10) {
                        return (0, helpers_1.capitalizeFirst)(candidate);
                    }
                }
            }
        }
        else {
            // Vowel substitution using proper Dutch vowels
            if (baseName.length > 3) {
                const vowelIndex = baseName.search(/[aeiou]/);
                if (vowelIndex !== -1) {
                    // Use SHORT_VOWELS constant instead of hardcoded array
                    const newVowel = this.rng.randomElement(constants_1.SHORT_VOWELS);
                    const candidate = baseName.substring(0, vowelIndex) + newVowel + baseName.substring(vowelIndex + 1);
                    if (this.isValidDutchPhonetics(candidate)) {
                        return (0, helpers_1.capitalizeFirst)(candidate);
                    }
                }
            }
        }
        return (0, helpers_1.capitalizeFirst)(baseName);
    }
    generateRealisticNewName(gender) {
        let attempts = 0;
        let name = '';
        do {
            name = this.createRealisticDutchName(gender);
            attempts++;
        } while (!this.isValidDutchPhonetics(name) && attempts < 20);
        // Fallback to base names if we can't generate a good one
        if (!this.isValidDutchPhonetics(name) || name.length > 12) {
            const baseNames = this.getNamesByGeneration(gender, 'general');
            name = this.rng.randomElement(baseNames);
        }
        return (0, helpers_1.capitalizeFirst)(name);
    }
    createRealisticDutchName(gender) {
        const syllableCount = this.rng.randomInt(1, 2); // Stick to 1-2 syllables for realism
        let name = '';
        for (let i = 0; i < syllableCount; i++) {
            // Start syllable
            if (i === 0) {
                // First syllable - can start with consonant cluster
                if (this.rng.randomBoolean(0.3)) {
                    name += this.rng.randomElement(this.dutchConsonantClusters);
                }
                else {
                    name += this.rng.randomElement(['b', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'r', 's', 't', 'v', 'w']);
                }
            }
            else {
                // Subsequent syllables - simpler consonants
                if (this.rng.randomBoolean(0.6)) {
                    name += this.rng.randomElement(['n', 'r', 's', 't', 'k', 'l', 'm', 'd']);
                }
            }
            // Add vowel pattern
            const vowelPattern = this.rng.randomElement(this.dutchVowelPatterns);
            name += vowelPattern;
            // Sometimes add final consonant to syllable
            if (i === syllableCount - 1 && this.rng.randomBoolean(0.4)) {
                const finalConsonants = gender === 'male' ? ['n', 'r', 's', 't', 'k'] : ['n', 'r', 's'];
                name += this.rng.randomElement(finalConsonants);
            }
        }
        // Add gender-appropriate ending
        const patterns = this.dutchFirstNamePatterns[gender];
        if (this.rng.randomBoolean(0.4)) {
            const ending = this.rng.randomElement(patterns);
            if (!name.endsWith(ending)) {
                name += ending;
            }
        }
        return name;
    }
    generateLastName(options = {}) {
        const region = options.region || 'general';
        // Increase chance of common surnames for realism
        if (this.rng.randomBoolean(0.25)) {
            const commonSurnames = Array.from(constants_1.COMMON_SURNAME_WEIGHTS.keys());
            return (0, helpers_1.capitalizeFirst)(this.rng.randomElement(commonSurnames));
        }
        const nameType = this.rng.random();
        if (nameType < 0.45) {
            return this.generatePrefixedSurname(region);
        }
        else if (nameType < 0.7) {
            return this.generateOccupationalSurname();
        }
        else if (nameType < 0.85) {
            return this.generatePatronymicSurname();
        }
        else {
            return this.generateSimpleToponymicSurname(region);
        }
    }
    generatePrefixedSurname(region) {
        const prefix = this.rng.randomElement(constants_1.SURNAME_PREFIXES);
        const roots = this.getSurnameRootsByRegion(region);
        const root = this.rng.randomElement(roots);
        // Reduce compound complexity - only 20% chance of compound
        if (this.rng.randomBoolean(0.2)) {
            const modifier = this.rng.randomElement(['burg', 'hout', 'dorp']);
            return `${prefix} ${(0, helpers_1.capitalizeFirst)(root)}${modifier}`;
        }
        return `${prefix} ${(0, helpers_1.capitalizeFirst)(root)}`;
    }
    generateOccupationalSurname() {
        const occupation = this.rng.randomElement(constants_1.OCCUPATION_ROOTS);
        // 70% chance to use base occupation, 30% to add simple variation
        if (this.rng.randomBoolean(0.7)) {
            return (0, helpers_1.capitalizeFirst)(occupation);
        }
        else {
            const suffixes = ['s', 'sen', 'man'];
            return (0, helpers_1.capitalizeFirst)(occupation + this.rng.randomElement(suffixes));
        }
    }
    generatePatronymicSurname() {
        const patronymicBases = [
            'jan', 'piet', 'henk', 'klaas', 'dirk', 'gerard', 'willem', 'cornelis',
            'jacob', 'martin', 'anton', 'bernard', 'simon', 'theodor'
        ];
        const base = this.rng.randomElement(patronymicBases);
        const suffixes = ['sen', 'sz', 'zoon', 's'];
        return (0, helpers_1.capitalizeFirst)(base + this.rng.randomElement(suffixes));
    }
    generateSimpleToponymicSurname(region) {
        const roots = this.getSurnameRootsByRegion(region);
        const root = this.rng.randomElement(roots);
        // Simple place-based names without complex compounds
        if (this.rng.randomBoolean(0.3)) {
            const simpleModifiers = ['dijk', 'berg', 'huis', 'hof'];
            return (0, helpers_1.capitalizeFirst)(root + this.rng.randomElement(simpleModifiers));
        }
        return (0, helpers_1.capitalizeFirst)(root);
    }
    isUnique(fullName, avoidDuplicates) {
        if (!avoidDuplicates)
            return true;
        return !this.generatedNames.has(fullName.toLowerCase());
    }
    selectRandomGeneration() {
        // Randomized distribution instead of fixed percentages
        const distributions = [
            // More traditional heavy (40-30-30)
            [0.4, 0.7, 1.0],
            // Balanced (33-33-34)
            [0.33, 0.66, 1.0],
            // Modern heavy (20-50-30)
            [0.2, 0.7, 1.0],
            // Contemporary heavy (20-30-50)
            [0.2, 0.5, 1.0],
            // Even spread (25-35-40)
            [0.25, 0.6, 1.0]
        ];
        const selectedDistribution = this.rng.randomElement(distributions);
        const rand = this.rng.random();
        if (rand < selectedDistribution[0])
            return 'traditional';
        if (rand < selectedDistribution[1])
            return 'modern';
        return 'contemporary';
    }
    selectRandomRegion() {
        // Randomized regional distribution
        const distributions = [
            // North heavy [0.4, 0.6, 0.8, 1.0]
            [0.4, 0.6, 0.8, 1.0],
            // South heavy [0.15, 0.5, 0.75, 1.0]
            [0.15, 0.5, 0.75, 1.0],
            // Randstad heavy [0.15, 0.3, 0.7, 1.0]
            [0.15, 0.3, 0.7, 1.0],
            // Balanced [0.25, 0.5, 0.75, 1.0]
            [0.25, 0.5, 0.75, 1.0],
            // General heavy [0.15, 0.3, 0.45, 1.0]
            [0.15, 0.3, 0.45, 1.0]
        ];
        const selectedDistribution = this.rng.randomElement(distributions);
        const rand = this.rng.random();
        if (rand < selectedDistribution[0])
            return 'north';
        if (rand < selectedDistribution[1])
            return 'south';
        if (rand < selectedDistribution[2])
            return 'randstad';
        return 'general';
    }
    generateName(options = {}) {
        const selectedGender = options.gender || (this.rng.randomBoolean() ? 'male' : 'female');
        // Handle generation selection - convert 'general' to specific generation
        let selectedGeneration;
        if (!options.generation || options.generation === 'general') {
            selectedGeneration = this.selectRandomGeneration();
        }
        else {
            selectedGeneration = options.generation;
        }
        // Handle region selection
        let selectedRegion;
        if (!options.region || options.region === 'general') {
            selectedRegion = this.selectRandomRegion();
        }
        else {
            selectedRegion = options.region;
        }
        let attempts = 0;
        let name;
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
        // Track unique names for statistics
        this.generatedFirstNames.add(name.firstName.toLowerCase());
        this.generatedLastNames.add(name.lastName.toLowerCase());
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
    // Add a convenience method for generating mixed-era names
    generateMixedEraNames(count, options = {}) {
        // Now we can safely pass 'general' since GenerationOptions supports it
        return this.generateNames(count, { ...options, generation: 'general' });
    }
    // Add a method for completely random names (all eras, all regions)
    generateRandomNames(count, options = {}) {
        // Now we can safely pass 'general' for both
        return this.generateNames(count, {
            ...options,
            generation: 'general',
            region: 'general'
        });
    }
    clearDuplicateCache() {
        this.generatedNames.clear();
        this.generatedFirstNames.clear();
        this.generatedLastNames.clear();
    }
    getStats() {
        return {
            totalGenerated: this.generatedNames.size,
            cacheSize: this.generatedNames.size,
            uniqueFirstNames: this.generatedFirstNames.size,
            uniqueLastNames: this.generatedLastNames.size
        };
    }
    setSeed(seed) {
        this.rng.setSeed(seed);
        this.clearDuplicateCache();
    }
}
exports.DutchPhoneticNameGenerator = DutchPhoneticNameGenerator;
//# sourceMappingURL=generator.js.map