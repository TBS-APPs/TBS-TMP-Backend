import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyModule } from './modules/company/company.module';
import { ModuleModule } from './modules/module/module.module';
import { TransformInterceptor } from './core/utils/transform/transform.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AcceptLanguageResolver, I18nModule } from 'nestjs-i18n';
import { join } from 'path';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { LocaleModule } from './modules/locale/locale.module';
import { MobileAppSettingsModule } from './modules/mobile-app-settings/mobile-app-settings.module';
import { MobileAppThemesModule } from './modules/mobile-app-themes/mobile-app-themes.module';
import { MobileAppTranslationModule } from './modules/mobile-app-translation/mobile-app-translation.module';
import { ScreenModule } from './modules/screen/screen.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT!),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: process.env.SYNC_DATABASE === 'true' ? true : false,
      autoLoadEntities: true,
      logger: 'advanced-console',
      logging: true,
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: join(__dirname, 'i18n'),
        watch: true,
        includeSubfolders: true,
      },
      resolvers: [AcceptLanguageResolver],
    }),
    LocaleModule,
    CompanyModule,
    ModuleModule,
    UserModule,
    AuthModule,
    MobileAppSettingsModule,
    MobileAppThemesModule,
    MobileAppTranslationModule,
    ScreenModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule {}
