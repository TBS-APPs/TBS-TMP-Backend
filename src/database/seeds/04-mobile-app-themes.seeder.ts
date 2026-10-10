import { DataSource, In } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { Locale } from '../../modules/locale/entities/locale.entity';
import { MobileAppThemePalette } from '../../modules/mobile-app-themes/entities/mobile-app-theme-palette.entity';
import { MobileAppThemePaletteTranslation } from '../../modules/mobile-app-themes/entities/mobile-app-theme-palette-translation.entity';
import { SEED_PALETTES } from '../seed-data/theme-palettes';

export default class MobileAppThemesSeeder implements Seeder {
  track = false;

  async run(
    dataSource: DataSource,
    _factoryManager: SeederFactoryManager,
  ): Promise<void> {
    const paletteRepo = dataSource.getRepository(MobileAppThemePalette);
    const translationRepo = dataSource.getRepository(
      MobileAppThemePaletteTranslation,
    );
    const localeRepo = dataSource.getRepository(Locale);

    const locales = await localeRepo.find({
      where: { code: In(['en', 'ar']) },
    });
    if (!locales.length) {
      throw new Error(
        'Locale seeder must run before theme palettes (en/ar missing).',
      );
    }

    for (const seed of SEED_PALETTES) {
      const { label, ...payload } = seed;
      let palette = await paletteRepo.findOne({ where: { code: seed.code } });

      if (!palette) {
        if (payload.isDefault) {
          await paletteRepo
            .createQueryBuilder()
            .update(MobileAppThemePalette)
            .set({ isDefault: false })
            .where('isDefault = :isDefault', { isDefault: true })
            .execute();
        }
        palette = await paletteRepo.save(payload);
      } else {
        Object.assign(palette, payload);
        await paletteRepo.save(palette);
      }

      for (const locale of locales) {
        const existing = await translationRepo.findOne({
          where: {
            palette: { id: palette.id },
            locale: { id: locale.id },
          },
        });
        if (existing) {
          if (existing.name !== label) {
            existing.name = label;
            await translationRepo.save(existing);
          }
        } else {
          await translationRepo.save({
            name: label,
            palette: { id: palette.id },
            locale: { id: locale.id },
          });
        }
      }
    }
  }
}
