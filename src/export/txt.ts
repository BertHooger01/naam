import fs from 'fs';
import { DutchName, GenerationOptions } from '../core/types';
import { calculateStats, formatPercentage } from '../utils/helpers';

export class TXTExporter {
    exportToTXT(names: DutchName[], filePath: string): void {
        const content = names.map(name => {
            let line = `${name.fullName} (${name.gender})`;
            if (name.region && name.region !== 'general') line += ` [${name.region}]`;
            if (name.generation && name.generation !== 'modern') line += ` {${name.generation}}`;
            return line;
        }).join('\n');

        fs.writeFileSync(filePath, content);
    }

    exportToTXTWithStats(names: DutchName[], filePath: string, options?: GenerationOptions): void {
        const stats = calculateStats(names);

        const header = [
            'Dutch Names Export',
            '==================',
            '',
            `Generated: ${new Date().toISOString()}`,
            `Total Names: ${stats.totalGenerated}`,
            `Male: ${stats.maleCount} (${formatPercentage(stats.maleCount, stats.totalGenerated)})`,
            `Female: ${stats.femaleCount} (${formatPercentage(stats.femaleCount, stats.totalGenerated)})`,
            `Unique First Names: ${stats.uniqueFirstNames}`,
            `Unique Last Names: ${stats.uniqueLastNames}`,
            `Average First Name Length: ${stats.avgFirstNameLength} characters`,
            `Average Last Name Length: ${stats.avgLastNameLength} characters`,
            ''
        ];

        if (options) {
            header.push('Generation Options:');
            if (options.gender) header.push(`  Gender Filter: ${options.gender}`);
            if (options.region) header.push(`  Region: ${options.region}`);
            if (options.generation) header.push(`  Generation: ${options.generation}`);
            if (options.seed) header.push(`  Seed: ${options.seed}`);
            if (options.avoidDuplicates) header.push(`  Avoid Duplicates: ${options.avoidDuplicates}`);
            header.push('');
        }

        if (stats.regionDistribution && Object.keys(stats.regionDistribution).length > 1) {
            header.push('Region Distribution:');
            Object.entries(stats.regionDistribution).forEach(([region, count]) => {
                header.push(`  ${region}: ${count} (${formatPercentage(count, stats.totalGenerated)})`);
            });
            header.push('');
        }

        if (stats.generationDistribution && Object.keys(stats.generationDistribution).length > 1) {
            header.push('Generation Distribution:');
            Object.entries(stats.generationDistribution).forEach(([generation, count]) => {
                header.push(`  ${generation}: ${count} (${formatPercentage(count, stats.totalGenerated)})`);
            });
            header.push('');
        }

        header.push('Names:');
        header.push('------');
        header.push('');

        const nameContent = names.map((name, index) => {
            let line = `${(index + 1).toString().padStart(4, ' ')}. ${name.fullName} (${name.gender})`;
            if (name.region && name.region !== 'general') line += ` [${name.region}]`;
            if (name.generation && name.generation !== 'modern') line += ` {${name.generation}}`;
            return line;
        }).join('\n');

        const content = [...header, nameContent].join('\n');
        fs.writeFileSync(filePath, content);
    }
}