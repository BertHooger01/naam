"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dutchNameGenerator = exports.SeededRandom = exports.formatFileName = exports.calculateStats = exports.TXTExporter = exports.JSONExporter = exports.CSVExporter = exports.DutchPhoneticNameGenerator = void 0;
const generator_1 = require("../core/generator");
var generator_2 = require("../core/generator");
Object.defineProperty(exports, "DutchPhoneticNameGenerator", { enumerable: true, get: function () { return generator_2.DutchPhoneticNameGenerator; } });
var export_1 = require("../export");
Object.defineProperty(exports, "CSVExporter", { enumerable: true, get: function () { return export_1.CSVExporter; } });
Object.defineProperty(exports, "JSONExporter", { enumerable: true, get: function () { return export_1.JSONExporter; } });
Object.defineProperty(exports, "TXTExporter", { enumerable: true, get: function () { return export_1.TXTExporter; } });
var helpers_1 = require("../utils/helpers");
Object.defineProperty(exports, "calculateStats", { enumerable: true, get: function () { return helpers_1.calculateStats; } });
Object.defineProperty(exports, "formatFileName", { enumerable: true, get: function () { return helpers_1.formatFileName; } });
var random_1 = require("../utils/random");
Object.defineProperty(exports, "SeededRandom", { enumerable: true, get: function () { return random_1.SeededRandom; } });
// Create a default instance for convenience
exports.dutchNameGenerator = new generator_1.DutchPhoneticNameGenerator();
//# sourceMappingURL=index.js.map