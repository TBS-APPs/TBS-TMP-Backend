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
import { UserStatus } from '../user/user-status.enum';
import { ApiResponse } from 'src/core/interfaces/api-response.interface';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly encryptionService: EncryptionService,
  ) {}

  async login(loginDto: LoginDto): Promise<ApiResponse<User | null>> {
    const i18n = I18nContext.current();
    const lookup = await this.userService.findOne({ email: loginDto.email });

    if (lookup.status !== ApiResponseStatus.SUCCESS || !lookup.data) {
      return errorResponse({
        httpCode: HttpStatus.UNAUTHORIZED,
        message: i18n?.t(ERROR_KEYS.INVALID_CREDENTIALS),
      });
    }

    const user = lookup.data;

    if (
      user.status === UserStatus.BLOCKED ||
      user.status === UserStatus.INACTIVE
    ) {
      return errorResponse({
        httpCode: HttpStatus.UNAUTHORIZED,
        message: i18n?.t(ERROR_KEYS.INVALID_CREDENTIALS),
      });
    }

    const passwordMatches = await this.encryptionService.compare(
      loginDto.password,
      user.password,
    );

    if (!passwordMatches) {
      return errorResponse({
        httpCode: HttpStatus.UNAUTHORIZED,
        message: i18n?.t(ERROR_KEYS.INVALID_CREDENTIALS),
      });
    }

    return successResponse({ data: user });
  }

  async register(registerDto: RegisterDto): Promise<ApiResponse<User | null>> {
    const i18n = I18nContext.current();

    const existing = await this.userService.findOne({
      email: registerDto.email,
    });

    if (existing.status === ApiResponseStatus.SUCCESS && existing.data) {
      return errorResponse({
        httpCode: HttpStatus.CONFLICT,
        message: i18n?.t(ERROR_KEYS.EMAIL_ALREADY_REGISTERED),
      });
    }

    const hashedPassword = await this.encryptionService.encrypt(
      registerDto.password,
    );

    return this.userService.create({
      email: registerDto.email,
      name: registerDto.name,
      password: hashedPassword,
      /// TODO: Change to pending later
      status: UserStatus.ACTIVE,
    });
  }
}
