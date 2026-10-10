import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLocaleAndEntityTranslations1791620586592 implements MigrationInterface {
    name = 'AddLocaleAndEntityTranslations1791620586592'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "locale" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "code" character varying NOT NULL, "name" character varying NOT NULL, "isDefault" boolean NOT NULL DEFAULT false, "isActive" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_03f3269461e7b003dca6b1699f4" UNIQUE ("code"), CONSTRAINT "PK_4b7a3ebe8ec48f1bb2c4b80e349" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "screen_translation" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "name" character varying NOT NULL, "screenId" integer NOT NULL, "localeId" integer NOT NULL, CONSTRAINT "UQ_f55e6e53339a933b8b94d556eec" UNIQUE ("screenId", "localeId"), CONSTRAINT "PK_c3a04994e441cf40465321a22ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "module_translation" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "name" character varying NOT NULL, "moduleId" integer NOT NULL, "localeId" integer NOT NULL, CONSTRAINT "UQ_13b177a029954287c26d89a48a4" UNIQUE ("moduleId", "localeId"), CONSTRAINT "PK_b57e5b69d05861e3ba1fddb6cdf" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "feature_translation" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "name" character varying NOT NULL, "featureId" integer NOT NULL, "localeId" integer NOT NULL, CONSTRAINT "UQ_7d389e7c39ddeb95e8aa59229ad" UNIQUE ("featureId", "localeId"), CONSTRAINT "PK_6263bf62cbc52cebf80397cef45" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "company_translation" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "name" character varying NOT NULL, "companyId" integer NOT NULL, "localeId" integer NOT NULL, CONSTRAINT "UQ_5ea8468459475e51a84714fd21d" UNIQUE ("companyId", "localeId"), CONSTRAINT "PK_bcb6d970a47e4f967bf97dfeaa5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "mobile_app_theme_palette_translation" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "name" character varying NOT NULL, "paletteId" integer NOT NULL, "localeId" integer NOT NULL, CONSTRAINT "UQ_2d524cf6a6630b9c24338fa11b6" UNIQUE ("paletteId", "localeId"), CONSTRAINT "PK_d543b02366bb783aef213147769" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "screen_translation" ADD CONSTRAINT "FK_549e922552d040386d12f30860a" FOREIGN KEY ("screenId") REFERENCES "screen"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "screen_translation" ADD CONSTRAINT "FK_89c1f53b4fc86d85fe625ed33b5" FOREIGN KEY ("localeId") REFERENCES "locale"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "module_translation" ADD CONSTRAINT "FK_97b12e1c7e8f5021dbb7493b7e8" FOREIGN KEY ("moduleId") REFERENCES "module"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "module_translation" ADD CONSTRAINT "FK_af458256875dc089d49877dc442" FOREIGN KEY ("localeId") REFERENCES "locale"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "feature_translation" ADD CONSTRAINT "FK_d32f4baeb614cf0c08d00973a53" FOREIGN KEY ("featureId") REFERENCES "feature"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "feature_translation" ADD CONSTRAINT "FK_10187c0e909448310a9fcccc9ac" FOREIGN KEY ("localeId") REFERENCES "locale"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "company_translation" ADD CONSTRAINT "FK_377111cb002e9eda3be301bc201" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "company_translation" ADD CONSTRAINT "FK_feebfa70a9c2f9b56580be8bd0c" FOREIGN KEY ("localeId") REFERENCES "locale"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "mobile_app_theme_palette_translation" ADD CONSTRAINT "FK_265a8f1e6693c9613076df75d3b" FOREIGN KEY ("paletteId") REFERENCES "mobile_app_theme_palette"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "mobile_app_theme_palette_translation" ADD CONSTRAINT "FK_2e8f6c2f0115cdf9339cd1213f1" FOREIGN KEY ("localeId") REFERENCES "locale"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "mobile_app_theme_palette_translation" DROP CONSTRAINT "FK_2e8f6c2f0115cdf9339cd1213f1"`);
        await queryRunner.query(`ALTER TABLE "mobile_app_theme_palette_translation" DROP CONSTRAINT "FK_265a8f1e6693c9613076df75d3b"`);
        await queryRunner.query(`ALTER TABLE "company_translation" DROP CONSTRAINT "FK_feebfa70a9c2f9b56580be8bd0c"`);
        await queryRunner.query(`ALTER TABLE "company_translation" DROP CONSTRAINT "FK_377111cb002e9eda3be301bc201"`);
        await queryRunner.query(`ALTER TABLE "feature_translation" DROP CONSTRAINT "FK_10187c0e909448310a9fcccc9ac"`);
        await queryRunner.query(`ALTER TABLE "feature_translation" DROP CONSTRAINT "FK_d32f4baeb614cf0c08d00973a53"`);
        await queryRunner.query(`ALTER TABLE "module_translation" DROP CONSTRAINT "FK_af458256875dc089d49877dc442"`);
        await queryRunner.query(`ALTER TABLE "module_translation" DROP CONSTRAINT "FK_97b12e1c7e8f5021dbb7493b7e8"`);
        await queryRunner.query(`ALTER TABLE "screen_translation" DROP CONSTRAINT "FK_89c1f53b4fc86d85fe625ed33b5"`);
        await queryRunner.query(`ALTER TABLE "screen_translation" DROP CONSTRAINT "FK_549e922552d040386d12f30860a"`);
        await queryRunner.query(`DROP TABLE "mobile_app_theme_palette_translation"`);
        await queryRunner.query(`DROP TABLE "company_translation"`);
        await queryRunner.query(`DROP TABLE "feature_translation"`);
        await queryRunner.query(`DROP TABLE "module_translation"`);
        await queryRunner.query(`DROP TABLE "screen_translation"`);
        await queryRunner.query(`DROP TABLE "locale"`);
    }

}
