import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto, CreateGoogleUserDto, CreateUserDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Token } from './types';
import { Role } from '@prisma/client';
import * as admin from 'firebase-admin';
import { FIREBASE_CLIENT } from 'src/common/constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(FIREBASE_CLIENT) private readonly firebaseKey: admin.app.App,
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

    return await this.generateToken(user.id, user.email, user.name, user.roles);
  }

  async signup(dto: CreateUserDto): Promise<Token> {
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
      return await this.generateToken(user.id, user.email, user.name, user.roles);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') throw new ForbiddenException('User already exists');
      }
    }
  }

  async signinWithGoogle(dto: CreateGoogleUserDto) {
    try {
      /*
      * * This is a workaround as google signin is used for both signin and signup as default behaviour
      * To garuntee user registration at our user record as well we will use this single method for signin and signup as well
      * Whenever google signin is used we will first check if record is created or not in at our end 
      * If not create a record (This will be the state where user is signing in first time directly without signingup ) or else return existing user (This will be the state where user followed classic flow of signingup and then signing in)
      * Another much simpler and a standard flow will just using firebase cloud functions and trigger registration event when new user is created at firebase auth

     */
      const doesExists = await this.prisma.user.findUnique({
        where: {
          email: dto.email,
        },
      });
      if (doesExists) return doesExists;

      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          name: dto.name,
          uid: dto.uid,
        },
      });
      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') throw new ForbiddenException('User already exists');
      }
    }
  }

  private async generateToken(userId: string, email: string, name: string, roles: Role[]): Promise<Token> {
    const to = await this.firebaseKey.auth().createCustomToken(userId, {
      email,
      name,
      roles,
    });

    return {
      accessToken: to,
    };
  }
}
