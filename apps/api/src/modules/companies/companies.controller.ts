import { Controller, Get, Body, Patch, UseGuards, Request } from '@nestjs/common';
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
}
