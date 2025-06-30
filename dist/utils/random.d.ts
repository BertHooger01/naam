export declare class SeededRandom {
    private state;
    constructor(seed?: number);
    random(): number;
    randomInt(min: number, max: number): number;
    randomElement<T>(array: T[]): T;
    randomBoolean(probability?: number): boolean;
    shuffle<T>(array: T[]): T[];
    setSeed(seed: number): void;
    getSeed(): number;
}
//# sourceMappingURL=random.d.ts.map