"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DutchPhoneticNameGenerator = void 0;
class DutchPhoneticNameGenerator {
    constructor() {
        this.maleSyllables = [
            'jan', 'piet', 'klaas', 'hen', 'wil', 'cor', 'ger', 'mar', 'bas', 'tim', 'tom', 'ben', 'max', 'sam', 'lars',
            'bram', 'rick', 'nick', 'finn', 'sem', 'daan', 'noah', 'liam', 'lucas', 'milan', 'thijs', 'stijn', 'joep',
            'koen', 'niek', 'ruben', 'sven', 'jesse', 'floris', 'jasper', 'wouter', 'matthijs', 'jurgen', 'stefan'
        ];
        this.femaleSyllables = [
            'an', 'ma', 'lie', 'san', 'eva', 'emi', 'isa', 'noa', 'lot', 'fem', 'roos', 'iris', 'lynn', 'fleur',
            'sanne', 'maud', 'amber', 'jade', 'luna', 'milou', 'lara', 'nina', 'lotte', 'sophie', 'julia', 'sarah',
            'laura', 'anne', 'lisa', 'emma', 'zoë', 'evi', 'bo', 'liv', 'anna', 'marie', 'sara', 'tess', 'eline'
        ];
        this.nameStartConsonants = ['b', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'r', 's', 't', 'v', 'w'];
        this.shortVowels = ['a', 'e', 'i', 'o', 'u'];
        this.longVowels = ['aa', 'ee', 'ie', 'oo', 'uu'];
        this.diphthongs = ['ei', 'ij', 'au', 'ou', 'eu', 'ui'];
        this.maleEndings = ['', 'k', 's', 't', 'n', 'r'];
        this.femaleEndings = ['a', 'e', 'ie', 'ke', 'je'];
        this.surnamePrefix = ['van', 'de', 'van de', 'van der', 'van den', 'ter', 'te'];
        this.surnameRoots = [
            'berg', 'dijk', 'veld', 'hof', 'kamp', 'bos', 'meer', 'dal', 'huis', 'weg', 'beek', 'broek', 'laan',
            'straat', 'hoek', 'woud', 'heide', 'poel', 'horst', 'akker', 'bosch', 'donk', 'gaard', 'haven',
            'molen', 'veen', 'werf', 'zand', 'kerk', 'hout', 'steen', 'water', 'wind', 'kool'
        ];
        this.occupationRoots = [
            'bakker', 'smit', 'mulder', 'visser', 'boer', 'jager', 'schrijver', 'schilder', 'timmerman',
            'smid', 'brouwer', 'kuiper', 'slager', 'dekker', 'weaver', 'scholte', 'koning', 'prins'
        ];
    }
    generateFirstName(gender) {
        const syllables = gender === 'male' ? this.maleSyllables : this.femaleSyllables;
        if (Math.random() < 0.7) {
            const base = this.getRandomElement(syllables);
            if (Math.random() < 0.3) {
                return this.addSimpleVariation(base, gender);
            }
            return this.capitalizeFirst(base);
        }
        else {
            return this.createDutchVariant(gender);
        }
    }
    addSimpleVariation(base, gender) {
        const endings = gender === 'male' ? this.maleEndings : this.femaleEndings;
        if (Math.random() < 0.5 && endings.length > 0) {
            const ending = this.getRandomElement(endings);
            if (ending && !base.endsWith(ending)) {
                return this.capitalizeFirst(base + ending);
            }
        }
        return this.capitalizeFirst(base);
    }
    createDutchVariant(gender) {
        let name = '';
        name += this.getRandomElement(this.nameStartConsonants);
        const vowelType = Math.random();
        if (vowelType < 0.5) {
            name += this.getRandomElement(this.shortVowels);
        }
        else if (vowelType < 0.8) {
            name += this.getRandomElement(this.longVowels);
        }
        else {
            name += this.getRandomElement(this.diphthongs);
        }
        if (Math.random() < 0.6) {
            const consonants = ['n', 'r', 's', 't', 'k', 'l', 'm'];
            name += this.getRandomElement(consonants);
        }
        const endings = gender === 'male' ? this.maleEndings : this.femaleEndings;
        const ending = this.getRandomElement(endings);
        if (ending && !name.endsWith(ending)) {
            name += ending;
        }
        return this.capitalizeFirst(name);
    }
    generateLastName() {
        const nameType = Math.random();
        if (nameType < 0.6) {
            const prefix = this.getRandomElement(this.surnamePrefix);
            const root = this.getRandomElement(this.surnameRoots);
            return `${prefix} ${this.capitalizeFirst(root)}`;
        }
        else if (nameType < 0.85) {
            return this.capitalizeFirst(this.getRandomElement(this.occupationRoots));
        }
        else {
            return this.capitalizeFirst(this.generateSimpleSurname());
        }
    }
    generateSimpleSurname() {
        const patterns = [
            () => {
                const start = this.getRandomElement(['jan', 'pet', 'hen', 'wil', 'ger', 'mar', 'klaas']);
                return start + 'sen';
            },
            () => {
                const roots = ['timmer', 'water', 'schip', 'hoek', 'veld'];
                return this.getRandomElement(roots) + 'man';
            },
            () => {
                return this.getRandomElement(this.surnameRoots);
            }
        ];
        return this.getRandomElement(patterns)();
    }
    generateName(gender) {
        const selectedGender = gender || (Math.random() > 0.5 ? 'male' : 'female');
        const firstName = this.generateFirstName(selectedGender);
        const lastName = this.generateLastName();
        return {
            firstName,
            lastName,
            fullName: `${firstName} ${lastName}`,
            gender: selectedGender
        };
    }
    generateNames(count, gender) {
        const names = [];
        for (let i = 0; i < count; i++) {
            names.push(this.generateName(gender));
        }
        return names;
    }
    generateMaleName() {
        return this.generateName('male');
    }
    generateFemaleName() {
        return this.generateName('female');
    }
    getRandomElement(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}
exports.DutchPhoneticNameGenerator = DutchPhoneticNameGenerator;
//# sourceMappingURL=generator.js.map