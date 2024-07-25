import { Injectable } from '@nestjs/common';
import { CurrentUserDto } from 'src/common/dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAddressDto, UpdateAddressDto } from './dto';
import { Address } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createAddress(user: CurrentUserDto, createAddressDto: CreateAddressDto): Promise<Address> {
    const address = await this.prisma.address.create({
      data: {
        city: createAddressDto.city,
        country: createAddressDto.country,
        line_one: createAddressDto.line_one,
        name: createAddressDto.name,
        postal_code: createAddressDto.postal_code,
        state: createAddressDto.state,
        userId: user.sub,
        contact: createAddressDto.contact,
      },
    });

    return address;
  }

  async getAddressesByUser(userId: string): Promise<Address[]> {
    const addresses = await this.prisma.address.findMany({
      where: {
        userId: userId,
      },
    });

    return addresses;
  }

  async updateAddress(addressId: string, updateAddressDto: UpdateAddressDto): Promise<Address> {
    const address = await this.prisma.address.update({
      where: {
        id: addressId,
      },

      data: {
        ...updateAddressDto,
      },
    });

    return address;
  }

  async deleteAddressById(addressId: string): Promise<string> {
    await this.prisma.address.delete({
      where: {
        id: addressId,
      },
    });

    return 'Address deleted successfully';
  }
}
