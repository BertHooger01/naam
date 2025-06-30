import { Command } from 'commander';
import { DutchPhoneticNameGenerator } from '../../core/generator';
import { GenerationOptions } from '../../core/types';
import { validateCount, validateGender, validateRegion, validateGeneration, validateSeed } from '../../utils/validations';
import { DEFAULT_OPTIONS } from '../../core/constants';
import ora from 'ora';
import chalk from 'chalk';

export function createGenerateCommand(): Command {
    return new Command('generate')
        .alias('gen')
        .description('Generate Dutch names')
        .option('-c, --count <number>', 'number of names to generate', DEFAULT_OPTIONS.COUNT.toString())
        .option('-g, --gender <gender>', 'gender filter (male|female|random)', 'random')
        .option('-r, --region <region>', 'regional variation (north|south|randstad|general)', DEFAULT_OPTIONS.REGION)
        .option('-e, --era <era>', 'time period (traditional|modern|contemporary|general)', DEFAULT_OPTIONS.GENERATION)
        .option('-s, --seed <number>', 'random seed for reproducible results')
        .option('--no-duplicates', 'avoid duplicate names')
        .option('-o, --output <file>', 'output file path (default: output/names.[format])')
        .option('-f, --format <format>', 'output format (table|csv|json)', 'table')
        .option('--no-color', 'disable colored output')
        .option('--quiet', 'minimal output')
        .action(async (options) => {
            try {
                const count = validateCount(options.count);
                const gender = validateGender(options.gender);
                const region = validateRegion(options.region);
                const generation = validateGeneration(options.era);
                const seed = validateSeed(options.seed);

                const generator = new DutchPhoneticNameGenerator(seed);
                const spinner = ora(`Generating ${count} Dutch names...`).start();

                const generationOptions: GenerationOptions = {
                    gender,
                    region,
                    generation,
                    avoidDuplicates: options.noDuplicates,
                    seed
                };

                const names = generator.generateNames(count, generationOptions);

                let description = `Generated ${count} authentic Dutch names`;
                if (region) description += ` (${region} region)`;
                if (generation) description += ` (${generation} era)`;
                if (seed) description += ` (seed: ${seed})`;

                spinner.succeed(description + '!');

                if (options.output || options.format !== 'table') {
                    const { handleFileOutput } = await import('../ui/output');

                    let outputFile = options.output;
                    if (!outputFile && options.format !== 'table') {
                        const extension = options.format === 'json' ? 'json' : options.format === 'csv' ? 'csv' : 'txt';
                        outputFile = `${DEFAULT_OPTIONS.OUTPUT_DIR}/names.${extension}`;
                    }

                    if (outputFile) {
                        await handleFileOutput(names, outputFile, options.format);
                    }
                } else {
                    const { handleConsoleOutput } = await import('../ui/output');
                    handleConsoleOutput(names, options.format, options.quiet);
                }

            } catch (error) {
                console.error(chalk.red(`Error: ${error instanceof Error ? error.message : error}`));
                process.exit(1);
            }
        });
}