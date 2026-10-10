import { faker } from '@faker-js/faker';
import { setSeederFactory } from 'typeorm-extension';
import { Company } from '../../modules/company/entities/company.entity';
import { Status } from '../../resources/enums/status.enum';

export type CompanyFactoryMeta = {
  alias?: string;
  status?: Status;
};

export default setSeederFactory(
  Company,
  (meta?: CompanyFactoryMeta) => {
    const company = new Company();
    const slug = faker.helpers
      .slugify(faker.company.name())
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '')
      .slice(0, 24);

    company.alias =
      meta?.alias ?? `${slug || 'company'}-${faker.string.alphanumeric(6).toLowerCase()}`;
    company.status = meta?.status ?? Status.ACTIVE;

    return company;
  },
);
