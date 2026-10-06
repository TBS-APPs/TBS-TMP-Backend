import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMobileAppTranslationTables1791145871721 implements MigrationInterface {
    name = 'AddMobileAppTranslationTables1791145871721'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "mobile_app_translation_key" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "key" character varying NOT NULL, "description" text, CONSTRAINT "UQ_2b1c16f15abca80310ef4046a0c" UNIQUE ("key"), CONSTRAINT "PK_809bb9df190cbc33faf6acdb925" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "mobile_app_translation" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "value" text NOT NULL, "translationKeyId" integer, "localeId" integer, CONSTRAINT "UQ_8781c4613cb3e2f8e8792eb9069" UNIQUE ("translationKeyId", "localeId"), CONSTRAINT "PK_14800b3fbcdf41340dafe641907" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "mobile_app_locale" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "code" character varying NOT NULL, "name" character varying NOT NULL, "isDefault" boolean NOT NULL DEFAULT false, "isActive" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_99f1793e77995a41e0d95dfa5da" UNIQUE ("code"), CONSTRAINT "PK_05a092692e82961a74f2ebfed20" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "mobile_app_translation" ADD CONSTRAINT "FK_f8064d4352edde82ae118cbbdef" FOREIGN KEY ("translationKeyId") REFERENCES "mobile_app_translation_key"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "mobile_app_translation" ADD CONSTRAINT "FK_2c2555a9a81d3a45c90aee05da3" FOREIGN KEY ("localeId") REFERENCES "mobile_app_locale"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "mobile_app_translation" DROP CONSTRAINT "FK_2c2555a9a81d3a45c90aee05da3"`);
        await queryRunner.query(`ALTER TABLE "mobile_app_translation" DROP CONSTRAINT "FK_f8064d4352edde82ae118cbbdef"`);
        await queryRunner.query(`DROP TABLE "mobile_app_locale"`);
        await queryRunner.query(`DROP TABLE "mobile_app_translation"`);
        await queryRunner.query(`DROP TABLE "mobile_app_translation_key"`);
    }

}
