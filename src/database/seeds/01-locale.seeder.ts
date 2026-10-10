import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { Locale } from '../../modules/locale/entities/locale.entity';

export default class LocaleSeeder implements Seeder {
  track = false;

  async run(
    dataSource: DataSource,
    _factoryManager: SeederFactoryManager,
  ): Promise<void> {
    const repo = dataSource.getRepository(Locale);

    const defaults = [
      { code: 'en', name: 'English', isDefault: true, isActive: true },
      { code: 'ar', name: 'Arabic', isDefault: false, isActive: true },
    ];

    for (const row of defaults) {
      const existing = await repo.findOne({ where: { code: row.code } });
      if (existing) {
        existing.name = row.name;
        existing.isDefault = row.isDefault;
        existing.isActive = row.isActive;
        await repo.save(existing);
      } else {
        if (row.isDefault) {
          await repo
            .createQueryBuilder()
            .update(Locale)
            .set({ isDefault: false })
            .where('isDefault = :isDefault', { isDefault: true })
            .execute();
        }
        await repo.save(row);
      }
    }
  }
}
