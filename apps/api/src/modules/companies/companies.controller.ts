import { Controller, Get, Body, Patch, UseGuards, Request, Param, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CompaniesService } from './companies.service';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('companies')
@UseGuards(JwtAuthGuard)
export class CompaniesController {
    constructor(private readonly companiesService: CompaniesService) { }

    @Get('me')
    findOne(@Request() req) {
        return this.companiesService.findOne(req.user.companyId);
    }

    @Patch('me')
    update(@Request() req, @Body() updateCompanyDto: UpdateCompanyDto) {
        return this.companiesService.update(req.user.companyId, updateCompanyDto);
    }
    @Get('search-siret/:siret')
    searchSiret(@Param('siret') siret: string) {
        return this.companiesService.searchSiret(siret);
    }

    @Post('logo')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads/logos',
            filename: (req, file, cb) => {
                const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
                return cb(null, `${randomName}${extname(file.originalname)}`);
            }
        })
    }))
    @Get('logo')
    getLogo(@Request() req) {
        return this.companiesService.findOne(req.user.companyId);
    }

    // Admin/Accountant endpoint to list all companies
    @Get('admin/all')
    findAll() {
        return this.companiesService.findAll();
    }

    @Get('firm/all')
    findFirmClients(@Request() req) {
        // Warning: This presumes strict separation. 
        // Real-world: Check if user is actually attached to a firm.
        if (!req.user.accountantFirmId) {
            // Throw error or return empty
            return [];
        }
        return this.companiesService.findByFirm(req.user.accountantFirmId);
    }

    @Post('logo')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads/logos',
            filename: (req, file, cb) => {
                const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
                return cb(null, `${randomName}${extname(file.originalname)}`);
            }
        })
    }))
    uploadLogo(@Request() req, @UploadedFile() file: Express.Multer.File) {
        return this.companiesService.updateLogo(req.user.companyId, `/uploads/logos/${file.filename}`);
    }
}
