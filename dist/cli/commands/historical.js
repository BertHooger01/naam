"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHistoricalCommand = createHistoricalCommand;
const commander_1 = require("commander");
const generator_1 = require("../../core/generator");
const validations_1 = require("../../utils/validations");
const constants_1 = require("../../core/constants");
const ora_1 = __importDefault(require("ora"));
const chalk_1 = __importDefault(require("chalk"));
const ERAS_INFO = [
    { name: 'Traditional Era', key: 'traditional', desc: 'Pre-1950 classic names' },
    { name: 'Modern Era', key: 'modern', desc: '1950-2000 popular names' },
    { name: 'Contemporary Era', key: 'contemporary', desc: '2000+ current names' }
];
function createHistoricalCommand() {
    return new commander_1.Command('historical')
        .description('Generate names from different time periods')
        .option('-c, --count <number>', 'number of names per era', '15')
        .option('-g, --gender <gender>', 'gender filter (male|female|random)', 'random')
        .option('-o, --output <file>', 'output file path (default: output/historical.[format])')
        .option('-f, --format <format>', 'output format (table|csv|json)', 'table')
        .action(async (options) => {
        try {
            // Validate inputs
            const count = (0, validations_1.validateCount)(options.count);
            const gender = (0, validations_1.validateGender)(options.gender);
            const generator = new generator_1.DutchPhoneticNameGenerator();
            console.log(chalk_1.default.blue.bold('📅 Historical Dutch Names Through Time\n'));
            const allNames = [];
            for (const era of ERAS_INFO) {
                const spinner = (0, ora_1.default)(`Generating ${era.name} names...`).start();
                try {
                    const names = generator.generateNames(count, {
                        generation: era.key,
                        gender
                    });
                    allNames.push(...names);
                    spinner.succeed(`${era.name} (${era.desc})`);
                    if (!options.output && options.format === 'table') {
                        const { PrettyConsole } = await Promise.resolve().then(() => __importStar(require('../ui/console')));
                        const prettyConsole = new PrettyConsole();
                        prettyConsole.showNameTable(`${era.name} Names`, names);
                    }
                }
                catch (error) {
                    spinner.fail(`Failed to generate ${era.name} names`);
                    throw error;
                }
            }
            if (options.output || options.format !== 'table') {
                const { handleFileOutput } = await Promise.resolve().then(() => __importStar(require('../ui/output')));
                let outputFile = options.output;
                if (!outputFile) {
                    const extension = options.format === 'json' ? 'json' : options.format === 'csv' ? 'csv' : 'txt';
                    outputFile = `${constants_1.DEFAULT_OPTIONS.OUTPUT_DIR}/historical.${extension}`;
                }
                await handleFileOutput(allNames, outputFile, options.format);
                console.log(chalk_1.default.green(`✓ Historical names exported to: ${outputFile}`));
            }
        }
        catch (error) {
            console.error(chalk_1.default.red(`Error: ${error instanceof Error ? error.message : error}`));
            process.exit(1);
        }
    });
}
//# sourceMappingURL=historical.js.map