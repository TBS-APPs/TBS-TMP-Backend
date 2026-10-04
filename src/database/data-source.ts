import { join } from 'path';
import { DataSource } from 'typeorm';
import { Company } from '../modules/company/entities/company.entity';
import DynamicsSetting from '../modules/company/dynamics-settings/entities/dynamics-setting.entity';
import { License } from '../modules/company/license/entities/license.entity';
import Module from '../modules/module/entities/module.entity';
import { MobileAppSetting } from '../modules/mobile-app-settings/entities/mobile-app-setting.entity';
import { User } from '../modules/user/entities/user.entity';
import { Screen } from '../modules/screen/entities/screen.entity';
import { Feature } from 'src/modules/company/feature/entities/feature.entity';

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
    DynamicsSetting,
    License,
    Module,
    MobileAppSetting,
    User,
    Screen,
    Feature,
  ],
  migrations: [join(__dirname, 'migrations', '*.{ts,js}')],
});
