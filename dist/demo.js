"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generator_1 = require("./generator");
const console_1 = require("./console");
async function main() {
    const console = new console_1.PrettyConsole();
    await console.showTitle();
    console.showWelcomeBox();
    const generator = new generator_1.DutchPhoneticNameGenerator();
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
//# sourceMappingURL=demo.js.map