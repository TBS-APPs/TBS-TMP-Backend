import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { MobilePlatform } from '../../core/enums/mobile-platform.enum';
import { MobileAppSetting } from '../../modules/mobile-app-settings/entities/mobile-app-setting.entity';

export default class MobileAppSettingsSeeder implements Seeder {
  track = false;

  async run(
    dataSource: DataSource,
    _factoryManager: SeederFactoryManager,
  ): Promise<void> {
    const repo = dataSource.getRepository(MobileAppSetting);

    for (const platform of Object.values(MobilePlatform)) {
      const existing = await repo.findOne({ where: { platform } });
      if (!existing) {
        await repo.save({ platform });
      }
    }
  }
}
