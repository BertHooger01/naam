import { DutchName } from '../../core/types';
export declare class PrettyConsole {
    showTitle(): Promise<void>;
    showWelcomeBox(): void;
    showSingleName(title: string, name: DutchName): void;
    showNameTable(title: string, names: DutchName[]): void;
    showStats(names: DutchName[]): void;
    showUsageExamples(): void;
    generateWithSpinner(count: number, description: string): Promise<DutchName[]>;
    showFooter(): void;
}
//# sourceMappingURL=console.d.ts.map