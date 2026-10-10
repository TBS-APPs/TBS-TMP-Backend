import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocaleModule } from '../locale/locale.module';
import { ModuleController } from './module.controller';
import { ModuleService } from './module.service';
import ModuleEntity from './entities/module.entity';
import { ModuleTranslation } from './entities/module-translation.entity';

@Module({
  imports: [
    LocaleModule,
    TypeOrmModule.forFeature([ModuleEntity, ModuleTranslation]),
  ],
  controllers: [ModuleController],
  providers: [ModuleService],
})
export class ModuleModule {}
