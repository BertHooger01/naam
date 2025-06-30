import fs from 'fs';
import { DutchName, ExportData, ExportMetadata, GenerationOptions } from '../core/types';
import { calculateStats } from '../utils/helpers';

export class JSONExporter {
    exportToJSON(names: DutchName[], filePath: string): void {
        const data = JSON.stringify(names, null, 2);
        fs.writeFileSync(filePath, data);
    }

    exportToJSONWithStats(names: DutchName[], filePath: string, options?: GenerationOptions): void {
        const stats = calculateStats(names);

        const metadata: ExportMetadata = {
            totalNames: names.length,
            maleCount: stats.maleCount,
            femaleCount: stats.femaleCount,
            generatedAt: new Date().toISOString(),
            options
        };

        const exportData: ExportData = {
            metadata,
            names
        };

        const data = JSON.stringify(exportData, null, 2);
        fs.writeFileSync(filePath, data);
    }

    exportStats(names: DutchName[], filePath: string): void {
        const stats = calculateStats(names);
        const data = JSON.stringify(stats, null, 2);
        fs.writeFileSync(filePath, data);
    }
}