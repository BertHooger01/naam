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
exports.createRegionalCommand = createRegionalCommand;
const commander_1 = require("commander");
const generator_1 = require("../../core/generator");
const validations_1 = require("../../utils/validations");
const constants_1 = require("../../core/constants");
const ora_1 = __importDefault(require("ora"));
const chalk_1 = __importDefault(require("chalk"));
const REGIONS_INFO = [
    { name: 'Northern Netherlands', key: 'north', desc: 'Frisian influences' },
    { name: 'Southern Netherlands', key: 'south', desc: 'Brabant & Limburg style' },
    { name: 'Randstad', key: 'randstad', desc: 'Urban metropolitan area' }
];
function createRegionalCommand() {
    return new commander_1.Command('regional')
        .description('Generate names from specific Dutch regions')
        .option('-c, --count <number>', 'number of names to generate', '20')
        .option('-g, --gender <gender>', 'gender filter (male|female|random)', 'random')
        .option('-o, --output <file>', 'output file path (default: output/regional-[region].[format])')
        .option('-f, --format <format>', 'output format (table|csv|json)', 'table')
        .action(async (options) => {
        try {
            // Validate inputs
            const count = (0, validations_1.validateCount)(options.count);
            const gender = (0, validations_1.validateGender)(options.gender);
            const generator = new generator_1.DutchPhoneticNameGenerator();
            console.log(chalk_1.default.blue.bold('🇳🇱 Regional Dutch Names Showcase\n'));
            for (const region of REGIONS_INFO) {
                const spinner = (0, ora_1.default)(`Generating ${region.name} names...`).start();
                try {
                    const names = generator.generateRegionalNames(Math.ceil(count / 3), region.key, gender);
                    spinner.succeed(`${region.name} (${region.desc})`);
                    // Handle output
                    if (options.output || options.format !== 'table') {
                        const { handleFileOutput } = await Promise.resolve().then(() => __importStar(require('../ui/output')));
                        let outputFile = options.output;
                        if (!outputFile && options.format !== 'table') {
                            const extension = options.format === 'json' ? 'json' : options.format === 'csv' ? 'csv' : 'txt';
                            outputFile = `${constants_1.DEFAULT_OPTIONS.OUTPUT_DIR}/regional-${region.key}.${extension}`;
                        }
                        if (outputFile) {
                            await handleFileOutput(names, outputFile, options.format);
                            console.log(chalk_1.default.green(`✓ ${region.name} exported to: ${outputFile}`));
                        }
                    }
                    else {
                        const { PrettyConsole } = await Promise.resolve().then(() => __importStar(require('../ui/console')));
                        const prettyConsole = new PrettyConsole();
                        prettyConsole.showNameTable(`${region.name} Names`, names);
                    }
                }
                catch (error) {
                    spinner.fail(`Failed to generate ${region.name} names`);
                    throw error;
                }
            }
        }
        catch (error) {
            console.error(chalk_1.default.red(`Error: ${error instanceof Error ? error.message : error}`));
            process.exit(1);
        }
    });
}
//# sourceMappingURL=regional.js.map