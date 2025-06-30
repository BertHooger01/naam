import { Command } from 'commander';
import { DutchPhoneticNameGenerator } from '../../core/generator';
import chalk from 'chalk';
import ora from 'ora';

export function createDemoCommand(): Command {
    return new Command('demo')
        .description('Run interactive demo')
        .action(async () => {
            try {
                const { runInteractiveDemo } = await import('../ui/interactive');
                await runInteractiveDemo();
            } catch (error) {
                console.error(chalk.red(`Demo error: ${error instanceof Error ? error.message : error}`));
                process.exit(1);
            }
        });
}