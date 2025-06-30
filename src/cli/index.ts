#!/usr/bin/env node

import { Command } from 'commander';
import { createGenerateCommand } from './commands/generate';
import { createExportCommand } from './commands/export';
import { createRegionalCommand } from './commands/regional';
import { createHistoricalCommand } from './commands/historical';
import { createDemoCommand } from './commands/demo';
import { DEFAULT_OPTIONS } from '../core/constants';
import fs from 'fs';
import path from 'path';

const program = new Command();

const outputDir = path.join(process.cwd(), DEFAULT_OPTIONS.OUTPUT_DIR);
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

program
    .name('dutch-names')
    .description('Generate authentic Dutch names using phonetic patterns, regional variations, and historical context')
    .version('2.0.0');

program.addCommand(createGenerateCommand());
program.addCommand(createExportCommand());
program.addCommand(createRegionalCommand());
program.addCommand(createHistoricalCommand());
program.addCommand(createDemoCommand());

if (process.argv.length === 2) {
    program.help();
}

program.parse();