import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMobileAppThemePaletteTable1791390918522 implements MigrationInterface {
    name = 'AddMobileAppThemePaletteTable1791390918522'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "mobile_app_theme_palette" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "code" character varying NOT NULL, "name" character varying NOT NULL, "isDefault" boolean NOT NULL DEFAULT false, "isActive" boolean NOT NULL DEFAULT true, "sortOrder" integer NOT NULL DEFAULT '0', "primary" character varying NOT NULL, "secondary" character varying NOT NULL, "tertiary" character varying NOT NULL, "tokens" jsonb, CONSTRAINT "UQ_c31d219be8e2001ed6b461c8da9" UNIQUE ("code"), CONSTRAINT "PK_156efc7ecccbc9f0e321eee27d0" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "mobile_app_theme_palette"`);
    }

}
