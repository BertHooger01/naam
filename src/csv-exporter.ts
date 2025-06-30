import { createObjectCsvWriter } from 'csv-writer';
import { DutchName } from './generator';

export class CSVExporter {
    async exportToCSV(names: DutchName[], filePath: string): Promise<void> {
        const csvWriter = createObjectCsvWriter({
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

    async exportToCSVWithStats(names: DutchName[], filePath: string): Promise<void> {
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

        const csvWriter = createObjectCsvWriter({
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