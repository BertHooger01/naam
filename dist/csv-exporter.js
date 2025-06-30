"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CSVExporter = void 0;
const csv_writer_1 = require("csv-writer");
class CSVExporter {
    async exportToCSV(names, filePath) {
        const csvWriter = (0, csv_writer_1.createObjectCsvWriter)({
            path: filePath,
            header: [
                { id: 'firstName', title: 'First Name' },
                { id: 'lastName', title: 'Last Name' },
                { id: 'fullName', title: 'Full Name' },
                { id: 'gender', title: 'Gender' }
            ]
        });
        await csvWriter.writeRecords(names);
    }
    async exportToCSVWithStats(names, filePath) {
        const maleCount = names.filter(n => n.gender === 'male').length;
        const femaleCount = names.filter(n => n.gender === 'female').length;
        const summaryData = [
            { firstName: '--- SUMMARY ---', lastName: '', fullName: '', gender: '' },
            { firstName: 'Total Names', lastName: names.length.toString(), fullName: '', gender: '' },
            { firstName: 'Male Names', lastName: maleCount.toString(), fullName: `${(maleCount / names.length * 100).toFixed(1)}%`, gender: '' },
            { firstName: 'Female Names', lastName: femaleCount.toString(), fullName: `${(femaleCount / names.length * 100).toFixed(1)}%`, gender: '' },
            { firstName: '--- DATA ---', lastName: '', fullName: '', gender: '' },
            ...names
        ];
        const csvWriter = (0, csv_writer_1.createObjectCsvWriter)({
            path: filePath,
            header: [
                { id: 'firstName', title: 'First Name' },
                { id: 'lastName', title: 'Last Name' },
                { id: 'fullName', title: 'Full Name' },
                { id: 'gender', title: 'Gender' }
            ]
        });
        await csvWriter.writeRecords(summaryData);
    }
}
exports.CSVExporter = CSVExporter;
//# sourceMappingURL=csv-exporter.js.map