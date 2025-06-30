import { Command } from 'commander';
import { DutchPhoneticNameGenerator } from '../../core/generator';
import { DutchName } from '../../core/types';
import { validateCount, validateGender } from '../../utils/validations';
import { DEFAULT_OPTIONS } from '../../core/constants';
import ora from 'ora';
import chalk from 'chalk';

const ERAS_INFO = [
    { name: 'Traditional Era', key: 'traditional' as const, desc: 'Pre-1950 classic names' },
    { name: 'Modern Era', key: 'modern' as const, desc: '1950-2000 popular names' },
    { name: 'Contemporary Era', key: 'contemporary' as const, desc: '2000+ current names' }
];

export function createHistoricalCommand(): Command {
    return new Command('historical')
        .description('Generate names from different time periods')
        .option('-c, --count <number>', 'number of names per era', '15')
        .option('-g, --gender <gender>', 'gender filter (male|female|random)', 'random')
        .option('-o, --output <file>', 'output file path (default: output/historical.[format])')
        .option('-f, --format <format>', 'output format (table|csv|json)', 'table')
        .action(async (options) => {
            try {
                // Validate inputs
                const count = validateCount(options.count);
                const gender = validateGender(options.gender);

                const generator = new DutchPhoneticNameGenerator();

                console.log(chalk.blue.bold('📅 Historical Dutch Names Through Time\n'));

                const allNames: DutchName[] = [];

                for (const era of ERAS_INFO) {
                    const spinner = ora(`Generating ${era.name} names...`).start();

                    try {
                        const names = generator.generateNames(count, {
                            generation: era.key,
                            gender
                        });

                        allNames.push(...names);
                        spinner.succeed(`${era.name} (${era.desc})`);

                        // Show individual era if using table format and no output file
                        if (!options.output && options.format === 'table') {
                            const { PrettyConsole } = await import('../ui/console');
                            const prettyConsole = new PrettyConsole();
                            prettyConsole.showNameTable(`${era.name} Names`, names);
                        }

                    } catch (error) {
                        spinner.fail(`Failed to generate ${era.name} names`);
                        throw error;
                    }
                }

                // Handle file output or combined output
                if (options.output || options.format !== 'table') {
                    const { handleFileOutput } = await import('../ui/output');

                    let outputFile = options.output;
                    if (!outputFile) {
                        const extension = options.format === 'json' ? 'json' : options.format === 'csv' ? 'csv' : 'txt';
                        outputFile = `${DEFAULT_OPTIONS.OUTPUT_DIR}/historical.${extension}`;
                    }

                    await handleFileOutput(allNames, outputFile, options.format);
                    console.log(chalk.green(`✓ Historical names exported to: ${outputFile}`));
                }

            } catch (error) {
                console.error(chalk.red(`Error: ${error instanceof Error ? error.message : error}`));
                process.exit(1);
            }
        });
}