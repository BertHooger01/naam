"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSONExporter = void 0;
const fs_1 = __importDefault(require("fs"));
const helpers_1 = require("../utils/helpers");
class JSONExporter {
    exportToJSON(names, filePath) {
        const data = JSON.stringify(names, null, 2);
        fs_1.default.writeFileSync(filePath, data);
    }
    exportToJSONWithStats(names, filePath, options) {
        const stats = (0, helpers_1.calculateStats)(names);
        const metadata = {
            totalNames: names.length,
            maleCount: stats.maleCount,
            femaleCount: stats.femaleCount,
            generatedAt: new Date().toISOString(),
            options
        };
        const exportData = {
            metadata,
            names
        };
        const data = JSON.stringify(exportData, null, 2);
        fs_1.default.writeFileSync(filePath, data);
    }
    exportStats(names, filePath) {
        const stats = (0, helpers_1.calculateStats)(names);
        const data = JSON.stringify(stats, null, 2);
        fs_1.default.writeFileSync(filePath, data);
    }
}
exports.JSONExporter = JSONExporter;
//# sourceMappingURL=json.js.map