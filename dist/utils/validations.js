"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationError = void 0;
exports.validateCount = validateCount;
exports.validateGender = validateGender;
exports.validateRegion = validateRegion;
exports.validateGeneration = validateGeneration;
exports.validateExportFormat = validateExportFormat;
exports.validateSeed = validateSeed;
exports.validateFilePath = validateFilePath;
const constants_1 = require("../core/constants");
class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
    }
}
exports.ValidationError = ValidationError;
function validateCount(count) {
    const num = typeof count === 'string' ? parseInt(count, 10) : count;
    if (isNaN(num) || num <= 0) {
        throw new ValidationError('Count must be a positive number');
    }
    if (num > 100000) {
        throw new ValidationError('Count cannot exceed 100,000 for performance reasons');
    }
    return num;
}
function validateGender(gender) {
    if (gender === 'random')
        return undefined;
    if (!Object.values(constants_1.GENDERS).includes(gender)) {
        throw new ValidationError(`Gender must be one of: ${Object.values(constants_1.GENDERS).join(', ')}, or "random"`);
    }
    return gender;
}
function validateRegion(region) {
    if (region === 'general')
        return undefined;
    const validRegions = ['north', 'south', 'randstad'];
    if (!validRegions.includes(region)) {
        throw new ValidationError(`Region must be one of: ${validRegions.join(', ')}, or "general"`);
    }
    return region;
}
function validateGeneration(generation) {
    if (generation === 'general')
        return undefined;
    const validGenerations = ['traditional', 'modern', 'contemporary'];
    if (!validGenerations.includes(generation)) {
        throw new ValidationError(`Generation must be one of: ${validGenerations.join(', ')}, or "general"`);
    }
    return generation;
}
function validateExportFormat(format) {
    if (!Object.values(constants_1.EXPORT_FORMATS).includes(format)) {
        throw new ValidationError(`Format must be one of: ${Object.values(constants_1.EXPORT_FORMATS).join(', ')}`);
    }
    return format;
}
function validateSeed(seed) {
    if (seed === undefined || seed === '')
        return undefined;
    const num = typeof seed === 'string' ? parseInt(seed, 10) : seed;
    if (isNaN(num)) {
        throw new ValidationError('Seed must be a valid number');
    }
    return num;
}
function validateFilePath(filePath) {
    if (!filePath || filePath.trim() === '') {
        throw new ValidationError('File path cannot be empty');
    }
    const normalizedPath = filePath.trim();
    // Check for invalid characters (basic validation)
    const invalidChars = /[<>:"|?*]/;
    if (invalidChars.test(normalizedPath)) {
        throw new ValidationError('File path contains invalid characters');
    }
    return normalizedPath;
}
//# sourceMappingURL=validations.js.map