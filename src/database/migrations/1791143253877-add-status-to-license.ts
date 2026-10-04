import { MigrationInterface, QueryRunner } from "typeorm";

export class AddStatusToLicense1791143253877 implements MigrationInterface {
    name = 'AddStatusToLicense1791143253877'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "license" ADD "status" "public"."license_status_enum" NOT NULL DEFAULT 'active'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "license" DROP COLUMN "status"`);
    }

}
