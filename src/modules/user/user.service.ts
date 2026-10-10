import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { ApiResponse } from 'src/core/interfaces/api-response.interface';
import {
  successResponse,
  errorResponse,
} from 'src/core/utils/transform/transform.interceptor';
import { I18nContext } from 'nestjs-i18n';
import { ERROR_KEYS } from 'src/core/constants/translations.constants';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(
    createUserDto: CreateUserDto,
  ): Promise<ApiResponse<User | null>> {
    try {
      const user = this.usersRepository.create(createUserDto);
      const saved = await this.usersRepository.save(user);
      return successResponse({ data: saved, httpCode: HttpStatus.CREATED });
    } catch {
      const i18n = I18nContext.current();
      return errorResponse({
        httpCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: i18n?.t(ERROR_KEYS.INTERNAL_SERVER_ERROR),
      });
    }
  }

  async findOne({
    id,
    email,
  }: {
    id?: string;
    email?: string;
  }): Promise<ApiResponse<User | null>> {
    const i18n = I18nContext.current();
    const hasId = id !== undefined && id !== null;
    const hasEmail = typeof email === 'string' && email.trim().length > 0;

    if ((hasId && hasEmail) || (!hasId && !hasEmail)) {
      return errorResponse({
        httpCode: HttpStatus.BAD_REQUEST,
        message: i18n?.t(ERROR_KEYS.PROVIDE_EMAIL_OR_ID),
      });
    }

    try {
      const user = await this.usersRepository.findOne({
        where: hasId ? { id } : { email: email!.trim() },
      });

      if (!user) {
        return errorResponse({
          httpCode: HttpStatus.NOT_FOUND,
          message: i18n?.t(ERROR_KEYS.USER_NOT_FOUND),
        });
      }

      return successResponse({ data: user });
    } catch {
      return errorResponse({
        httpCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: i18n?.t(ERROR_KEYS.INTERNAL_SERVER_ERROR),
      });
    }
  }
}
