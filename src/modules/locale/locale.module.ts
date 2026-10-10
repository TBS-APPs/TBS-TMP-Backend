import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Locale } from './entities/locale.entity';
import { LocaleController } from './locale.controller';
import { LocaleService } from './locale.service';

@Module({
  imports: [TypeOrmModule.forFeature([Locale])],
  controllers: [LocaleController],
  providers: [LocaleService],
  exports: [TypeOrmModule],
})
export class LocaleModule {}
