import { DutchPhoneticNameGenerator } from '../../core/generator';
import { PrettyConsole } from './console';
import { handleFileOutput } from './output';
import chalk from 'chalk';
import ora from 'ora';
import { DEFAULT_OPTIONS } from '../../core/constants';
import * as readline from 'readline';

export async function runInteractiveDemo(): Promise<void> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const prettyConsole = new PrettyConsole();
    const generator = new DutchPhoneticNameGenerator();

    await prettyConsole.showTitle();
    prettyConsole.showWelcomeBox();

    const randomName = generator.generateName();
    prettyConsole.showSingleName('🎲 Random Name Example', randomName);

    console.log(chalk.yellow.bold('\n🎮 Interactive Mode - Choose an option:\n'));

    const askQuestion = (question: string): Promise<string> => {
        return new Promise((resolve) => {
            rl.question(question, (answer: string) => {
                resolve(answer.trim());
            });
        });
    };

    const showMenu = () => {
        console.log(chalk.cyan.bold('\n📋 Available Commands:'));
        console.log(chalk.white('  1️⃣  Generate random names'));
        console.log(chalk.white('  2️⃣  Generate by gender (male/female)'));
        console.log(chalk.white('  3️⃣  Generate by region (north/south/randstad)'));
        console.log(chalk.white('  4️⃣  Generate by era (traditional/modern/contemporary)'));
        console.log(chalk.white('  5️⃣  Show statistics'));
        console.log(chalk.white('  6️⃣  Export to file'));
        console.log(chalk.white('  7️⃣  Show examples from all regions'));
        console.log(chalk.white('  8️⃣  Show examples from all eras'));
        console.log(chalk.white('  9️⃣  Help & usage examples'));
        console.log(chalk.red('  0️⃣  Exit'));
        console.log(chalk.dim('\nEnter your choice (0-9): '));
    };

    const generateNamesInteractive = async () => {
        try {
            const countStr = await askQuestion(chalk.cyan('How many names? (default: 10): '));
            const count = parseInt(countStr) || 10;

            if (count > 100) {
                console.log(chalk.yellow('⚠️  Large count detected. This might take a moment...'));
            }

            const spinner = ora(`Generating ${count} Dutch names...`).start();
            const names = generator.generateNames(count);
            spinner.succeed(`Generated ${count} names!`);

            prettyConsole.showNameTable('🎲 Random Names', names);
        } catch (error) {
            console.log(chalk.red('❌ Error generating names'));
        }
    };

    const generateByGender = async () => {
        try {
            const gender = await askQuestion(chalk.cyan('Gender (male/female): '));
            if (!['male', 'female'].includes(gender.toLowerCase())) {
                console.log(chalk.red('❌ Invalid gender. Please enter "male" or "female"'));
                return;
            }

            const countStr = await askQuestion(chalk.cyan('How many names? (default: 10): '));
            const count = parseInt(countStr) || 10;

            const spinner = ora(`Generating ${count} ${gender} names...`).start();
            const names = generator.generateNames(count, { gender: gender as 'male' | 'female' });
            spinner.succeed(`Generated ${count} ${gender} names!`);

            prettyConsole.showNameTable(`👥 ${gender.charAt(0).toUpperCase() + gender.slice(1)} Names`, names);
        } catch (error) {
            console.log(chalk.red('❌ Error generating names'));
        }
    };

    const generateByRegion = async () => {
        try {
            console.log(chalk.dim('Available regions: north, south, randstad'));
            const region = await askQuestion(chalk.cyan('Region: '));
            if (!['north', 'south', 'randstad'].includes(region.toLowerCase())) {
                console.log(chalk.red('❌ Invalid region. Please enter "north", "south", or "randstad"'));
                return;
            }

            const countStr = await askQuestion(chalk.cyan('How many names? (default: 10): '));
            const count = parseInt(countStr) || 10;

            const spinner = ora(`Generating ${count} ${region} names...`).start();
            const names = generator.generateRegionalNames(count, region as any);
            spinner.succeed(`Generated ${count} ${region} names!`);

            prettyConsole.showNameTable(`🗺️ ${region.charAt(0).toUpperCase() + region.slice(1)} Names`, names);
        } catch (error) {
            console.log(chalk.red('❌ Error generating names'));
        }
    };

    const generateByEra = async () => {
        try {
            console.log(chalk.dim('Available eras: traditional, modern, contemporary'));
            const era = await askQuestion(chalk.cyan('Era: '));
            if (!['traditional', 'modern', 'contemporary'].includes(era.toLowerCase())) {
                console.log(chalk.red('❌ Invalid era. Please enter "traditional", "modern", or "contemporary"'));
                return;
            }

            const countStr = await askQuestion(chalk.cyan('How many names? (default: 10): '));
            const count = parseInt(countStr) || 10;

            const spinner = ora(`Generating ${count} ${era} names...`).start();
            const names = generator.generateNames(count, { generation: era as any });
            spinner.succeed(`Generated ${count} ${era} names!`);

            prettyConsole.showNameTable(`📅 ${era.charAt(0).toUpperCase() + era.slice(1)} Names`, names);
        } catch (error) {
            console.log(chalk.red('❌ Error generating names'));
        }
    };

    const showStatistics = async () => {
        try {
            const countStr = await askQuestion(chalk.cyan('Sample size for statistics? (default: 100): '));
            const count = parseInt(countStr) || 100;

            const statsNames = await prettyConsole.generateWithSpinner(count, 'names for statistics');
            prettyConsole.showStats(statsNames);
        } catch (error) {
            console.log(chalk.red('❌ Error generating statistics'));
        }
    };

    const exportToFile = async () => {
        try {
            const countStr = await askQuestion(chalk.cyan('How many names to export? (default: 100): '));
            const count = parseInt(countStr) || 100;

            const format = await askQuestion(chalk.cyan('Format (csv/json/txt) [default: csv]: '));
            const selectedFormat = ['csv', 'json', 'txt'].includes(format.toLowerCase()) ? format.toLowerCase() : 'csv';

            const filename = await askQuestion(chalk.cyan(`Filename (default: interactive-export.${selectedFormat}): `));
            const outputPath = filename || `${DEFAULT_OPTIONS.OUTPUT_DIR}/interactive-export.${selectedFormat}`;

            const spinner = ora(`Generating and exporting ${count} names...`).start();
            const names = generator.generateNames(count);

            await handleFileOutput(names, outputPath, selectedFormat);
            spinner.succeed(`Exported ${count} names to ${outputPath}!`);
        } catch (error) {
            console.log(chalk.red('❌ Error exporting names'));
        }
    };

    const showAllRegions = async () => {
        console.log(chalk.blue.bold('\n🗺️ Regional Showcase\n'));

        const regions = [
            { name: 'Northern Netherlands', key: 'north', desc: 'Frisian influences' },
            { name: 'Southern Netherlands', key: 'south', desc: 'Brabant & Limburg style' },
            { name: 'Randstad', key: 'randstad', desc: 'Urban metropolitan area' }
        ];

        for (const region of regions) {
            const names = generator.generateRegionalNames(5, region.key as any);
            console.log(chalk.yellow(`\n${region.name} (${region.desc}):`));
            names.forEach((name, index) => {
                const genderIcon = name.gender === 'male' ? '♂' : '♀';
                console.log(`  ${index + 1}. ${name.fullName} ${genderIcon}`);
            });
        }
    };

    const showAllEras = async () => {
        console.log(chalk.blue.bold('\n📅 Historical Showcase\n'));

        const eras = [
            { name: 'Traditional Era', key: 'traditional', desc: 'Pre-1950 classic names' },
            { name: 'Modern Era', key: 'modern', desc: '1950-2000 popular names' },
            { name: 'Contemporary Era', key: 'contemporary', desc: '2000+ current names' }
        ];

        for (const era of eras) {
            const names = generator.generateNames(5, { generation: era.key as any });
            console.log(chalk.yellow(`\n${era.name} (${era.desc}):`));
            names.forEach((name, index) => {
                const genderIcon = name.gender === 'male' ? '♂' : '♀';
                console.log(`  ${index + 1}. ${name.fullName} ${genderIcon}`);
            });
        }
    };

    const showHelp = () => {
        prettyConsole.showUsageExamples();
        console.log(chalk.cyan.bold('\n💡 Pro Tips:'));
        console.log(chalk.white('• Use seeds for reproducible results: dutch-names gen -s 12345'));
        console.log(chalk.white('• Combine options: dutch-names gen -r north -e traditional -g male'));
        console.log(chalk.white('• Export large datasets: dutch-names export -c 10000 --no-duplicates'));
    };

    const runLoop = async (): Promise<void> => {
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
                    console.log(chalk.green('\n👋 Goodbye! Thanks for using the Dutch Name Generator!'));
                    rl.close();
                    return;
                default:
                    console.log(chalk.red('❌ Invalid choice. Please enter a number from 0-9.'));
            }

            await askQuestion(chalk.dim('\nPress Enter to continue...'));
        }
    };

    await runLoop();
}