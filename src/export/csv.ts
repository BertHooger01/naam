import { createObjectCsvWriter } from 'csv-writer';
import { DutchName, ExportMetadata } from '../core/types';
import { calculateStats } from '../utils/helpers';

export class CSVExporter {
    async exportToCSV(names: DutchName[], filePath: string): Promise<void> {
        const csvWriter = createObjectCsvWriter({
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

    async exportToCSVWithStats(names: DutchName[], filePath: string, metadata?: ExportMetadata): Promise<void> {
        const stats = calculateStats(names);

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

        const csvWriter = createObjectCsvWriter({
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