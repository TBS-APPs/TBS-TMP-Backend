import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../user/user.service';
import { JwtAccessPayload } from './interfaces/jwt-access-payload.interface';
import { User } from '../user/entities/user.entity';
import { ApiResponseStatus } from 'src/core/enums/api-response-status.enum';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JwtAccessPayload): Promise<User | null> {
    const id = payload.sub;
    const result = await this.userService.findOne({ id });

    if (result.status !== ApiResponseStatus.SUCCESS || !result.data) {
      return null;
    }

    return result.data;
  }
}
