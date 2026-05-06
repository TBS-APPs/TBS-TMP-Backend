import { IsNotEmpty } from 'class-validator';

export class CreateCompanyDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  alias: string;
}

// @PrimaryGeneratedColumn()
// id: number;

// @Column({
//   nullable: false,
// })
// name: string;

// @Column({
//   nullable: false,
//   unique: true,
// })
// alias: string;
