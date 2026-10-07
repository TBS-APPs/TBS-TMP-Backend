import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveTokensFromMobileThemes1791391550796 implements MigrationInterface {
    name = 'RemoveTokensFromMobileThemes1791391550796'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "mobile_app_theme_palette" DROP COLUMN "tokens"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "mobile_app_theme_palette" ADD "tokens" jsonb`);
    }

}
