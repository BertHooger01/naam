import { DutchPhoneticNameGenerator } from '../core/generator';

export { DutchPhoneticNameGenerator } from '../core/generator';
export type {
    DutchName,
    GenerationOptions,
    NameStats,
    ExportMetadata,
    ExportData,
    Region,
    Generation,
    Gender,
    ExportFormat
} from '../core/types';
export { CSVExporter, JSONExporter, TXTExporter } from '../export';
export { calculateStats, formatFileName } from '../utils/helpers';
export { SeededRandom } from '../utils/random';

export const dutchNameGenerator = new DutchPhoneticNameGenerator();