"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TXTExporter = void 0;
const fs_1 = __importDefault(require("fs"));
const helpers_1 = require("../utils/helpers");
class TXTExporter {
    exportToTXT(names, filePath) {
        const content = names.map(name => {
            let line = `${name.fullName} (${name.gender})`;
            if (name.region && name.region !== 'general')
                line += ` [${name.region}]`;
            if (name.generation && name.generation !== 'modern')
                line += ` {${name.generation}}`;
            return line;
        }).join('\n');
        fs_1.default.writeFileSync(filePath, content);
    }
    exportToTXTWithStats(names, filePath, options) {
        const stats = (0, helpers_1.calculateStats)(names);
        const header = [
            'Dutch Names Export',
            '==================',
            '',
            `Generated: ${new Date().toISOString()}`,
            `Total Names: ${stats.totalGenerated}`,
            `Male: ${stats.maleCount} (${(0, helpers_1.formatPercentage)(stats.maleCount, stats.totalGenerated)})`,
            `Female: ${stats.femaleCount} (${(0, helpers_1.formatPercentage)(stats.femaleCount, stats.totalGenerated)})`,
            `Unique First Names: ${stats.uniqueFirstNames}`,
            `Unique Last Names: ${stats.uniqueLastNames}`,
            `Average First Name Length: ${stats.avgFirstNameLength} characters`,
            `Average Last Name Length: ${stats.avgLastNameLength} characters`,
            ''
        ];
        if (options) {
            header.push('Generation Options:');
            if (options.gender)
                header.push(`  Gender Filter: ${options.gender}`);
            if (options.region)
                header.push(`  Region: ${options.region}`);
            if (options.generation)
                header.push(`  Generation: ${options.generation}`);
            if (options.seed)
                header.push(`  Seed: ${options.seed}`);
            if (options.avoidDuplicates)
                header.push(`  Avoid Duplicates: ${options.avoidDuplicates}`);
            header.push('');
        }
        if (stats.regionDistribution && Object.keys(stats.regionDistribution).length > 1) {
            header.push('Region Distribution:');
            Object.entries(stats.regionDistribution).forEach(([region, count]) => {
                header.push(`  ${region}: ${count} (${(0, helpers_1.formatPercentage)(count, stats.totalGenerated)})`);
            });
            header.push('');
        }
        if (stats.generationDistribution && Object.keys(stats.generationDistribution).length > 1) {
            header.push('Generation Distribution:');
            Object.entries(stats.generationDistribution).forEach(([generation, count]) => {
                header.push(`  ${generation}: ${count} (${(0, helpers_1.formatPercentage)(count, stats.totalGenerated)})`);
            });
            header.push('');
        }
        header.push('Names:');
        header.push('------');
        header.push('');
        const nameContent = names.map((name, index) => {
            let line = `${(index + 1).toString().padStart(4, ' ')}. ${name.fullName} (${name.gender})`;
            if (name.region && name.region !== 'general')
                line += ` [${name.region}]`;
            if (name.generation && name.generation !== 'modern')
                line += ` {${name.generation}}`;
            return line;
        }).join('\n');
        const content = [...header, nameContent].join('\n');
        fs_1.default.writeFileSync(filePath, content);
    }
}
exports.TXTExporter = TXTExporter;
//# sourceMappingURL=txt.js.map