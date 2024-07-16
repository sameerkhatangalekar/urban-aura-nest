import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto, RateProductDto } from './dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators';

@ApiTags('Product')
@ApiBearerAuth()
@Controller('products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post()
  @Roles(['ADMIN'])
  @HttpCode(HttpStatus.CREATED)
  async createProduct(@Body() createProductDto: CreateProductDto) {
    console.log(createProductDto);
    const product = await this.productService.createProduct(createProductDto);

    return product;
  }

  @Post('bulk')
  @Roles(['ADMIN'])
  @HttpCode(HttpStatus.CREATED)
  async createBulkProduct(@Body() createProductDto: CreateProductDto[]) {
    const product =
      await this.productService.createBulkProduct(createProductDto);

    return product;
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllProducts() {
    const products = await this.productService.getAllProducts();

    return products;
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getProductById(@Param('id') productId: string) {
    const product = await this.productService.getProductById(productId);

    return product;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteProductById(@Param('id') productId: string) {
    const product = await this.productService.deleteProductById(productId);

    return product;
  }

  @Put('rating')
  @HttpCode(HttpStatus.OK)
  async rateProduct(rateProduct: RateProductDto) {
    const product = await this.productService.rateProduct(rateProduct);
    return product;
  }
}
