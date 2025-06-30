"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_OPTIONS = exports.EXPORT_FORMATS = exports.GENDERS = exports.GENERATIONS = exports.REGIONS = exports.COMMON_SURNAME_WEIGHTS = exports.OCCUPATION_ROOTS = exports.GENERAL_SURNAME_ROOTS = exports.SOUTHERN_SURNAME_ROOTS = exports.NORTHERN_SURNAME_ROOTS = exports.SURNAME_PREFIXES = exports.FEMALE_ENDINGS = exports.MALE_ENDINGS = exports.DIPHTHONGS = exports.LONG_VOWELS = exports.SHORT_VOWELS = exports.NAME_START_CONSONANTS = exports.RANDSTAD_SYLLABLES = exports.SOUTHERN_SYLLABLES = exports.NORTHERN_SYLLABLES = exports.CONTEMPORARY_FEMALE_NAMES = exports.CONTEMPORARY_MALE_NAMES = exports.MODERN_FEMALE_NAMES = exports.MODERN_MALE_NAMES = exports.TRADITIONAL_FEMALE_NAMES = exports.TRADITIONAL_MALE_NAMES = void 0;
exports.TRADITIONAL_MALE_NAMES = [
    'jan', 'piet', 'klaas', 'hendrik', 'willem', 'cornelis', 'johannes', 'gerrit', 'adriaan', 'jacobus'
];
exports.TRADITIONAL_FEMALE_NAMES = [
    'anna', 'maria', 'johanna', 'catharina', 'hendrika', 'cornelia', 'geertruida', 'margaretha'
];
exports.MODERN_MALE_NAMES = [
    'henk', 'cor', 'ger', 'mar', 'bas', 'tim', 'tom', 'ben', 'max', 'sam', 'lars', 'bram', 'rick'
];
exports.MODERN_FEMALE_NAMES = [
    'marie', 'lies', 'sanne', 'maud', 'amber', 'jade', 'lara', 'nina', 'lotte', 'sophie', 'julia'
];
exports.CONTEMPORARY_MALE_NAMES = [
    'finn', 'sem', 'daan', 'noah', 'liam', 'lucas', 'milan', 'thijs', 'stijn', 'joep', 'koen', 'niek'
];
exports.CONTEMPORARY_FEMALE_NAMES = [
    'eva', 'emi', 'isa', 'noa', 'fleur', 'luna', 'milou', 'emma', 'zoë', 'evi', 'bo', 'liv'
];
exports.NORTHERN_SYLLABLES = ['klaas', 'sjoerd', 'wiebe', 'fokke', 'tjeerd'];
exports.SOUTHERN_SYLLABLES = ['jos', 'ton', 'frans', 'piet'];
exports.RANDSTAD_SYLLABLES = ['alexander', 'sebastiaan', 'maximilian'];
exports.NAME_START_CONSONANTS = ['b', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'r', 's', 't', 'v', 'w'];
exports.SHORT_VOWELS = ['a', 'e', 'i', 'o', 'u'];
exports.LONG_VOWELS = ['aa', 'ee', 'ie', 'oo', 'uu'];
exports.DIPHTHONGS = ['ei', 'ij', 'au', 'ou', 'eu', 'ui'];
exports.MALE_ENDINGS = ['', 'k', 's', 't', 'n', 'r'];
exports.FEMALE_ENDINGS = ['a', 'e', 'ie', 'ke', 'je'];
exports.SURNAME_PREFIXES = ['van', 'de', 'van de', 'van der', 'van den', 'ter', 'te', 'op de', 'in de'];
exports.NORTHERN_SURNAME_ROOTS = ['berg', 'dijk', 'meer', 'veen', 'woud', 'heide'];
exports.SOUTHERN_SURNAME_ROOTS = ['hof', 'kamp', 'veld', 'bos', 'dal', 'broek'];
exports.GENERAL_SURNAME_ROOTS = [
    'huis', 'weg', 'beek', 'laan', 'straat', 'hoek', 'poel', 'horst', 'akker', 'bosch',
    'donk', 'gaard', 'haven', 'molen', 'werf', 'zand', 'kerk', 'hout', 'steen', 'water', 'wind', 'kool'
];
exports.OCCUPATION_ROOTS = [
    'bakker', 'smit', 'mulder', 'visser', 'boer', 'jager', 'schrijver', 'schilder', 'timmerman',
    'smid', 'brouwer', 'kuiper', 'slager', 'dekker', 'scholte', 'koning', 'prins'
];
exports.COMMON_SURNAME_WEIGHTS = new Map([
    ['de jong', 0.15],
    ['jansen', 0.12],
    ['de vries', 0.10],
    ['bakker', 0.08],
    ['visser', 0.06]
]);
exports.REGIONS = {
    NORTH: 'north',
    SOUTH: 'south',
    RANDSTAD: 'randstad',
    GENERAL: 'general'
};
exports.GENERATIONS = {
    TRADITIONAL: 'traditional',
    MODERN: 'modern',
    CONTEMPORARY: 'contemporary',
    GENERAL: 'general'
};
exports.GENDERS = {
    MALE: 'male',
    FEMALE: 'female'
};
exports.EXPORT_FORMATS = {
    CSV: 'csv',
    JSON: 'json',
    TXT: 'txt'
};
exports.DEFAULT_OPTIONS = {
    COUNT: 10,
    REGION: exports.REGIONS.GENERAL,
    GENERATION: exports.GENERATIONS.GENERAL,
    FORMAT: exports.EXPORT_FORMATS.CSV,
    OUTPUT_DIR: 'output'
};
//# sourceMappingURL=constants.js.map