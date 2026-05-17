import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class EncryptionService {
  private saltRounds: number;

  constructor(private configService: ConfigService) {
    this.saltRounds = Number(this.configService.get('BCRYPT_SALT_ROUNDS'));
  }

  async encrypt(data: string): Promise<string> {
    return await bcrypt.hash(data, this.saltRounds);
  }

  async compare(data: string, encryptedData: string): Promise<boolean> {
    return await bcrypt.compare(data, encryptedData);
  }
}
