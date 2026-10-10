import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocaleModule } from '../locale/locale.module';
import ModuleEntity from '../module/entities/module.entity';
import { ScreenController } from './screen.controller';
import { ScreenService } from './screen.service';
import { Screen } from './entities/screen.entity';
import { ScreenTranslation } from './entities/screen-translation.entity';

@Module({
  imports: [
    LocaleModule,
    TypeOrmModule.forFeature([Screen, ScreenTranslation, ModuleEntity]),
  ],
  controllers: [ScreenController],
  providers: [ScreenService],
})
export class ScreenModule {}
