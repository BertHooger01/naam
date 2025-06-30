import { Command } from 'commander';
import { DutchPhoneticNameGenerator } from '../../core/generator';
import { GenerationOptions } from '../../core/types';
import { validateCount, validateGender, validateRegion, validateGeneration, validateSeed, validateFilePath } from '../../utils/validations';
import { DEFAULT_OPTIONS } from '../../core/constants';
import ora from 'ora';
import chalk from 'chalk';

export function createExportCommand(): Command {
    return new Command('export')
        .description('Export names to various formats')
        .option('-c, --count <number>', 'number of names to generate', '100')
        .option('-o, --output <file>', 'output file path (default: output/export.[format])')
        .option('-f, --format <format>', 'export format (csv|json|txt)', DEFAULT_OPTIONS.FORMAT)
        .option('-g, --gender <gender>', 'gender filter (male|female|random)', 'random')
        .option('-r, --region <region>', 'regional variation (north|south|randstad|general)', DEFAULT_OPTIONS.REGION)
        .option('-e, --era <era>', 'time period (traditional|modern|contemporary|general)', DEFAULT_OPTIONS.GENERATION)
        .option('-s, --seed <number>', 'random seed for reproducible results')
        .option('--no-duplicates', 'avoid duplicate names')
        .option('--with-stats', 'include generation statistics in export')
        .action(async (options) => {
            try {
                // Validate inputs
                const count = validateCount(options.count);
                const gender = validateGender(options.gender);
                const region = validateRegion(options.region);
                const generation = validateGeneration(options.era);
                const seed = validateSeed(options.seed);

                // Set default output file if not specified
                let outputFile = options.output;
                if (!outputFile) {
                    const extension = options.format === 'json' ? 'json' : options.format === 'csv' ? 'csv' : 'txt';
                    outputFile = `${DEFAULT_OPTIONS.OUTPUT_DIR}/export.${extension}`;
                }

                validateFilePath(outputFile);

                // Create generator and spinner
                const generator = new DutchPhoneticNameGenerator(seed);
                const spinner = ora(`Generating ${count} names for export...`).start();

                try {
                    // Set up generation options
                    const generationOptions: GenerationOptions = {
                        gender,
                        region,
                        generation,
                        avoidDuplicates: options.noDuplicates,
                        seed
                    };

                    // Generate names
                    const names = generator.generateNames(count, generationOptions);
                    spinner.text = 'Exporting names...';

                    // Handle file output
                    const { handleFileOutput } = await import('../ui/output');
                    await handleFileOutput(names, outputFile, options.format, options.withStats, generationOptions);

                    spinner.succeed(`Exported ${count} names to ${outputFile}`);

                } catch (error) {
                    spinner.fail('Export failed');
                    throw error;
                }

            } catch (error) {
                console.error(chalk.red(`Error: ${error instanceof Error ? error.message : error}`));
                process.exit(1);
            }
        });
}