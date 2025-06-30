"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CSVExporter = void 0;
const csv_writer_1 = require("csv-writer");
const helpers_1 = require("../utils/helpers");
class CSVExporter {
    async exportToCSV(names, filePath) {
        const csvWriter = (0, csv_writer_1.createObjectCsvWriter)({
            path: filePath,
            header: [
                { id: 'firstName', title: 'First Name' },
                { id: 'lastName', title: 'Last Name' },
                { id: 'fullName', title: 'Full Name' },
                { id: 'gender', title: 'Gender' },
                { id: 'region', title: 'Region' },
                { id: 'generation', title: 'Generation' }
            ]
        });
        await csvWriter.writeRecords(names);
    }
    async exportToCSVWithStats(names, filePath, metadata) {
        const stats = (0, helpers_1.calculateStats)(names);
        const summaryData = [
            { firstName: '--- EXPORT METADATA ---', lastName: '', fullName: '', gender: '', region: '', generation: '' },
            { firstName: 'Generated At', lastName: new Date().toISOString(), fullName: '', gender: '', region: '', generation: '' },
            { firstName: 'Total Names', lastName: stats.totalGenerated.toString(), fullName: '', gender: '', region: '', generation: '' },
            { firstName: 'Male Names', lastName: stats.maleCount.toString(), fullName: `${((stats.maleCount / stats.totalGenerated) * 100).toFixed(1)}%`, gender: '', region: '', generation: '' },
            { firstName: 'Female Names', lastName: stats.femaleCount.toString(), fullName: `${((stats.femaleCount / stats.totalGenerated) * 100).toFixed(1)}%`, gender: '', region: '', generation: '' },
            { firstName: 'Unique First Names', lastName: stats.uniqueFirstNames.toString(), fullName: '', gender: '', region: '', generation: '' },
            { firstName: 'Unique Last Names', lastName: stats.uniqueLastNames.toString(), fullName: '', gender: '', region: '', generation: '' },
            { firstName: 'Avg First Name Length', lastName: stats.avgFirstNameLength.toString(), fullName: '', gender: '', region: '', generation: '' },
            { firstName: 'Avg Last Name Length', lastName: stats.avgLastNameLength.toString(), fullName: '', gender: '', region: '', generation: '' },
            { firstName: '--- DATA ---', lastName: '', fullName: '', gender: '', region: '', generation: '' },
            ...names
        ];
        const csvWriter = (0, csv_writer_1.createObjectCsvWriter)({
            path: filePath,
            header: [
                { id: 'firstName', title: 'First Name' },
                { id: 'lastName', title: 'Last Name' },
                { id: 'fullName', title: 'Full Name' },
                { id: 'gender', title: 'Gender' },
                { id: 'region', title: 'Region' },
                { id: 'generation', title: 'Generation' }
            ]
        });
        await csvWriter.writeRecords(summaryData);
    }
}
exports.CSVExporter = CSVExporter;
//# sourceMappingURL=csv.js.map