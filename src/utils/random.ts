export class SeededRandom {
    private state: number;

    constructor(seed?: number) {
        this.state = seed ?? Date.now();
    }

    random(): number {
        this.state = (this.state * 1664525 + 1013904223) % 4294967296;
        return this.state / 4294967296;
    }

    randomInt(min: number, max: number): number {
        return Math.floor(this.random() * (max - min + 1)) + min;
    }

    randomElement<T>(array: T[]): T {
        return array[Math.floor(this.random() * array.length)];
    }

    randomBoolean(probability = 0.5): boolean {
        return this.random() < probability;
    }

    shuffle<T>(array: T[]): T[] {
        const result = [...array];
        for (let i = result.length - 1; i > 0; i--) {
            const j = Math.floor(this.random() * (i + 1));
            [result[i], result[j]] = [result[j], result[i]];
        }
        return result;
    }

    setSeed(seed: number): void {
        this.state = seed;
    }

    getSeed(): number {
        return this.state;
    }
}