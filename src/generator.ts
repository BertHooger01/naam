export interface DutchName {
  firstName: string;
  lastName: string;
  fullName: string;
  gender: 'male' | 'female';
}

export class DutchPhoneticNameGenerator {
  private maleSyllables = [
    'jan', 'piet', 'klaas', 'hen', 'wil', 'cor', 'ger', 'mar', 'bas', 'tim', 'tom', 'ben', 'max', 'sam', 'lars',
    'bram', 'rick', 'nick', 'finn', 'sem', 'daan', 'noah', 'liam', 'lucas', 'milan', 'thijs', 'stijn', 'joep',
    'koen', 'niek', 'ruben', 'sven', 'jesse', 'floris', 'jasper', 'wouter', 'matthijs', 'jurgen', 'stefan'
  ];

  private femaleSyllables = [
    'an', 'ma', 'lie', 'san', 'eva', 'emi', 'isa', 'noa', 'lot', 'fem', 'roos', 'iris', 'lynn', 'fleur',
    'sanne', 'maud', 'amber', 'jade', 'luna', 'milou', 'lara', 'nina', 'lotte', 'sophie', 'julia', 'sarah',
    'laura', 'anne', 'lisa', 'emma', 'zoë', 'evi', 'bo', 'liv', 'anna', 'marie', 'sara', 'tess', 'eline'
  ];

  private nameStartConsonants = ['b', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'r', 's', 't', 'v', 'w'];
  private shortVowels = ['a', 'e', 'i', 'o', 'u'];
  private longVowels = ['aa', 'ee', 'ie', 'oo', 'uu'];
  private diphthongs = ['ei', 'ij', 'au', 'ou', 'eu', 'ui'];
  private maleEndings = ['', 'k', 's', 't', 'n', 'r'];
  private femaleEndings = ['a', 'e', 'ie', 'ke', 'je'];

  private surnamePrefix = ['van', 'de', 'van de', 'van der', 'van den', 'ter', 'te'];
  private surnameRoots = [
    'berg', 'dijk', 'veld', 'hof', 'kamp', 'bos', 'meer', 'dal', 'huis', 'weg', 'beek', 'broek', 'laan',
    'straat', 'hoek', 'woud', 'heide', 'poel', 'horst', 'akker', 'bosch', 'donk', 'gaard', 'haven',
    'molen', 'veen', 'werf', 'zand', 'kerk', 'hout', 'steen', 'water', 'wind', 'kool'
  ];
  private occupationRoots = [
    'bakker', 'smit', 'mulder', 'visser', 'boer', 'jager', 'schrijver', 'schilder', 'timmerman',
    'smid', 'brouwer', 'kuiper', 'slager', 'dekker', 'weaver', 'scholte', 'koning', 'prins'
  ];

  private generateFirstName(gender: 'male' | 'female'): string {
    const syllables = gender === 'male' ? this.maleSyllables : this.femaleSyllables;

    if (Math.random() < 0.7) {
      const base = this.getRandomElement(syllables);

      if (Math.random() < 0.3) {
        return this.addSimpleVariation(base, gender);
      }

      return this.capitalizeFirst(base);
    } else {
      return this.createDutchVariant(gender);
    }
  }

  private addSimpleVariation(base: string, gender: 'male' | 'female'): string {
    const endings = gender === 'male' ? this.maleEndings : this.femaleEndings;

    if (Math.random() < 0.5 && endings.length > 0) {
      const ending = this.getRandomElement(endings);
      if (ending && !base.endsWith(ending)) {
        return this.capitalizeFirst(base + ending);
      }
    }

    return this.capitalizeFirst(base);
  }

  private createDutchVariant(gender: 'male' | 'female'): string {
    let name = '';

    name += this.getRandomElement(this.nameStartConsonants);

    const vowelType = Math.random();
    if (vowelType < 0.5) {
      name += this.getRandomElement(this.shortVowels);
    } else if (vowelType < 0.8) {
      name += this.getRandomElement(this.longVowels);
    } else {
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

  private generateLastName(): string {
    const nameType = Math.random();

    if (nameType < 0.6) {
      const prefix = this.getRandomElement(this.surnamePrefix);
      const root = this.getRandomElement(this.surnameRoots);
      return `${prefix} ${this.capitalizeFirst(root)}`;
    } else if (nameType < 0.85) {
      return this.capitalizeFirst(this.getRandomElement(this.occupationRoots));
    } else {
      return this.capitalizeFirst(this.generateSimpleSurname());
    }
  }

  private generateSimpleSurname(): string {
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

  generateName(gender?: 'male' | 'female'): DutchName {
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

  generateNames(count: number, gender?: 'male' | 'female'): DutchName[] {
    const names: DutchName[] = [];
    for (let i = 0; i < count; i++) {
      names.push(this.generateName(gender));
    }
    return names;
  }

  generateMaleName(): DutchName {
    return this.generateName('male');
  }

  generateFemaleName(): DutchName {
    return this.generateName('female');
  }

  private getRandomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  private capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}