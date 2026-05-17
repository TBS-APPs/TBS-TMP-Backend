import { HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import {
  errorResponse,
  successResponse,
} from 'src/core/utils/transform/transform.interceptor';
import { ERROR_KEYS } from 'src/core/constants/translations.constants';
import { I18nContext } from 'nestjs-i18n';
import { EncryptionService } from 'src/core/services/encryption/encryption.service';
import { ApiResponseStatus } from 'src/core/enums/api-response-status.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly i18n: I18nContext,
    private readonly encryptionService: EncryptionService,
  ) {}

  async login(loginDto: LoginDto) {
    try {
      const userResponse = await this.userService.findOne({
        email: loginDto.email,
      });
      if (userResponse.status === ApiResponseStatus.FAILED) {
        return userResponse;
      }

      const user = userResponse.data;
      if (!user) {
        return errorResponse({
          message: this.i18n.t(ERROR_KEYS.USER_NOT_FOUND),
          httpCode: HttpStatus.NOT_FOUND,
        });
      }

      const passwordMatch = await this.encryptionService.compare(
        loginDto.password,
        user.password,
      );

      if (!passwordMatch) {
        return errorResponse({
          message: this.i18n.t(ERROR_KEYS.INVALID_CREDENTIALS),
          httpCode: HttpStatus.UNAUTHORIZED,
        });
      }

      return successResponse({ data: user });
    } catch {
      return errorResponse();
    }
  }

  async register(registerDto: RegisterDto) {
    try {
      const userResponse = await this.userService.create(registerDto);
      if (userResponse.status === ApiResponseStatus.FAILED) {
        return userResponse;
      }
      return successResponse({ data: userResponse.data });
    } catch {
      return errorResponse();
    }
  }
}
