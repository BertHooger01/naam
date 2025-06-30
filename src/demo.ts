import { DutchPhoneticNameGenerator } from './generator';
import { PrettyConsole } from './console';

async function main(): Promise<void> {
    const console = new PrettyConsole();

    await console.showTitle();
    console.showWelcomeBox();

    const generator = new DutchPhoneticNameGenerator();

    const randomName = generator.generateName();
    console.showSingleName('🎲 Random Name Example', randomName);

    const maleName = generator.generateMaleName();
    console.showSingleName('👨 Male Name Example', maleName);

    const femaleName = generator.generateFemaleName();
    console.showSingleName('👩 Female Name Example', femaleName);

    const names = await console.generateWithSpinner(12, 'random Dutch names');
    console.showNameTable('🇳🇱 Generated Name Collection', names);

    const statsNames = await console.generateWithSpinner(50, 'names for statistics');
    console.showStats(statsNames);

    console.showUsageExamples();
    console.showFooter();
}

if (require.main === module) {
    main().catch(console.error);
}