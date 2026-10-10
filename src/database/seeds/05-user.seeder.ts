import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { User } from '../../modules/user/entities/user.entity';
import { UserStatus } from '../../modules/user/user-status.enum';

export default class UserSeeder implements Seeder {
  track = false;

  async run(
    dataSource: DataSource,
    _factoryManager: SeederFactoryManager,
  ): Promise<void> {
    const email =
      process.env.SEED_ADMIN_EMAIL?.trim() || 'admin@example.com';
    const password =
      process.env.SEED_ADMIN_PASSWORD?.trim() || 'ChangeMe123!';
    const name = process.env.SEED_ADMIN_NAME?.trim() || 'Admin';
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS ?? '10', 10);

    const repo = dataSource.getRepository(User);
    const hashed = await bcrypt.hash(password, saltRounds);

    const existing = await repo.findOne({ where: { email } });
    if (existing) {
      existing.name = name;
      existing.password = hashed;
      existing.status = UserStatus.ACTIVE;
      await repo.save(existing);
      console.log(`Updated admin user: ${email}`);
      return;
    }

    await repo.save({
      email,
      name,
      password: hashed,
      status: UserStatus.ACTIVE,
    });
    console.log(`Created admin user: ${email}`);
  }
}
