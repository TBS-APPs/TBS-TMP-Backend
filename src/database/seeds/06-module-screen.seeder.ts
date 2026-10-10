import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { Locale } from '../../modules/locale/entities/locale.entity';
import Module from '../../modules/module/entities/module.entity';
import { ModuleTranslation } from '../../modules/module/entities/module-translation.entity';
import { Screen } from '../../modules/screen/entities/screen.entity';
import { ScreenTranslation } from '../../modules/screen/entities/screen-translation.entity';

export default class ModuleScreenSeeder implements Seeder {
  track = false;

  async run(
    dataSource: DataSource,
    _factoryManager: SeederFactoryManager,
  ): Promise<void> {
    const moduleRepo = dataSource.getRepository(Module);
    const moduleTranslationRepo = dataSource.getRepository(ModuleTranslation);
    const screenRepo = dataSource.getRepository(Screen);
    const screenTranslationRepo = dataSource.getRepository(ScreenTranslation);
    const localeRepo = dataSource.getRepository(Locale);

    const locales = await localeRepo.find();
    const en = locales.find((l) => l.code === 'en');
    const ar = locales.find((l) => l.code === 'ar');
    if (!en || !ar) {
      throw new Error('Locale seeder must run before modules (en/ar missing).');
    }

    let module = await moduleRepo.findOne({ where: { alias: 'crm' } });
    if (!module) {
      module = await moduleRepo.save({ alias: 'crm' });
    }

    const moduleNames: Array<{ locale: Locale; name: string }> = [
      { locale: en, name: 'CRM' },
      { locale: ar, name: 'إدارة العملاء' },
    ];
    for (const { locale, name } of moduleNames) {
      const existing = await moduleTranslationRepo.findOne({
        where: { module: { id: module.id }, locale: { id: locale.id } },
      });
      if (existing) {
        existing.name = name;
        await moduleTranslationRepo.save(existing);
      } else {
        await moduleTranslationRepo.save({
          name,
          module: { id: module.id },
          locale: { id: locale.id },
        });
      }
    }

    let screen = await screenRepo.findOne({
      where: { module: { id: module.id }, apiId: 1 },
      relations: { module: true },
    });
    if (!screen) {
      screen = await screenRepo.save({
        apiId: 1,
        module: { id: module.id },
      });
    }

    const screenNames: Array<{ locale: Locale; name: string }> = [
      { locale: en, name: 'Home' },
      { locale: ar, name: 'الرئيسية' },
    ];
    for (const { locale, name } of screenNames) {
      const existing = await screenTranslationRepo.findOne({
        where: { screen: { id: screen.id }, locale: { id: locale.id } },
      });
      if (existing) {
        existing.name = name;
        await screenTranslationRepo.save(existing);
      } else {
        await screenTranslationRepo.save({
          name,
          screen: { id: screen.id },
          locale: { id: locale.id },
        });
      }
    }
  }
}
