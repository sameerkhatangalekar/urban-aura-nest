import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto, CreateUserDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { Token } from './types';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signin(dto: AuthDto): Promise<Token> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) throw new ForbiddenException('User does not exists');

    const isMatched = await argon.verify(user.password, dto.password);

    if (!isMatched) throw new ForbiddenException('Wrong credentials');

    return await this.generateToken(user.id, user.email, user.roles);
  }

  async signup(dto: CreateUserDto) {
    try {
      const hashedPassword = await argon.hash(dto.password);

      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          name: dto.name,
          password: hashedPassword,
        },
      });
      delete user.password;
      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002')
          throw new ForbiddenException('User already exists');
      }
    }
  }

  private async generateToken(
    userId: string,
    email: string,
    roles: Role[],
  ): Promise<Token> {
    const token = await this.jwtService.signAsync({
      sub: userId,
      email,
      roles,
    });

    return {
      accessToken: token,
    };
  }
}
