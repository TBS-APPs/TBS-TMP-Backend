import { join } from 'path';
import { DataSource } from 'typeorm';
import { Company } from '../modules/company/entities/company.entity';
import { CompanyTranslation } from '../modules/company/entities/company-translation.entity';
import DynamicsSetting from '../modules/company/dynamics-settings/entities/dynamics-setting.entity';
import { License } from '../modules/company/license/entities/license.entity';
import { Feature } from '../modules/company/feature/entities/feature.entity';
import { FeatureTranslation } from '../modules/company/feature/entities/feature-translation.entity';
import Module from '../modules/module/entities/module.entity';
import { ModuleTranslation } from '../modules/module/entities/module-translation.entity';
import { MobileAppSetting } from '../modules/mobile-app-settings/entities/mobile-app-setting.entity';
import { MobileAppThemePalette } from '../modules/mobile-app-themes/entities/mobile-app-theme-palette.entity';
import { MobileAppThemePaletteTranslation } from '../modules/mobile-app-themes/entities/mobile-app-theme-palette-translation.entity';
import { MobileAppLocale } from '../modules/mobile-app-translation/entities/mobile-app-locale.entity';
import { MobileAppTranslationKey } from '../modules/mobile-app-translation/entities/mobile-app-translation-key.entity';
import { MobileAppTranslation } from '../modules/mobile-app-translation/entities/mobile-app-translation.entity';
import { Locale } from '../modules/locale/entities/locale.entity';
import { User } from '../modules/user/entities/user.entity';
import { Screen } from '../modules/screen/entities/screen.entity';
import { ScreenTranslation } from '../modules/screen/entities/screen-translation.entity';

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT ?? '5432', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  logging: true,
  entities: [
    Company,
    CompanyTranslation,
    DynamicsSetting,
    License,
    Module,
    ModuleTranslation,
    MobileAppSetting,
    MobileAppThemePalette,
    MobileAppThemePaletteTranslation,
    MobileAppLocale,
    MobileAppTranslationKey,
    MobileAppTranslation,
    Locale,
    User,
    Screen,
    ScreenTranslation,
    Feature,
    FeatureTranslation,
  ],
  migrations: [join(__dirname, 'migrations', '*.{ts,js}')],
});
