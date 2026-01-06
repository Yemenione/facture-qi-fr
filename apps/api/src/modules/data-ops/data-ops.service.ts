import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as ExcelJS from 'exceljs';
import { Response } from 'express';

@Injectable()
export class DataOpsService {
    constructor(private prisma: PrismaService) { }

    async exportData(type: string, format: 'xlsx' | 'csv', res: Response, companyId: string, id?: string) {
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet(type.toUpperCase());

        let data = [];
        let columns = [];

        // 1. Fetch Data based on Type
        if (type === 'clients') {
            data = await this.prisma.client.findMany({ where: { companyId } });
            columns = [
                { header: 'ID', key: 'id', width: 30 },
                { header: 'Name', key: 'name', width: 30 },
                { header: 'Email', key: 'email', width: 30 },
                { header: 'Phone', key: 'phone', width: 20 },
                { header: 'Address', key: 'address', width: 40 },
                { header: 'SIRET', key: 'siret', width: 20 },
            ];
        } else if (type === 'products') {
            data = await this.prisma.product.findMany({ where: { companyId } });
            columns = [
                { header: 'ID', key: 'id', width: 30 },
                { header: 'Name', key: 'name', width: 30 },
                { header: 'Price', key: 'price', width: 15 },
                { header: 'Show Price', key: 'showPriceWithVat', width: 15 },
            ];
        } else if (type === 'invoices') {
            // Filter by ID if provided (Single Invoice Export) or Company (Bulk)
            const whereClause: any = { companyId };
            if (id) whereClause.id = id;

            data = await this.prisma.invoice.findMany({
                where: whereClause,
                include: { client: true, items: true } // Include items for detailed export
            });

            // Flatten for CSV/Excel
            if (id) {
                // Detailed view for single invoice: One row per item
                const flatData = [];
                for (const inv of data) {
                    for (const item of inv.items) {
                        flatData.push({
                            number: inv.number,
                            date: inv.date,
                            clientName: inv.client?.name || 'Unknown',
                            itemDescription: item.description,
                            quantity: item.quantity,
                            unitPrice: item.unitPrice,
                            lineTotal: item.quantity * item.unitPrice,
                            invoiceTotal: inv.total,
                            status: inv.status
                        });
                    }
                }
                data = flatData;
                columns = [
                    { header: 'Invoice #', key: 'number', width: 20 },
                    { header: 'Date', key: 'date', width: 20 },
                    { header: 'Client', key: 'clientName', width: 30 },
                    { header: 'Item', key: 'itemDescription', width: 30 },
                    { header: 'Qty', key: 'quantity', width: 10 },
                    { header: 'Unit Price', key: 'unitPrice', width: 15 },
                    { header: 'Line Total', key: 'lineTotal', width: 15 },
                    { header: 'Total', key: 'invoiceTotal', width: 15 },
                    { header: 'Status', key: 'status', width: 15 },
                ];
            } else {
                // Summary view for valid invoices
                data = data.map(inv => ({
                    id: inv.id,
                    number: inv.number,
                    date: inv.date,
                    dueDate: inv.dueDate,
                    clientName: inv.client?.name || 'Unknown',
                    total: inv.total,
                    status: inv.status
                }));
                columns = [
                    { header: 'ID', key: 'id', width: 30 },
                    { header: 'Number', key: 'number', width: 20 },
                    { header: 'Date', key: 'date', width: 20 },
                    { header: 'Client', key: 'clientName', width: 30 },
                    { header: 'Total', key: 'total', width: 15 },
                    { header: 'Status', key: 'status', width: 15 },
                ];
            }
        } else {
            throw new BadRequestException('Invalid export type');
        }

        sheet.columns = columns;
        sheet.addRows(data);

        // 2. Stream Response
        if (format === 'csv') {
            res.header('Content-Type', 'text/csv');
            res.header('Content-Disposition', `attachment; filename=${type}.csv`);
            await workbook.csv.write(res);
        } else {
            res.header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.header('Content-Disposition', `attachment; filename=${type}.xlsx`);
            await workbook.xlsx.write(res);
        }
    }

    async importData(type: string, data: any[], companyId: string) {
        if (type === 'clients') {
            // Bulk Create
            let count = 0;
            for (const row of data) {
                if (!row.name) continue; // Skip invalid
                await this.prisma.client.create({
                    data: {
                        companyId,
                        name: row.name,
                        email: row.email,
                        phone: row.phone,
                        address: row.address,
                        siret: row.siret
                    }
                }).catch(e => console.error("Import error", e)); // Simple error handling
                count++;
            }
            return { count, success: true };
        }
        throw new BadRequestException('Import type not supported yet');
    }
}
