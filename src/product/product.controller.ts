import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto';

@Controller('products')
export class ProductController {

    constructor(private productService: ProductService) { }


    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createProduct(@Body() createProductDto: CreateProductDto) {

        const product = await this.productService.createProduct(createProductDto);

        return product;

    }

    @Get()
    @HttpCode(HttpStatus.OK)
    async getAllProducts() {
        const products = await this.productService.getAllProducts();

        return products;
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    async getProductById(@Param('id') productId: string) {
        const product = await this.productService.getProductById(productId);

        return product;
    }
}
