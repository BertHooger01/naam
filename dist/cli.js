"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const generator_1 = require("./generator");
const console_1 = require("./console");
const csv_exporter_1 = require("./csv-exporter");
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const program = new commander_1.Command();
const generator = new generator_1.DutchPhoneticNameGenerator();
const prettyConsole = new console_1.PrettyConsole();
const csvExporter = new csv_exporter_1.CSVExporter();
program
    .name('dutch-names')
    .description('Generate authentic Dutch names using phonetic patterns')
    .version('1.0.0');
program
    .command('generate')
    .alias('gen')
    .description('Generate Dutch names')
    .option('-c, --count <number>', 'number of names to generate', '10')
    .option('-g, --gender <gender>', 'gender filter (male|female)', 'random')
    .option('-o, --output <file>', 'output CSV file path')
    .option('-f, --format <format>', 'output format (table|csv|json)', 'table')
    .option('--no-color', 'disable colored output')
    .option('--quiet', 'minimal output')
    .action(async (options) => {
    const count = parseInt(options.count);
    const gender = options.gender === 'random' ? undefined : options.gender;
    if (isNaN(count) || count <= 0) {
        console.error(chalk_1.default.red('Error: Count must be a positive number'));
        process.exit(1);
    }
    if (options.gender !== 'random' && !['male', 'female'].includes(options.gender)) {
        console.error(chalk_1.default.red('Error: Gender must be "male", "female", or "random"'));
        process.exit(1);
    }
    const spinner = (0, ora_1.default)(`Generating ${count} Dutch names...`).start();
    try {
        const names = generator.generateNames(count, gender);
        spinner.succeed(`Generated ${count} authentic Dutch names!`);
        if (options.output) {
            await handleFileOutput(names, options.output, options.format);
        }
        else {
            handleConsoleOutput(names, options.format, options.quiet);
        }
    }
    catch (error) {
        spinner.fail('Failed to generate names');
        console.error(chalk_1.default.red(`Error: ${error}`));
        process.exit(1);
    }
});
program
    .command('demo')
    .description('Run interactive demo')
    .action(async () => {
    await runInteractiveDemo();
});
program
    .command('export')
    .description('Export names to various formats')
    .option('-c, --count <number>', 'number of names to generate', '100')
    .option('-o, --output <file>', 'output file path (required)')
    .option('-f, --format <format>', 'export format (csv|json|txt)', 'csv')
    .option('-g, --gender <gender>', 'gender filter (male|female|random)', 'random')
    .requiredOption('-o, --output <file>', 'output file path is required')
    .action(async (options) => {
    const count = parseInt(options.count);
    const gender = options.gender === 'random' ? undefined : options.gender;
    const spinner = (0, ora_1.default)(`Generating ${count} names for export...`).start();
    try {
        const names = generator.generateNames(count, gender);
        spinner.text = 'Exporting names...';
        await handleFileOutput(names, options.output, options.format);
        spinner.succeed(`Exported ${count} names to ${options.output}`);
    }
    catch (error) {
        spinner.fail('Export failed');
        console.error(chalk_1.default.red(`Error: ${error}`));
        process.exit(1);
    }
});
async function handleFileOutput(names, outputPath, format) {
    const dir = path_1.default.dirname(outputPath);
    if (!fs_1.default.existsSync(dir)) {
        fs_1.default.mkdirSync(dir, { recursive: true });
    }
    switch (format.toLowerCase()) {
        case 'csv':
            await csvExporter.exportToCSV(names, outputPath);
            console.log(chalk_1.default.green(`✓ CSV exported to: ${outputPath}`));
            break;
        case 'json':
            fs_1.default.writeFileSync(outputPath, JSON.stringify(names, null, 2));
            console.log(chalk_1.default.green(`✓ JSON exported to: ${outputPath}`));
            break;
        case 'txt':
            const txtContent = names.map(name => `${name.fullName} (${name.gender})`).join('\n');
            fs_1.default.writeFileSync(outputPath, txtContent);
            console.log(chalk_1.default.green(`✓ Text file exported to: ${outputPath}`));
            break;
        default:
            throw new Error(`Unsupported format: ${format}`);
    }
}
function handleConsoleOutput(names, format, quiet) {
    if (quiet) {
        names.forEach(name => console.log(name.fullName));
        return;
    }
    switch (format.toLowerCase()) {
        case 'table':
            prettyConsole.showNameTable('Generated Names', names);
            break;
        case 'csv':
            console.log('FirstName,LastName,FullName,Gender');
            names.forEach(name => {
                console.log(`${name.firstName},${name.lastName},${name.fullName},${name.gender}`);
            });
            break;
        case 'json':
            console.log(JSON.stringify(names, null, 2));
            break;
        default:
            names.forEach((name, index) => {
                const genderIcon = name.gender === 'male' ? '♂' : '♀';
                console.log(`${(index + 1).toString().padStart(2, '0')}. ${name.fullName} ${genderIcon}`);
            });
    }
}
async function runInteractiveDemo() {
    await prettyConsole.showTitle();
    prettyConsole.showWelcomeBox();
    const randomName = generator.generateName();
    prettyConsole.showSingleName('🎲 Random Name Example', randomName);
    const names = await prettyConsole.generateWithSpinner(12, 'random Dutch names');
    prettyConsole.showNameTable('🇳🇱 Generated Name Collection', names);
    const statsNames = await prettyConsole.generateWithSpinner(50, 'names for statistics');
    prettyConsole.showStats(statsNames);
    prettyConsole.showUsageExamples();
    prettyConsole.showFooter();
}
if (process.argv.length === 2) {
    program.help();
}
program.parse();
//# sourceMappingURL=cli.js.map