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
exports.createGenerateCommand = createGenerateCommand;
const commander_1 = require("commander");
const generator_1 = require("../../core/generator");
const validations_1 = require("../../utils/validations");
const constants_1 = require("../../core/constants");
const ora_1 = __importDefault(require("ora"));
const chalk_1 = __importDefault(require("chalk"));
function createGenerateCommand() {
    return new commander_1.Command('generate')
        .alias('gen')
        .description('Generate Dutch names')
        .option('-c, --count <number>', 'number of names to generate', constants_1.DEFAULT_OPTIONS.COUNT.toString())
        .option('-g, --gender <gender>', 'gender filter (male|female|random)', 'random')
        .option('-r, --region <region>', 'regional variation (north|south|randstad|general)', constants_1.DEFAULT_OPTIONS.REGION)
        .option('-e, --era <era>', 'time period (traditional|modern|contemporary|general)', constants_1.DEFAULT_OPTIONS.GENERATION)
        .option('-s, --seed <number>', 'random seed for reproducible results')
        .option('--no-duplicates', 'avoid duplicate names')
        .option('-o, --output <file>', 'output file path (default: output/names.[format])')
        .option('-f, --format <format>', 'output format (table|csv|json)', 'table')
        .option('--no-color', 'disable colored output')
        .option('--quiet', 'minimal output')
        .action(async (options) => {
        try {
            // Validate inputs
            const count = (0, validations_1.validateCount)(options.count);
            const gender = (0, validations_1.validateGender)(options.gender);
            const region = (0, validations_1.validateRegion)(options.region);
            const generation = (0, validations_1.validateGeneration)(options.era);
            const seed = (0, validations_1.validateSeed)(options.seed);
            // Create generator
            const generator = new generator_1.DutchPhoneticNameGenerator(seed);
            const spinner = (0, ora_1.default)(`Generating ${count} Dutch names...`).start();
            // Set up generation options
            const generationOptions = {
                gender,
                region,
                generation,
                avoidDuplicates: options.noDuplicates,
                seed
            };
            // Generate names
            const names = generator.generateNames(count, generationOptions);
            // Build success message
            let description = `Generated ${count} authentic Dutch names`;
            if (region)
                description += ` (${region} region)`;
            if (generation)
                description += ` (${generation} era)`;
            if (seed)
                description += ` (seed: ${seed})`;
            spinner.succeed(description + '!');
            // Handle output
            if (options.output || options.format !== 'table') {
                const { handleFileOutput } = await Promise.resolve().then(() => __importStar(require('../ui/output')));
                let outputFile = options.output;
                if (!outputFile && options.format !== 'table') {
                    const extension = options.format === 'json' ? 'json' : options.format === 'csv' ? 'csv' : 'txt';
                    outputFile = `${constants_1.DEFAULT_OPTIONS.OUTPUT_DIR}/names.${extension}`;
                }
                if (outputFile) {
                    await handleFileOutput(names, outputFile, options.format);
                }
            }
            else {
                const { handleConsoleOutput } = await Promise.resolve().then(() => __importStar(require('../ui/output')));
                handleConsoleOutput(names, options.format, options.quiet);
            }
        }
        catch (error) {
            console.error(chalk_1.default.red(`Error: ${error instanceof Error ? error.message : error}`));
            process.exit(1);
        }
    });
}
//# sourceMappingURL=generate.js.map