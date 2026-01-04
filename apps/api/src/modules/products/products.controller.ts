import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Post()
    create(@Request() req, @Body() createProductDto: CreateProductDto) {
        return this.productsService.create(req.user.companyId, createProductDto);
    }

    @Get()
    findAll(@Request() req) {
        return this.productsService.findAll(req.user.companyId);
    }

    @Get(':id')
    findOne(@Request() req, @Param('id') id: string) {
        return this.productsService.findOne(req.user.companyId, id);
    }

    @Patch(':id')
    update(@Request() req, @Param('id') id: string, @Body() updateProductDto: Partial<CreateProductDto>) {
        return this.productsService.update(req.user.companyId, id, updateProductDto);
    }

    @Delete(':id')
    remove(@Request() req, @Param('id') id: string) {
        return this.productsService.remove(req.user.companyId, id);
    }
}
