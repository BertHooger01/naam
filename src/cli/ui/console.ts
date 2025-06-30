import { DutchName } from '../../core/types';
import { calculateStats } from '../../utils/helpers';
import chalk from 'chalk';
import boxen from 'boxen';
import Table from 'cli-table3';
import figlet from 'figlet';
import gradient from 'gradient-string';
import ora from 'ora';

export class PrettyConsole {
    async showTitle(): Promise<void> {
        console.clear();

        const title = figlet.textSync('Dutch Names', {
            font: 'Big',
            horizontalLayout: 'default',
            verticalLayout: 'default'
        });

        console.log(gradient(['#ff7b00', '#ffcd00'])(title));
        console.log(chalk.dim('🇳🇱 Authentic Dutch Name Generator\n'));
    }

    showWelcomeBox(): void {
        const welcomeText = chalk.white.bold('Welcome to the Dutch Name Generator!\n') +
            chalk.gray('Generating authentic Dutch names using real phonetic patterns.\n') +
            chalk.cyan('Each name combines traditional Dutch elements with randomization.');

        console.log(boxen(welcomeText, {
            padding: 1,
            margin: 1,
            borderStyle: 'double',
            borderColor: 'blue',
            backgroundColor: 'black'
        }));
    }

    showSingleName(title: string, name: DutchName): void {
        const genderColor = name.gender === 'male' ? chalk.blue : chalk.magenta;
        const genderIcon = name.gender === 'male' ? '♂' : '♀';

        const nameBox = genderColor.bold(name.fullName) + ' ' + genderColor(genderIcon) + '\n' +
            chalk.gray(`First: ${name.firstName}`) + chalk.dim(' | ') +
            chalk.gray(`Last: ${name.lastName}`);

        console.log(boxen(nameBox, {
            title: chalk.white.bold(title),
            padding: 1,
            margin: { top: 1, bottom: 1, left: 2, right: 2 },
            borderStyle: 'round',
            borderColor: name.gender === 'male' ? 'blue' : 'magenta',
            titleAlignment: 'center'
        }));
    }

    showNameTable(title: string, names: DutchName[]): void {
        const table = new Table({
            head: [
                chalk.white.bold('#'),
                chalk.white.bold('Full Name'),
                chalk.white.bold('First Name'),
                chalk.white.bold('Last Name'),
                chalk.white.bold('Gender'),
                chalk.white.bold('Region'),
                chalk.white.bold('Era')
            ],
            style: {
                head: [],
                border: ['gray']
            },
            colWidths: [4, 25, 15, 20, 8, 12, 12]
        });

        names.forEach((name, index) => {
            const genderColor = name.gender === 'male' ? chalk.blue : chalk.magenta;
            const genderIcon = name.gender === 'male' ? '♂' : '♀';

            table.push([
                chalk.dim((index + 1).toString().padStart(2, '0')),
                genderColor.bold(name.fullName),
                chalk.cyan(name.firstName),
                chalk.yellow(name.lastName),
                genderColor(genderIcon),
                chalk.green(name.region || 'general'),
                chalk.magenta(name.generation || 'modern')
            ]);
        });

        console.log('\n' + chalk.white.bold.underline(title));
        console.log(table.toString());
    }

    showStats(names: DutchName[]): void {
        const stats = calculateStats(names);

        const statsTable = new Table({
            head: [chalk.white.bold('Statistic'), chalk.white.bold('Value')],
            style: { border: ['cyan'] },
            colWidths: [25, 15]
        });

        statsTable.push(
            [chalk.green('Total Generated'), chalk.white.bold(stats.totalGenerated.toString())],
            [chalk.blue('Males'), `${chalk.white.bold(stats.maleCount.toString())} ${chalk.dim(`(${((stats.maleCount / stats.totalGenerated) * 100).toFixed(1)}%)`)}`],
            [chalk.magenta('Females'), `${chalk.white.bold(stats.femaleCount.toString())} ${chalk.dim(`(${((stats.femaleCount / stats.totalGenerated) * 100).toFixed(1)}%)`)}`],
            [chalk.yellow('Unique First Names'), chalk.white.bold(stats.uniqueFirstNames.toString())],
            [chalk.yellow('Unique Last Names'), chalk.white.bold(stats.uniqueLastNames.toString())],
            [chalk.cyan('Avg First Name Length'), chalk.white.bold(stats.avgFirstNameLength.toString())],
            [chalk.cyan('Avg Last Name Length'), chalk.white.bold(stats.avgLastNameLength.toString())]
        );

        console.log('\n' + chalk.white.bold.underline('📊 Generation Statistics'));
        console.log(statsTable.toString());

        // Show distributions if applicable
        if (stats.regionDistribution && Object.keys(stats.regionDistribution).length > 1) {
            console.log('\n' + chalk.white.bold.underline('🗺️ Regional Distribution'));
            Object.entries(stats.regionDistribution).forEach(([region, count]) => {
                const percentage = ((count / stats.totalGenerated) * 100).toFixed(1);
                console.log(`  ${chalk.green(region.padEnd(12))} ${count.toString().padStart(3)} (${percentage}%)`);
            });
        }

        if (stats.generationDistribution && Object.keys(stats.generationDistribution).length > 1) {
            console.log('\n' + chalk.white.bold.underline('📅 Generation Distribution'));
            Object.entries(stats.generationDistribution).forEach(([generation, count]) => {
                const percentage = ((count / stats.totalGenerated) * 100).toFixed(1);
                console.log(`  ${chalk.magenta(generation.padEnd(12))} ${count.toString().padStart(3)} (${percentage}%)`);
            });
        }
    }

    showUsageExamples(): void {
        const examples = [
            { code: 'dutch-names generate -c 50', desc: 'Generate 50 random names' },
            { code: 'dutch-names gen -c 10 -g male -r north', desc: 'Generate 10 male northern names' },
            { code: 'dutch-names export -c 1000 -o names.csv', desc: 'Export 1000 names to CSV' },
            { code: 'dutch-names regional -c 30 -f json', desc: 'Generate regional showcase as JSON' },
            { code: 'dutch-names historical -c 20', desc: 'Generate historical timeline' },
            { code: 'dutch-names demo', desc: 'Run interactive demo' }
        ];

        let usageText = chalk.white.bold('CLI Usage Examples:\n\n');
        examples.forEach(example => {
            usageText += chalk.cyan(example.code) + '\n';
            usageText += chalk.gray(`  → ${example.desc}\n\n`);
        });

        console.log(boxen(usageText.trim(), {
            title: chalk.white.bold('🔧 CLI Commands'),
            padding: 1,
            margin: 1,
            borderStyle: 'single',
            borderColor: 'green'
        }));
    }

    async generateWithSpinner(count: number, description: string): Promise<DutchName[]> {
        const { DutchPhoneticNameGenerator } = await import('../../core/generator');
        const generator = new DutchPhoneticNameGenerator();

        const spinner = ora({
            text: `Generating ${count} ${description}...`,
            color: 'cyan'
        }).start();

        await new Promise(resolve => setTimeout(resolve, 800));
        const names = generator.generateNames(count);

        spinner.succeed(`Generated ${count} authentic Dutch names!`);
        return names;
    }

    showFooter(): void {
        const footerText = chalk.white('Made with ') +
            chalk.red('❤️') +
            chalk.white(' for the Dutch community\n') +
            chalk.dim('Type "dutch-names --help" for more options');

        console.log(boxen(footerText, {
            padding: 1,
            margin: 1,
            borderStyle: 'single',
            borderColor: 'gray',
            textAlignment: 'center'
        }));
    }
}