import { DutchPhoneticNameGenerator, DutchName } from './generator';
import chalk from 'chalk';
import boxen from 'boxen';
import Table from 'cli-table3';
import figlet from 'figlet';
import gradient from 'gradient-string';
import ora from 'ora';

export class PrettyConsole {
    private generator: DutchPhoneticNameGenerator;

    constructor() {
        this.generator = new DutchPhoneticNameGenerator();
    }

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
                chalk.white.bold('Gender')
            ],
            style: {
                head: [],
                border: ['gray']
            },
            colWidths: [4, 25, 15, 20, 8]
        });

        names.forEach((name, index) => {
            const genderColor = name.gender === 'male' ? chalk.blue : chalk.magenta;
            const genderIcon = name.gender === 'male' ? '♂' : '♀';

            table.push([
                chalk.dim((index + 1).toString().padStart(2, '0')),
                genderColor.bold(name.fullName),
                chalk.cyan(name.firstName),
                chalk.yellow(name.lastName),
                genderColor(genderIcon)
            ]);
        });

        console.log('\n' + chalk.white.bold.underline(title));
        console.log(table.toString());
    }

    showStats(names: DutchName[]): void {
        const maleCount = names.filter(n => n.gender === 'male').length;
        const femaleCount = names.filter(n => n.gender === 'female').length;
        const avgFirstNameLength = names.reduce((sum, n) => sum + n.firstName.length, 0) / names.length;
        const avgLastNameLength = names.reduce((sum, n) => sum + n.lastName.length, 0) / names.length;

        const uniqueFirstNames = new Set(names.map(n => n.firstName)).size;
        const uniqueLastNames = new Set(names.map(n => n.lastName)).size;

        const statsTable = new Table({
            head: [chalk.white.bold('Statistic'), chalk.white.bold('Value')],
            style: { border: ['cyan'] },
            colWidths: [25, 15]
        });

        statsTable.push(
            [chalk.green('Total Generated'), chalk.white.bold(names.length.toString())],
            [chalk.blue('Males'), `${chalk.white.bold(maleCount.toString())} ${chalk.dim(`(${(maleCount / names.length * 100).toFixed(1)}%)`)}`],
            [chalk.magenta('Females'), `${chalk.white.bold(femaleCount.toString())} ${chalk.dim(`(${(femaleCount / names.length * 100).toFixed(1)}%)`)}`],
            [chalk.yellow('Unique First Names'), chalk.white.bold(uniqueFirstNames.toString())],
            [chalk.yellow('Unique Last Names'), chalk.white.bold(uniqueLastNames.toString())],
            [chalk.cyan('Avg First Name Length'), chalk.white.bold(avgFirstNameLength.toFixed(1))],
            [chalk.cyan('Avg Last Name Length'), chalk.white.bold(avgLastNameLength.toFixed(1))]
        );

        console.log('\n' + chalk.white.bold.underline('📊 Generation Statistics'));
        console.log(statsTable.toString());
    }

    showUsageExamples(): void {
        const examples = [
            { code: 'dutch-names generate -c 50', desc: 'Generate 50 random names' },
            { code: 'dutch-names gen -c 10 -g male', desc: 'Generate 10 male names' },
            { code: 'dutch-names export -c 1000 -o names.csv', desc: 'Export 1000 names to CSV' },
            { code: 'dutch-names gen -c 5 -f json', desc: 'Output 5 names as JSON' },
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
        const spinner = ora({
            text: `Generating ${count} ${description}...`,
            color: 'cyan'
        }).start();

        await new Promise(resolve => setTimeout(resolve, 800));
        const names = this.generator.generateNames(count);

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