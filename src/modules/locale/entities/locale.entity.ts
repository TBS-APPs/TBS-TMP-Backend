import { MainEntity } from 'src/modules/main.entity';
import { Column, Entity } from 'typeorm';

@Entity('locale')
export class Locale extends MainEntity {
  @Column({
    nullable: false,
    unique: true,
  })
  code: string;

  @Column({
    nullable: false,
  })
  name: string;

  @Column({
    nullable: false,
    default: false,
  })
  isDefault: boolean;

  @Column({
    nullable: false,
    default: true,
  })
  isActive: boolean;
}
