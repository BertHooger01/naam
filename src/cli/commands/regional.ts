import { Command } from 'commander';
import { DutchPhoneticNameGenerator } from '../../core/generator';
import { Region } from '../../core/types';
import { validateCount, validateGender } from '../../utils/validations';
import { DEFAULT_OPTIONS } from '../../core/constants';
import ora from 'ora';
import chalk from 'chalk';

const REGIONS_INFO = [
    { name: 'Northern Netherlands', key: 'north' as Region, desc: 'Frisian influences' },
    { name: 'Southern Netherlands', key: 'south' as Region, desc: 'Brabant & Limburg style' },
    { name: 'Randstad', key: 'randstad' as Region, desc: 'Urban metropolitan area' }
];

export function createRegionalCommand(): Command {
    return new Command('regional')
        .description('Generate names from specific Dutch regions')
        .option('-c, --count <number>', 'number of names to generate', '20')
        .option('-g, --gender <gender>', 'gender filter (male|female|random)', 'random')
        .option('-o, --output <file>', 'output file path (default: output/regional-[region].[format])')
        .option('-f, --format <format>', 'output format (table|csv|json)', 'table')
        .action(async (options) => {
            try {
                // Validate inputs
                const count = validateCount(options.count);
                const gender = validateGender(options.gender);

                const generator = new DutchPhoneticNameGenerator();

                console.log(chalk.blue.bold('🇳🇱 Regional Dutch Names Showcase\n'));

                for (const region of REGIONS_INFO) {
                    const spinner = ora(`Generating ${region.name} names...`).start();

                    try {
                        const names = generator.generateRegionalNames(Math.ceil(count / 3), region.key, gender);
                        spinner.succeed(`${region.name} (${region.desc})`);

                        if (options.output || options.format !== 'table') {
                            const { handleFileOutput } = await import('../ui/output');

                            let outputFile = options.output;
                            if (!outputFile && options.format !== 'table') {
                                const extension = options.format === 'json' ? 'json' : options.format === 'csv' ? 'csv' : 'txt';
                                outputFile = `${DEFAULT_OPTIONS.OUTPUT_DIR}/regional-${region.key}.${extension}`;
                            }

                            if (outputFile) {
                                await handleFileOutput(names, outputFile, options.format);
                                console.log(chalk.green(`✓ ${region.name} exported to: ${outputFile}`));
                            }
                        } else {
                            const { PrettyConsole } = await import('../ui/console');
                            const prettyConsole = new PrettyConsole();
                            prettyConsole.showNameTable(`${region.name} Names`, names);
                        }

                    } catch (error) {
                        spinner.fail(`Failed to generate ${region.name} names`);
                        throw error;
                    }
                }

            } catch (error) {
                console.error(chalk.red(`Error: ${error instanceof Error ? error.message : error}`));
                process.exit(1);
            }
        });
}