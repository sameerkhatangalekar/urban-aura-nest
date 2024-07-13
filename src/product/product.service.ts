import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class ProductService {

    constructor(private prisma: PrismaService) { }


    async createProduct(createProductDto: CreateProductDto) {
        try {
            const product = await this.prisma.product.create({
                data: {
                    name: createProductDto.name,
                    description: createProductDto.description,
                    price: createProductDto.price,
                    colors: createProductDto.colors,
                    images: createProductDto.images,
                    sizes: createProductDto.sizes
                }
            })
            return product;
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002')
                    throw new ForbiddenException('User already exists');
            }
        }

    }

    async getAllProducts() {
        const products = await this.prisma.product.findMany();
        return products;
    }

    async getProductById(productId: string) {
        const product = await this.prisma.product.findUnique({
            where: {
                id: productId
            }
        });

        return product

    }




}   
