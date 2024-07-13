import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

/*
 * This passport strategy will be referred by AccessTokenGaurd which extending AuthGaurd using the name value 'jwt' for validating tokens
 * This strategy needs to be injected in order to be searched by gaurds
 */
@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

  validate(paylood: any) {
    return paylood;
  }
}

/*
 *  Token validation strategy
 *  This handler attaches user to request automatically
 */
