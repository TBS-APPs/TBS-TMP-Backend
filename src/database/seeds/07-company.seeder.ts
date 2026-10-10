import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { Company } from '../../modules/company/entities/company.entity';
import { CompanyTranslation } from '../../modules/company/entities/company-translation.entity';
import { Feature } from '../../modules/company/feature/entities/feature.entity';
import { FeatureTranslation } from '../../modules/company/feature/entities/feature-translation.entity';
import { License } from '../../modules/company/license/entities/license.entity';
import { Locale } from '../../modules/locale/entities/locale.entity';
import Module from '../../modules/module/entities/module.entity';
import { Status } from '../../resources/enums/status.enum';

export default class CompanySeeder implements Seeder {
  track = false;

  async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    const companyRepo = dataSource.getRepository(Company);
    const companyTranslationRepo =
      dataSource.getRepository(CompanyTranslation);
    const featureRepo = dataSource.getRepository(Feature);
    const featureTranslationRepo =
      dataSource.getRepository(FeatureTranslation);
    const licenseRepo = dataSource.getRepository(License);
    const localeRepo = dataSource.getRepository(Locale);
    const moduleRepo = dataSource.getRepository(Module);

    const locales = await localeRepo.find();
    const en = locales.find((l) => l.code === 'en');
    const ar = locales.find((l) => l.code === 'ar');
    if (!en || !ar) {
      throw new Error('Locale seeder must run before company (en/ar missing).');
    }

    const module = await moduleRepo.findOne({ where: { alias: 'crm' } });
    if (!module) {
      throw new Error('Module seeder must run before company (crm missing).');
    }

    const companyFactory = factoryManager.get(Company);

    let company = await companyRepo.findOne({ where: { alias: 'demo' } });
    if (!company) {
      company = await companyFactory
        .setMeta({ alias: 'demo', status: Status.ACTIVE })
        .save();
    } else if (company.status !== Status.ACTIVE) {
      company.status = Status.ACTIVE;
      await companyRepo.save(company);
    }

    const companyNames: Array<{ locale: Locale; name: string }> = [
      { locale: en, name: 'Demo Company' },
      { locale: ar, name: 'شركة تجريبية' },
    ];
    for (const { locale, name } of companyNames) {
      const existing = await companyTranslationRepo.findOne({
        where: { company: { id: company.id }, locale: { id: locale.id } },
      });
      if (existing) {
        existing.name = name;
        await companyTranslationRepo.save(existing);
      } else {
        await companyTranslationRepo.save({
          name,
          company: { id: company.id },
          locale: { id: locale.id },
        });
      }
    }

    let feature = await featureRepo.findOne({
      where: { company: { id: company.id } },
      relations: { translations: { locale: true }, company: true },
    });
    if (!feature) {
      feature = await featureRepo.save({
        company: { id: company.id },
      });
    }

    const featureNames: Array<{ locale: Locale; name: string }> = [
      { locale: en, name: 'Core Access' },
      { locale: ar, name: 'الوصول الأساسي' },
    ];
    for (const { locale, name } of featureNames) {
      const existing = await featureTranslationRepo.findOne({
        where: { feature: { id: feature.id }, locale: { id: locale.id } },
      });
      if (existing) {
        existing.name = name;
        await featureTranslationRepo.save(existing);
      } else {
        await featureTranslationRepo.save({
          name,
          feature: { id: feature.id },
          locale: { id: locale.id },
        });
      }
    }

    const existingLicense = await licenseRepo.findOne({
      where: {
        company: { id: company.id },
        module: { id: module.id },
      },
    });

    const startDate = new Date('2026-01-01T00:00:00.000Z');
    const expirationDate = new Date('2027-12-31T23:59:59.000Z');

    if (existingLicense) {
      existingLicense.seatsLimit = 50;
      existingLicense.startDate = startDate;
      existingLicense.expirationDate = expirationDate;
      existingLicense.status = Status.ACTIVE;
      await licenseRepo.save(existingLicense);
    } else {
      await licenseRepo.save({
        seatsLimit: 50,
        startDate,
        expirationDate,
        status: Status.ACTIVE,
        company: { id: company.id },
        module: { id: module.id },
      });
    }
  }
}
