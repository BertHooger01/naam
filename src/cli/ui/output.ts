import fs from 'fs';
import path from 'path';
import { DutchName, GenerationOptions } from '../../core/types';
import { CSVExporter, JSONExporter, TXTExporter } from '../../export';
import { PrettyConsole } from './console';
import chalk from 'chalk';

const csvExporter = new CSVExporter();
const jsonExporter = new JSONExporter();
const txtExporter = new TXTExporter();
const prettyConsole = new PrettyConsole();

export async function handleFileOutput(
    names: DutchName[],
    outputPath: string,
    format: string,
    withStats = false,
    options?: GenerationOptions
): Promise<void> {
    // Ensure the output path is absolute or relative to cwd
    if (!path.isAbsolute(outputPath)) {
        outputPath = path.resolve(outputPath);
    }

    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    switch (format.toLowerCase()) {
        case 'csv':
            if (withStats) {
                await csvExporter.exportToCSVWithStats(names, outputPath);
            } else {
                await csvExporter.exportToCSV(names, outputPath);
            }
            console.log(chalk.green(`✓ CSV exported to: ${outputPath}`));
            break;

        case 'json':
            if (withStats) {
                jsonExporter.exportToJSONWithStats(names, outputPath, options);
            } else {
                // Always use structured JSON format, not just flat array
                jsonExporter.exportToJSONWithStats(names, outputPath, options);
            }
            console.log(chalk.green(`✓ JSON exported to: ${outputPath}`));
            break;

        case 'txt':
            if (withStats) {
                txtExporter.exportToTXTWithStats(names, outputPath, options);
            } else {
                txtExporter.exportToTXT(names, outputPath);
            }
            console.log(chalk.green(`✓ Text file exported to: ${outputPath}`));
            break;

        default:
            throw new Error(`Unsupported format: ${format}`);
    }
}

export function handleConsoleOutput(names: DutchName[], format: string, quiet: boolean): void {
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
                if (name.region && name.region !== 'general') line += chalk.dim(` [${name.region}]`);
                if (name.generation && name.generation !== 'modern') line += chalk.dim(` {${name.generation}}`);
                console.log(line);
            });
    }
}