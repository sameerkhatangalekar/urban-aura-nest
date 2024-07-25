import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { GetCurrentUser } from 'src/common/decorators';
import { CurrentUserDto } from 'src/common/dto';
import { CreateAddressDto, UpdateAddressDto } from './dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('address')
  @HttpCode(HttpStatus.CREATED)
  async createAddress(@GetCurrentUser() user: CurrentUserDto, @Body() createAddressDto: CreateAddressDto) {
    const address = await this.userService.createAddress(user, createAddressDto);

    return address;
  }

  @Get('address')
  @HttpCode(HttpStatus.OK)
  async getAddressByUser(@GetCurrentUser() user: CurrentUserDto) {
    return await this.userService.getAddressesByUser(user.sub);
  }

  @Put('address/:addressId')
  @HttpCode(HttpStatus.ACCEPTED)
  async updateAddress(
    @GetCurrentUser() user: CurrentUserDto,
    @Param('addressId') addressId: string,
    @Body() updateAddressDto: UpdateAddressDto,
  ) {
    return await this.userService.updateAddress(addressId, updateAddressDto);
  }

  @Delete('address/:addressId')
  @HttpCode(HttpStatus.ACCEPTED)
  async deleteAddressById(@Param('addressId') addressId: string) {
    return await this.userService.deleteAddressById(addressId);
  }
}
