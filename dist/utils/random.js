"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeededRandom = void 0;
class SeededRandom {
    constructor(seed) {
        this.state = seed ?? Date.now();
    }
    random() {
        this.state = (this.state * 1664525 + 1013904223) % 4294967296;
        return this.state / 4294967296;
    }
    randomInt(min, max) {
        return Math.floor(this.random() * (max - min + 1)) + min;
    }
    randomElement(array) {
        return array[Math.floor(this.random() * array.length)];
    }
    randomBoolean(probability = 0.5) {
        return this.random() < probability;
    }
    shuffle(array) {
        const result = [...array];
        for (let i = result.length - 1; i > 0; i--) {
            const j = Math.floor(this.random() * (i + 1));
            [result[i], result[j]] = [result[j], result[i]];
        }
        return result;
    }
    setSeed(seed) {
        this.state = seed;
    }
    getSeed() {
        return this.state;
    }
}
exports.SeededRandom = SeededRandom;
//# sourceMappingURL=random.js.map