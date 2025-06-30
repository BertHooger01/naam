export const TRADITIONAL_MALE_NAMES = [
    'jan', 'piet', 'klaas', 'hendrik', 'willem', 'cornelis', 'johannes', 'gerrit', 'adriaan', 'jacobus'
];

export const TRADITIONAL_FEMALE_NAMES = [
    'anna', 'maria', 'johanna', 'catharina', 'hendrika', 'cornelia', 'geertruida', 'margaretha'
];

export const MODERN_MALE_NAMES = [
    'henk', 'cor', 'ger', 'mar', 'bas', 'tim', 'tom', 'ben', 'max', 'sam', 'lars', 'bram', 'rick'
];

export const MODERN_FEMALE_NAMES = [
    'marie', 'lies', 'sanne', 'maud', 'amber', 'jade', 'lara', 'nina', 'lotte', 'sophie', 'julia'
];

export const CONTEMPORARY_MALE_NAMES = [
    'finn', 'sem', 'daan', 'noah', 'liam', 'lucas', 'milan', 'thijs', 'stijn', 'joep', 'koen', 'niek'
];

export const CONTEMPORARY_FEMALE_NAMES = [
    'eva', 'emi', 'isa', 'noa', 'fleur', 'luna', 'milou', 'emma', 'zoë', 'evi', 'bo', 'liv'
];

export const NORTHERN_SYLLABLES = ['klaas', 'sjoerd', 'wiebe', 'fokke', 'tjeerd'];
export const SOUTHERN_SYLLABLES = ['jos', 'ton', 'frans', 'piet'];
export const RANDSTAD_SYLLABLES = ['alexander', 'sebastiaan', 'maximilian'];

export const NAME_START_CONSONANTS = ['b', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'r', 's', 't', 'v', 'w'];
export const SHORT_VOWELS = ['a', 'e', 'i', 'o', 'u'];
export const LONG_VOWELS = ['aa', 'ee', 'ie', 'oo', 'uu'];
export const DIPHTHONGS = ['ei', 'ij', 'au', 'ou', 'eu', 'ui'];
export const MALE_ENDINGS = ['', 'k', 's', 't', 'n', 'r'];
export const FEMALE_ENDINGS = ['a', 'e', 'ie', 'ke', 'je'];

export const SURNAME_PREFIXES = ['van', 'de', 'van de', 'van der', 'van den', 'ter', 'te', 'op de', 'in de'];

export const NORTHERN_SURNAME_ROOTS = ['berg', 'dijk', 'meer', 'veen', 'woud', 'heide'];
export const SOUTHERN_SURNAME_ROOTS = ['hof', 'kamp', 'veld', 'bos', 'dal', 'broek'];
export const GENERAL_SURNAME_ROOTS = [
    'huis', 'weg', 'beek', 'laan', 'straat', 'hoek', 'poel', 'horst', 'akker', 'bosch',
    'donk', 'gaard', 'haven', 'molen', 'werf', 'zand', 'kerk', 'hout', 'steen', 'water', 'wind', 'kool'
];

export const OCCUPATION_ROOTS = [
    'bakker', 'smit', 'mulder', 'visser', 'boer', 'jager', 'schrijver', 'schilder', 'timmerman',
    'smid', 'brouwer', 'kuiper', 'slager', 'dekker', 'scholte', 'koning', 'prins'
];

export const COMMON_SURNAME_WEIGHTS = new Map([
    ['de jong', 0.15],
    ['jansen', 0.12],
    ['de vries', 0.10],
    ['bakker', 0.08],
    ['visser', 0.06]
]);

export const REGIONS = {
    NORTH: 'north' as const,
    SOUTH: 'south' as const,
    RANDSTAD: 'randstad' as const,
    GENERAL: 'general' as const
};

export const GENERATIONS = {
    TRADITIONAL: 'traditional' as const,
    MODERN: 'modern' as const,
    CONTEMPORARY: 'contemporary' as const,
    GENERAL: 'general' as const
};

export const GENDERS = {
    MALE: 'male' as const,
    FEMALE: 'female' as const
};

export const EXPORT_FORMATS = {
    CSV: 'csv' as const,
    JSON: 'json' as const,
    TXT: 'txt' as const
};

export const DEFAULT_OPTIONS = {
    COUNT: 10,
    REGION: REGIONS.GENERAL,
    GENERATION: GENERATIONS.GENERAL,
    FORMAT: EXPORT_FORMATS.CSV,
    OUTPUT_DIR: 'output'
};