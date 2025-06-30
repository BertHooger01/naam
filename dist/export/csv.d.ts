import { DutchName, ExportMetadata } from '../core/types';
export declare class CSVExporter {
    exportToCSV(names: DutchName[], filePath: string): Promise<void>;
    exportToCSVWithStats(names: DutchName[], filePath: string, metadata?: ExportMetadata): Promise<void>;
}
//# sourceMappingURL=csv.d.ts.map