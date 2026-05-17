import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { EncryptionService } from 'src/core/services/encryption/encryption.service';

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [AuthService, EncryptionService],
})
export class AuthModule {}
