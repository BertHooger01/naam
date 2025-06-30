"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runInteractiveDemo = runInteractiveDemo;
const generator_1 = require("../../core/generator");
const console_1 = require("./console");
const output_1 = require("./output");
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
const constants_1 = require("../../core/constants");
const readline = __importStar(require("readline"));
async function runInteractiveDemo() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    const prettyConsole = new console_1.PrettyConsole();
    const generator = new generator_1.DutchPhoneticNameGenerator();
    await prettyConsole.showTitle();
    prettyConsole.showWelcomeBox();
    // Show initial example
    const randomName = generator.generateName();
    prettyConsole.showSingleName('🎲 Random Name Example', randomName);
    console.log(chalk_1.default.yellow.bold('\n🎮 Interactive Mode - Choose an option:\n'));
    const askQuestion = (question) => {
        return new Promise((resolve) => {
            rl.question(question, (answer) => {
                resolve(answer.trim());
            });
        });
    };
    const showMenu = () => {
        console.log(chalk_1.default.cyan.bold('\n📋 Available Commands:'));
        console.log(chalk_1.default.white('  1️⃣  Generate random names'));
        console.log(chalk_1.default.white('  2️⃣  Generate by gender (male/female)'));
        console.log(chalk_1.default.white('  3️⃣  Generate by region (north/south/randstad)'));
        console.log(chalk_1.default.white('  4️⃣  Generate by era (traditional/modern/contemporary)'));
        console.log(chalk_1.default.white('  5️⃣  Show statistics'));
        console.log(chalk_1.default.white('  6️⃣  Export to file'));
        console.log(chalk_1.default.white('  7️⃣  Show examples from all regions'));
        console.log(chalk_1.default.white('  8️⃣  Show examples from all eras'));
        console.log(chalk_1.default.white('  9️⃣  Help & usage examples'));
        console.log(chalk_1.default.red('  0️⃣  Exit'));
        console.log(chalk_1.default.dim('\nEnter your choice (0-9): '));
    };
    const generateNamesInteractive = async () => {
        try {
            const countStr = await askQuestion(chalk_1.default.cyan('How many names? (default: 10): '));
            const count = parseInt(countStr) || 10;
            if (count > 100) {
                console.log(chalk_1.default.yellow('⚠️  Large count detected. This might take a moment...'));
            }
            const spinner = (0, ora_1.default)(`Generating ${count} Dutch names...`).start();
            const names = generator.generateNames(count);
            spinner.succeed(`Generated ${count} names!`);
            prettyConsole.showNameTable('🎲 Random Names', names);
        }
        catch (error) {
            console.log(chalk_1.default.red('❌ Error generating names'));
        }
    };
    const generateByGender = async () => {
        try {
            const gender = await askQuestion(chalk_1.default.cyan('Gender (male/female): '));
            if (!['male', 'female'].includes(gender.toLowerCase())) {
                console.log(chalk_1.default.red('❌ Invalid gender. Please enter "male" or "female"'));
                return;
            }
            const countStr = await askQuestion(chalk_1.default.cyan('How many names? (default: 10): '));
            const count = parseInt(countStr) || 10;
            const spinner = (0, ora_1.default)(`Generating ${count} ${gender} names...`).start();
            const names = generator.generateNames(count, { gender: gender });
            spinner.succeed(`Generated ${count} ${gender} names!`);
            prettyConsole.showNameTable(`👥 ${gender.charAt(0).toUpperCase() + gender.slice(1)} Names`, names);
        }
        catch (error) {
            console.log(chalk_1.default.red('❌ Error generating names'));
        }
    };
    const generateByRegion = async () => {
        try {
            console.log(chalk_1.default.dim('Available regions: north, south, randstad'));
            const region = await askQuestion(chalk_1.default.cyan('Region: '));
            if (!['north', 'south', 'randstad'].includes(region.toLowerCase())) {
                console.log(chalk_1.default.red('❌ Invalid region. Please enter "north", "south", or "randstad"'));
                return;
            }
            const countStr = await askQuestion(chalk_1.default.cyan('How many names? (default: 10): '));
            const count = parseInt(countStr) || 10;
            const spinner = (0, ora_1.default)(`Generating ${count} ${region} names...`).start();
            const names = generator.generateRegionalNames(count, region);
            spinner.succeed(`Generated ${count} ${region} names!`);
            prettyConsole.showNameTable(`🗺️ ${region.charAt(0).toUpperCase() + region.slice(1)} Names`, names);
        }
        catch (error) {
            console.log(chalk_1.default.red('❌ Error generating names'));
        }
    };
    const generateByEra = async () => {
        try {
            console.log(chalk_1.default.dim('Available eras: traditional, modern, contemporary'));
            const era = await askQuestion(chalk_1.default.cyan('Era: '));
            if (!['traditional', 'modern', 'contemporary'].includes(era.toLowerCase())) {
                console.log(chalk_1.default.red('❌ Invalid era. Please enter "traditional", "modern", or "contemporary"'));
                return;
            }
            const countStr = await askQuestion(chalk_1.default.cyan('How many names? (default: 10): '));
            const count = parseInt(countStr) || 10;
            const spinner = (0, ora_1.default)(`Generating ${count} ${era} names...`).start();
            const names = generator.generateNames(count, { generation: era });
            spinner.succeed(`Generated ${count} ${era} names!`);
            prettyConsole.showNameTable(`📅 ${era.charAt(0).toUpperCase() + era.slice(1)} Names`, names);
        }
        catch (error) {
            console.log(chalk_1.default.red('❌ Error generating names'));
        }
    };
    const showStatistics = async () => {
        try {
            const countStr = await askQuestion(chalk_1.default.cyan('Sample size for statistics? (default: 100): '));
            const count = parseInt(countStr) || 100;
            const statsNames = await prettyConsole.generateWithSpinner(count, 'names for statistics');
            prettyConsole.showStats(statsNames);
        }
        catch (error) {
            console.log(chalk_1.default.red('❌ Error generating statistics'));
        }
    };
    const exportToFile = async () => {
        try {
            const countStr = await askQuestion(chalk_1.default.cyan('How many names to export? (default: 100): '));
            const count = parseInt(countStr) || 100;
            const format = await askQuestion(chalk_1.default.cyan('Format (csv/json/txt) [default: csv]: '));
            const selectedFormat = ['csv', 'json', 'txt'].includes(format.toLowerCase()) ? format.toLowerCase() : 'csv';
            const filename = await askQuestion(chalk_1.default.cyan(`Filename (default: interactive-export.${selectedFormat}): `));
            const outputPath = filename || `${constants_1.DEFAULT_OPTIONS.OUTPUT_DIR}/interactive-export.${selectedFormat}`;
            const spinner = (0, ora_1.default)(`Generating and exporting ${count} names...`).start();
            const names = generator.generateNames(count);
            await (0, output_1.handleFileOutput)(names, outputPath, selectedFormat);
            spinner.succeed(`Exported ${count} names to ${outputPath}!`);
        }
        catch (error) {
            console.log(chalk_1.default.red('❌ Error exporting names'));
        }
    };
    const showAllRegions = async () => {
        console.log(chalk_1.default.blue.bold('\n🗺️ Regional Showcase\n'));
        const regions = [
            { name: 'Northern Netherlands', key: 'north', desc: 'Frisian influences' },
            { name: 'Southern Netherlands', key: 'south', desc: 'Brabant & Limburg style' },
            { name: 'Randstad', key: 'randstad', desc: 'Urban metropolitan area' }
        ];
        for (const region of regions) {
            const names = generator.generateRegionalNames(5, region.key);
            console.log(chalk_1.default.yellow(`\n${region.name} (${region.desc}):`));
            names.forEach((name, index) => {
                const genderIcon = name.gender === 'male' ? '♂' : '♀';
                console.log(`  ${index + 1}. ${name.fullName} ${genderIcon}`);
            });
        }
    };
    const showAllEras = async () => {
        console.log(chalk_1.default.blue.bold('\n📅 Historical Showcase\n'));
        const eras = [
            { name: 'Traditional Era', key: 'traditional', desc: 'Pre-1950 classic names' },
            { name: 'Modern Era', key: 'modern', desc: '1950-2000 popular names' },
            { name: 'Contemporary Era', key: 'contemporary', desc: '2000+ current names' }
        ];
        for (const era of eras) {
            const names = generator.generateNames(5, { generation: era.key });
            console.log(chalk_1.default.yellow(`\n${era.name} (${era.desc}):`));
            names.forEach((name, index) => {
                const genderIcon = name.gender === 'male' ? '♂' : '♀';
                console.log(`  ${index + 1}. ${name.fullName} ${genderIcon}`);
            });
        }
    };
    const showHelp = () => {
        prettyConsole.showUsageExamples();
        console.log(chalk_1.default.cyan.bold('\n💡 Pro Tips:'));
        console.log(chalk_1.default.white('• Use seeds for reproducible results: dutch-names gen -s 12345'));
        console.log(chalk_1.default.white('• Combine options: dutch-names gen -r north -e traditional -g male'));
        console.log(chalk_1.default.white('• Export large datasets: dutch-names export -c 10000 --no-duplicates'));
    };
    // Main interactive loop
    const runLoop = async () => {
        while (true) {
            showMenu();
            const choice = await askQuestion('');
            switch (choice) {
                case '1':
                    await generateNamesInteractive();
                    break;
                case '2':
                    await generateByGender();
                    break;
                case '3':
                    await generateByRegion();
                    break;
                case '4':
                    await generateByEra();
                    break;
                case '5':
                    await showStatistics();
                    break;
                case '6':
                    await exportToFile();
                    break;
                case '7':
                    await showAllRegions();
                    break;
                case '8':
                    await showAllEras();
                    break;
                case '9':
                    showHelp();
                    break;
                case '0':
                    console.log(chalk_1.default.green('\n👋 Goodbye! Thanks for using the Dutch Name Generator!'));
                    rl.close();
                    return;
                default:
                    console.log(chalk_1.default.red('❌ Invalid choice. Please enter a number from 0-9.'));
            }
            // Pause before showing menu again
            await askQuestion(chalk_1.default.dim('\nPress Enter to continue...'));
        }
    };
    await runLoop();
}
//# sourceMappingURL=interactive.js.map