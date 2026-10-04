import { MainEntity } from 'src/modules/main.entity';
import Module from 'src/modules/module/entities/module.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class Screen extends MainEntity {
  @Column({
    nullable: true,
  })
  name?: string;

  @Column({
    nullable: true,
  })
  apiId?: number;

  @ManyToOne(() => Module, (module) => module.screens)
  module: Module;
}
