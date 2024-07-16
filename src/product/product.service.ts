import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateProductDto, RateProductDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async createProduct(createProductDto: CreateProductDto) {
    console.log(createProductDto);
    try {
      const product = await this.prisma.product.create({
        data: {
          name: createProductDto.name,
          brand: createProductDto.brand,
          description: createProductDto.description,
          price: createProductDto.price,
          colors: createProductDto.colors,
          images: createProductDto.images,
          sizes: createProductDto.sizes,
        },
      });
      return product;
    } catch (error) {
      console.log(error);
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002')
          throw new ForbiddenException('Product with same name already exists');
      }
      throw error;
    }
  }

  async createBulkProduct(createProductDtos: CreateProductDto[]) {
    try {
      const products = await this.prisma.$transaction([
        this.prisma.product.createMany({
          data: createProductDtos,
        }),
      ]);
      return products;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002')
          throw new ForbiddenException('Produch with name already exists');
      }
    }
  }

  async getAllProducts() {
    const products = await this.prisma.product.findMany({
      include: {
        reviews: true,
      },
    });

    return products;
  }

  async getProductById(productId: string) {
    const product = await this.prisma.product.findUnique({
      where: {
        id: productId,
      },
    });
    return product;
  }

  async deleteProductById(productId: string) {
    const product = await this.prisma.product.delete({
      where: {
        id: productId,
      },
    });

    return 'deleted successfully';
  }

  async rateProduct(rateProduct: RateProductDto) {
    /*
     * Prisma upsert function doesn't provide ability to search with fields that are not unique
     * So the work around is first search for the document if it exists fire update query otherwise fire insert query
     * Then fetch all ratings of current processed product sum all the ratings divide it by total count and this will be out avg rating
     *
     */

    const alreadyRated = await this.prisma.review.findFirst({
      where: {
        userId: rateProduct.userId,
        productId: rateProduct.productId,
      },
    });

    if (alreadyRated) {
      await this.prisma.review.update({
        where: {
          id: alreadyRated.id,
        },
        data: {
          description: rateProduct.description,
          rating: rateProduct.rating,
        },
      });
    } else {
      await this.prisma.review.create({
        data: {
          description: rateProduct.description,
          rating: rateProduct.rating,
          userId: rateProduct.userId,
          productId: rateProduct.productId,
        },
      });
    }

    const productRatings = await this.prisma.review.findMany({
      where: {
        productId: rateProduct.productId,
      },
    });

    const totalRating = productRatings.reduce((totalRating, { rating }) => {
      return totalRating + rating;
    }, 0);

    const newRating = totalRating / productRatings.length;

    const updatedProduct = this.prisma.product.update({
      where: {
        id: rateProduct.productId,
      },
      data: {
        rating: newRating,
      },
    });

    return updatedProduct;
  }
}
