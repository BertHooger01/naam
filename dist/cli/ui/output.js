"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleFileOutput = handleFileOutput;
exports.handleConsoleOutput = handleConsoleOutput;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const export_1 = require("../../export");
const console_1 = require("./console");
const chalk_1 = __importDefault(require("chalk"));
const csvExporter = new export_1.CSVExporter();
const jsonExporter = new export_1.JSONExporter();
const txtExporter = new export_1.TXTExporter();
const prettyConsole = new console_1.PrettyConsole();
async function handleFileOutput(names, outputPath, format, withStats = false, options) {
    // Ensure the output path is absolute or relative to cwd
    if (!path_1.default.isAbsolute(outputPath)) {
        outputPath = path_1.default.resolve(outputPath);
    }
    const dir = path_1.default.dirname(outputPath);
    if (!fs_1.default.existsSync(dir)) {
        fs_1.default.mkdirSync(dir, { recursive: true });
    }
    switch (format.toLowerCase()) {
        case 'csv':
            if (withStats) {
                await csvExporter.exportToCSVWithStats(names, outputPath);
            }
            else {
                await csvExporter.exportToCSV(names, outputPath);
            }
            console.log(chalk_1.default.green(`✓ CSV exported to: ${outputPath}`));
            break;
        case 'json':
            if (withStats) {
                jsonExporter.exportToJSONWithStats(names, outputPath, options);
            }
            else {
                // Always use structured JSON format, not just flat array
                jsonExporter.exportToJSONWithStats(names, outputPath, options);
            }
            console.log(chalk_1.default.green(`✓ JSON exported to: ${outputPath}`));
            break;
        case 'txt':
            if (withStats) {
                txtExporter.exportToTXTWithStats(names, outputPath, options);
            }
            else {
                txtExporter.exportToTXT(names, outputPath);
            }
            console.log(chalk_1.default.green(`✓ Text file exported to: ${outputPath}`));
            break;
        default:
            throw new Error(`Unsupported format: ${format}`);
    }
}
function handleConsoleOutput(names, format, quiet) {
    if (quiet) {
        names.forEach(name => console.log(name.fullName));
        return;
    }
    switch (format.toLowerCase()) {
        case 'table':
            prettyConsole.showNameTable('Generated Names', names);
            break;
        case 'csv':
            console.log('FirstName,LastName,FullName,Gender,Region,Generation');
            names.forEach(name => {
                console.log(`${name.firstName},${name.lastName},${name.fullName},${name.gender},${name.region || ''},${name.generation || ''}`);
            });
            break;
        case 'json':
            // Always output structured JSON format
            const jsonOutput = {
                metadata: {
                    totalNames: names.length,
                    maleCount: names.filter(n => n.gender === 'male').length,
                    femaleCount: names.filter(n => n.gender === 'female').length,
                    generatedAt: new Date().toISOString()
                },
                names
            };
            console.log(JSON.stringify(jsonOutput, null, 2));
            break;
        default:
            names.forEach((name, index) => {
                const genderIcon = name.gender === 'male' ? '♂' : '♀';
                let line = `${(index + 1).toString().padStart(2, '0')}. ${name.fullName} ${genderIcon}`;
                if (name.region && name.region !== 'general')
                    line += chalk_1.default.dim(` [${name.region}]`);
                if (name.generation && name.generation !== 'modern')
                    line += chalk_1.default.dim(` {${name.generation}}`);
                console.log(line);
            });
    }
}
//# sourceMappingURL=output.js.map