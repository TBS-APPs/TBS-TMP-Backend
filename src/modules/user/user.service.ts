import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
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
    private i18n: I18nContext,
  ) {}
  async create(
    createUserDto: CreateUserDto,
  ): Promise<ApiResponse<User | null>> {
    try {
      const user = await this.usersRepository.save(createUserDto);
      return successResponse({ data: user });
    } catch {
      return errorResponse();
    }
  }

  // findAll() {
  //   return `This action returns all user`;
  // }

  async findOne({
    id,
    email,
    encryptedPassword,
  }: {
    id?: number;
    email?: string;
    encryptedPassword?: string;
  }): Promise<ApiResponse<User | null>> {
    try {
      const where: FindOptionsWhere<User> = {};
      if (id) {
        where.id = id;
      }
      if (email) {
        where.email = email;
      }
      if (encryptedPassword) {
        // const encryptedPassword =
        //   await this.encryptionService.encrypt(password);
        where.password = encryptedPassword;
      }
      const user = await this.usersRepository.findOne({
        where,
      });
      if (!user) {
        return errorResponse({
          message: this.i18n.t(ERROR_KEYS.USER_NOT_FOUND),
          httpCode: HttpStatus.NOT_FOUND,
        });
      }
      return successResponse({ data: user });
    } catch {
      return errorResponse();
    }
  }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
