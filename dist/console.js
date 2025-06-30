"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrettyConsole = void 0;
const generator_1 = require("./generator");
const chalk_1 = __importDefault(require("chalk"));
const boxen_1 = __importDefault(require("boxen"));
const cli_table3_1 = __importDefault(require("cli-table3"));
const figlet_1 = __importDefault(require("figlet"));
const gradient_string_1 = __importDefault(require("gradient-string"));
const ora_1 = __importDefault(require("ora"));
class PrettyConsole {
    constructor() {
        this.generator = new generator_1.DutchPhoneticNameGenerator();
    }
    async showTitle() {
        console.clear();
        const title = figlet_1.default.textSync('Dutch Names', {
            font: 'Big',
            horizontalLayout: 'default',
            verticalLayout: 'default'
        });
        console.log((0, gradient_string_1.default)(['#ff7b00', '#ffcd00'])(title));
        console.log(chalk_1.default.dim('🇳🇱 Authentic Dutch Name Generator\n'));
    }
    showWelcomeBox() {
        const welcomeText = chalk_1.default.white.bold('Welcome to the Dutch Name Generator!\n') +
            chalk_1.default.gray('Generating authentic Dutch names using real phonetic patterns.\n') +
            chalk_1.default.cyan('Each name combines traditional Dutch elements with randomization.');
        console.log((0, boxen_1.default)(welcomeText, {
            padding: 1,
            margin: 1,
            borderStyle: 'double',
            borderColor: 'blue',
            backgroundColor: 'black'
        }));
    }
    showSingleName(title, name) {
        const genderColor = name.gender === 'male' ? chalk_1.default.blue : chalk_1.default.magenta;
        const genderIcon = name.gender === 'male' ? '♂' : '♀';
        const nameBox = genderColor.bold(name.fullName) + ' ' + genderColor(genderIcon) + '\n' +
            chalk_1.default.gray(`First: ${name.firstName}`) + chalk_1.default.dim(' | ') +
            chalk_1.default.gray(`Last: ${name.lastName}`);
        console.log((0, boxen_1.default)(nameBox, {
            title: chalk_1.default.white.bold(title),
            padding: 1,
            margin: { top: 1, bottom: 1, left: 2, right: 2 },
            borderStyle: 'round',
            borderColor: name.gender === 'male' ? 'blue' : 'magenta',
            titleAlignment: 'center'
        }));
    }
    showNameTable(title, names) {
        const table = new cli_table3_1.default({
            head: [
                chalk_1.default.white.bold('#'),
                chalk_1.default.white.bold('Full Name'),
                chalk_1.default.white.bold('First Name'),
                chalk_1.default.white.bold('Last Name'),
                chalk_1.default.white.bold('Gender')
            ],
            style: {
                head: [],
                border: ['gray']
            },
            colWidths: [4, 25, 15, 20, 8]
        });
        names.forEach((name, index) => {
            const genderColor = name.gender === 'male' ? chalk_1.default.blue : chalk_1.default.magenta;
            const genderIcon = name.gender === 'male' ? '♂' : '♀';
            table.push([
                chalk_1.default.dim((index + 1).toString().padStart(2, '0')),
                genderColor.bold(name.fullName),
                chalk_1.default.cyan(name.firstName),
                chalk_1.default.yellow(name.lastName),
                genderColor(genderIcon)
            ]);
        });
        console.log('\n' + chalk_1.default.white.bold.underline(title));
        console.log(table.toString());
    }
    showStats(names) {
        const maleCount = names.filter(n => n.gender === 'male').length;
        const femaleCount = names.filter(n => n.gender === 'female').length;
        const avgFirstNameLength = names.reduce((sum, n) => sum + n.firstName.length, 0) / names.length;
        const avgLastNameLength = names.reduce((sum, n) => sum + n.lastName.length, 0) / names.length;
        const uniqueFirstNames = new Set(names.map(n => n.firstName)).size;
        const uniqueLastNames = new Set(names.map(n => n.lastName)).size;
        const statsTable = new cli_table3_1.default({
            head: [chalk_1.default.white.bold('Statistic'), chalk_1.default.white.bold('Value')],
            style: { border: ['cyan'] },
            colWidths: [25, 15]
        });
        statsTable.push([chalk_1.default.green('Total Generated'), chalk_1.default.white.bold(names.length.toString())], [chalk_1.default.blue('Males'), `${chalk_1.default.white.bold(maleCount.toString())} ${chalk_1.default.dim(`(${(maleCount / names.length * 100).toFixed(1)}%)`)}`], [chalk_1.default.magenta('Females'), `${chalk_1.default.white.bold(femaleCount.toString())} ${chalk_1.default.dim(`(${(femaleCount / names.length * 100).toFixed(1)}%)`)}`], [chalk_1.default.yellow('Unique First Names'), chalk_1.default.white.bold(uniqueFirstNames.toString())], [chalk_1.default.yellow('Unique Last Names'), chalk_1.default.white.bold(uniqueLastNames.toString())], [chalk_1.default.cyan('Avg First Name Length'), chalk_1.default.white.bold(avgFirstNameLength.toFixed(1))], [chalk_1.default.cyan('Avg Last Name Length'), chalk_1.default.white.bold(avgLastNameLength.toFixed(1))]);
        console.log('\n' + chalk_1.default.white.bold.underline('📊 Generation Statistics'));
        console.log(statsTable.toString());
    }
    showUsageExamples() {
        const examples = [
            { code: 'dutch-names generate -c 50', desc: 'Generate 50 random names' },
            { code: 'dutch-names gen -c 10 -g male', desc: 'Generate 10 male names' },
            { code: 'dutch-names export -c 1000 -o names.csv', desc: 'Export 1000 names to CSV' },
            { code: 'dutch-names gen -c 5 -f json', desc: 'Output 5 names as JSON' },
            { code: 'dutch-names demo', desc: 'Run interactive demo' }
        ];
        let usageText = chalk_1.default.white.bold('CLI Usage Examples:\n\n');
        examples.forEach(example => {
            usageText += chalk_1.default.cyan(example.code) + '\n';
            usageText += chalk_1.default.gray(`  → ${example.desc}\n\n`);
        });
        console.log((0, boxen_1.default)(usageText.trim(), {
            title: chalk_1.default.white.bold('🔧 CLI Commands'),
            padding: 1,
            margin: 1,
            borderStyle: 'single',
            borderColor: 'green'
        }));
    }
    async generateWithSpinner(count, description) {
        const spinner = (0, ora_1.default)({
            text: `Generating ${count} ${description}...`,
            color: 'cyan'
        }).start();
        await new Promise(resolve => setTimeout(resolve, 800));
        const names = this.generator.generateNames(count);
        spinner.succeed(`Generated ${count} authentic Dutch names!`);
        return names;
    }
    showFooter() {
        const footerText = chalk_1.default.white('Made with ') +
            chalk_1.default.red('❤️') +
            chalk_1.default.white(' for the Dutch community\n') +
            chalk_1.default.dim('Type "dutch-names --help" for more options');
        console.log((0, boxen_1.default)(footerText, {
            padding: 1,
            margin: 1,
            borderStyle: 'single',
            borderColor: 'gray',
            textAlignment: 'center'
        }));
    }
}
exports.PrettyConsole = PrettyConsole;
//# sourceMappingURL=console.js.map