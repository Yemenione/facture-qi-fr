import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('documents')
@UseGuards(JwtAuthGuard)
export class DocumentsController {
    constructor(private readonly documentsService: DocumentsService) { }

    @Get()
    async getDocuments(@Request() req) {
        // If user is accountant, get all documents
        if (req.user.role === 'ACCOUNTANT') {
            return this.documentsService.getAllDocumentsForAccountant(req.user.accountantFirmId);
        }

        // Otherwise get company documents
        return this.documentsService.getDocumentsByCompany(req.user.companyId);
    }

    @Get('stats')
    async getStats(@Request() req) {
        if (req.user.role === 'ACCOUNTANT') {
            return this.documentsService.getDocumentStats(req.user.accountantFirmId);
        }

        return { total: 0, byCategory: {} };
    }
}
