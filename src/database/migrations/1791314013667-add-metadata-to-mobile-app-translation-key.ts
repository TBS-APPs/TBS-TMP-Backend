import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMetadataToMobileAppTranslationKey1791314013667 implements MigrationInterface {
    name = 'AddMetadataToMobileAppTranslationKey1791314013667'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "mobile_app_translation_key" ADD "metadata" jsonb`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "mobile_app_translation_key" DROP COLUMN "metadata"`);
    }

}
