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
exports.createExportCommand = createExportCommand;
const commander_1 = require("commander");
const generator_1 = require("../../core/generator");
const validations_1 = require("../../utils/validations");
const constants_1 = require("../../core/constants");
const ora_1 = __importDefault(require("ora"));
const chalk_1 = __importDefault(require("chalk"));
function createExportCommand() {
    return new commander_1.Command('export')
        .description('Export names to various formats')
        .option('-c, --count <number>', 'number of names to generate', '100')
        .option('-o, --output <file>', 'output file path (default: output/export.[format])')
        .option('-f, --format <format>', 'export format (csv|json|txt)', constants_1.DEFAULT_OPTIONS.FORMAT)
        .option('-g, --gender <gender>', 'gender filter (male|female|random)', 'random')
        .option('-r, --region <region>', 'regional variation (north|south|randstad|general)', constants_1.DEFAULT_OPTIONS.REGION)
        .option('-e, --era <era>', 'time period (traditional|modern|contemporary|general)', constants_1.DEFAULT_OPTIONS.GENERATION)
        .option('-s, --seed <number>', 'random seed for reproducible results')
        .option('--no-duplicates', 'avoid duplicate names')
        .option('--with-stats', 'include generation statistics in export')
        .action(async (options) => {
        try {
            // Validate inputs
            const count = (0, validations_1.validateCount)(options.count);
            const gender = (0, validations_1.validateGender)(options.gender);
            const region = (0, validations_1.validateRegion)(options.region);
            const generation = (0, validations_1.validateGeneration)(options.era);
            const seed = (0, validations_1.validateSeed)(options.seed);
            // Set default output file if not specified
            let outputFile = options.output;
            if (!outputFile) {
                const extension = options.format === 'json' ? 'json' : options.format === 'csv' ? 'csv' : 'txt';
                outputFile = `${constants_1.DEFAULT_OPTIONS.OUTPUT_DIR}/export.${extension}`;
            }
            (0, validations_1.validateFilePath)(outputFile);
            // Create generator and spinner
            const generator = new generator_1.DutchPhoneticNameGenerator(seed);
            const spinner = (0, ora_1.default)(`Generating ${count} names for export...`).start();
            try {
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
                spinner.text = 'Exporting names...';
                // Handle file output with proper options
                const { handleFileOutput } = await Promise.resolve().then(() => __importStar(require('../ui/output')));
                await handleFileOutput(names, outputFile, options.format, options.withStats, generationOptions);
                spinner.succeed(`Exported ${count} names to ${outputFile}`);
            }
            catch (error) {
                spinner.fail('Export failed');
                throw error;
            }
        }
        catch (error) {
            console.error(chalk_1.default.red(`Error: ${error instanceof Error ? error.message : error}`));
            process.exit(1);
        }
    });
}
//# sourceMappingURL=export.js.map