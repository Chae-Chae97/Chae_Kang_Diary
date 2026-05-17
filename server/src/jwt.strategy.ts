import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    const secret = process.env.JWT_SECRET || 'admin'; // .env 값과 일치하도록 유도

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: any) {
    console.log(`[JwtStrategy] Validating payload:`, payload);

    if (!payload || !payload.sub) {
      throw new UnauthorizedException('유효하지 않은 토큰 페이로드입니다.');
    }

    return { userId: payload.sub, email: payload.email };
  }
}
