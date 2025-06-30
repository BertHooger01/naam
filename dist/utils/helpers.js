"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.capitalizeFirst = capitalizeFirst;
exports.formatFileName = formatFileName;
exports.calculateStats = calculateStats;
exports.ensureArray = ensureArray;
exports.chunk = chunk;
exports.sleep = sleep;
exports.formatPercentage = formatPercentage;
exports.getFileExtension = getFileExtension;
exports.removeFileExtension = removeFileExtension;
exports.mergeArrays = mergeArrays;
exports.unique = unique;
exports.groupBy = groupBy;
function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
function formatFileName(baseName, extension, options) {
    let fileName = baseName;
    if (options?.region && options.region !== 'general') {
        fileName += `-${options.region}`;
    }
    if (options?.generation && options.generation !== 'general') {
        fileName += `-${options.generation}`;
    }
    if (options?.gender) {
        fileName += `-${options.gender}`;
    }
    if (options?.timestamp) {
        const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
        fileName += `-${timestamp}`;
    }
    return `${fileName}.${extension}`;
}
function calculateStats(names) {
    const maleCount = names.filter(n => n.gender === 'male').length;
    const femaleCount = names.filter(n => n.gender === 'female').length;
    const uniqueFirstNames = new Set(names.map(n => n.firstName)).size;
    const uniqueLastNames = new Set(names.map(n => n.lastName)).size;
    const avgFirstNameLength = names.reduce((sum, n) => sum + n.firstName.length, 0) / names.length;
    const avgLastNameLength = names.reduce((sum, n) => sum + n.lastName.length, 0) / names.length;
    const regionDistribution = {};
    const generationDistribution = {};
    names.forEach(name => {
        const region = name.region || 'general';
        const generation = name.generation || 'modern';
        regionDistribution[region] = (regionDistribution[region] || 0) + 1;
        generationDistribution[generation] = (generationDistribution[generation] || 0) + 1;
    });
    return {
        totalGenerated: names.length,
        maleCount,
        femaleCount,
        uniqueFirstNames,
        uniqueLastNames,
        avgFirstNameLength: Number(avgFirstNameLength.toFixed(1)),
        avgLastNameLength: Number(avgLastNameLength.toFixed(1)),
        regionDistribution,
        generationDistribution
    };
}
function ensureArray(value) {
    return Array.isArray(value) ? value : [value];
}
function chunk(array, size) {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
    }
    return chunks;
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function formatPercentage(value, total) {
    return ((value / total) * 100).toFixed(1) + '%';
}
function getFileExtension(filePath) {
    const parts = filePath.split('.');
    return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
}
function removeFileExtension(filePath) {
    const lastDotIndex = filePath.lastIndexOf('.');
    return lastDotIndex > 0 ? filePath.substring(0, lastDotIndex) : filePath;
}
function mergeArrays(...arrays) {
    return arrays.reduce((acc, arr) => acc.concat(arr), []);
}
function unique(array) {
    return [...new Set(array)];
}
function groupBy(array, keyFn) {
    return array.reduce((groups, item) => {
        const key = keyFn(item);
        if (!groups[key]) {
            groups[key] = [];
        }
        groups[key].push(item);
        return groups;
    }, {});
}
//# sourceMappingURL=helpers.js.map