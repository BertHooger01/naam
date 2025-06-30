#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const generate_1 = require("./commands/generate");
const export_1 = require("./commands/export");
const regional_1 = require("./commands/regional");
const historical_1 = require("./commands/historical");
const demo_1 = require("./commands/demo");
const constants_1 = require("../core/constants");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const program = new commander_1.Command();
const outputDir = path_1.default.join(process.cwd(), constants_1.DEFAULT_OPTIONS.OUTPUT_DIR);
if (!fs_1.default.existsSync(outputDir)) {
    fs_1.default.mkdirSync(outputDir, { recursive: true });
}
program
    .name('dutch-names')
    .description('Generate authentic Dutch names using phonetic patterns, regional variations, and historical context')
    .version('2.0.0');
program.addCommand((0, generate_1.createGenerateCommand)());
program.addCommand((0, export_1.createExportCommand)());
program.addCommand((0, regional_1.createRegionalCommand)());
program.addCommand((0, historical_1.createHistoricalCommand)());
program.addCommand((0, demo_1.createDemoCommand)());
if (process.argv.length === 2) {
    program.help();
}
program.parse();
//# sourceMappingURL=index.js.map