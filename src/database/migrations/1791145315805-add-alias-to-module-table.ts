import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAliasToModuleTable1791145315805 implements MigrationInterface {
    name = 'AddAliasToModuleTable1791145315805'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "module" ADD "alias" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "module" ADD CONSTRAINT "UQ_0be1081995740b75bbb01d27355" UNIQUE ("alias")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "module" DROP CONSTRAINT "UQ_0be1081995740b75bbb01d27355"`);
        await queryRunner.query(`ALTER TABLE "module" DROP COLUMN "alias"`);
    }

}
