import { MigrationInterface, QueryRunner } from 'typeorm';

export class DropFallbackNameColumns1791621000000 implements MigrationInterface {
  name = 'DropFallbackNameColumns1791621000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO "locale" ("code", "name", "isDefault", "isActive")
      SELECT 'en', 'English', true, true
      WHERE NOT EXISTS (SELECT 1 FROM "locale" WHERE "code" = 'en' AND "deletedAt" IS NULL)
    `);
    await queryRunner.query(`
      INSERT INTO "locale" ("code", "name", "isDefault", "isActive")
      SELECT 'ar', 'Arabic', false, true
      WHERE NOT EXISTS (SELECT 1 FROM "locale" WHERE "code" = 'ar' AND "deletedAt" IS NULL)
    `);

    await queryRunner.query(`
      INSERT INTO "company_translation" ("name", "companyId", "localeId")
      SELECT c."name", c."id", l."id"
      FROM "company" c
      CROSS JOIN "locale" l
      WHERE l."isDefault" = true
        AND l."deletedAt" IS NULL
        AND c."deletedAt" IS NULL
        AND c."name" IS NOT NULL
        AND NOT EXISTS (
          SELECT 1 FROM "company_translation" ct
          WHERE ct."companyId" = c."id" AND ct."localeId" = l."id" AND ct."deletedAt" IS NULL
        )
    `);

    await queryRunner.query(`
      INSERT INTO "module_translation" ("name", "moduleId", "localeId")
      SELECT m."name", m."id", l."id"
      FROM "module" m
      CROSS JOIN "locale" l
      WHERE l."isDefault" = true
        AND l."deletedAt" IS NULL
        AND m."deletedAt" IS NULL
        AND m."name" IS NOT NULL
        AND NOT EXISTS (
          SELECT 1 FROM "module_translation" mt
          WHERE mt."moduleId" = m."id" AND mt."localeId" = l."id" AND mt."deletedAt" IS NULL
        )
    `);

    await queryRunner.query(`
      INSERT INTO "feature_translation" ("name", "featureId", "localeId")
      SELECT f."name", f."id", l."id"
      FROM "feature" f
      CROSS JOIN "locale" l
      WHERE l."isDefault" = true
        AND l."deletedAt" IS NULL
        AND f."deletedAt" IS NULL
        AND f."name" IS NOT NULL
        AND NOT EXISTS (
          SELECT 1 FROM "feature_translation" ft
          WHERE ft."featureId" = f."id" AND ft."localeId" = l."id" AND ft."deletedAt" IS NULL
        )
    `);

    await queryRunner.query(`
      INSERT INTO "screen_translation" ("name", "screenId", "localeId")
      SELECT s."name", s."id", l."id"
      FROM "screen" s
      CROSS JOIN "locale" l
      WHERE l."isDefault" = true
        AND l."deletedAt" IS NULL
        AND s."deletedAt" IS NULL
        AND s."name" IS NOT NULL
        AND NOT EXISTS (
          SELECT 1 FROM "screen_translation" st
          WHERE st."screenId" = s."id" AND st."localeId" = l."id" AND st."deletedAt" IS NULL
        )
    `);

    await queryRunner.query(`
      INSERT INTO "mobile_app_theme_palette_translation" ("name", "paletteId", "localeId")
      SELECT p."name", p."id", l."id"
      FROM "mobile_app_theme_palette" p
      CROSS JOIN "locale" l
      WHERE l."code" IN ('en', 'ar')
        AND l."deletedAt" IS NULL
        AND p."deletedAt" IS NULL
        AND p."name" IS NOT NULL
        AND NOT EXISTS (
          SELECT 1 FROM "mobile_app_theme_palette_translation" pt
          WHERE pt."paletteId" = p."id" AND pt."localeId" = l."id" AND pt."deletedAt" IS NULL
        )
    `);

    await queryRunner.query(
      `ALTER TABLE "feature" DROP CONSTRAINT "UQ_5ba5b6621380d0c63d18acd6c24"`,
    );

    await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "name"`);
    await queryRunner.query(`ALTER TABLE "module" DROP COLUMN "name"`);
    await queryRunner.query(`ALTER TABLE "feature" DROP COLUMN "name"`);
    await queryRunner.query(`ALTER TABLE "screen" DROP COLUMN "name"`);
    await queryRunner.query(
      `ALTER TABLE "mobile_app_theme_palette" DROP COLUMN "name"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "mobile_app_theme_palette" ADD "name" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "screen" ADD "name" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "feature" ADD "name" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "module" ADD "name" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "company" ADD "name" character varying`,
    );

    await queryRunner.query(`
      UPDATE "company" c
      SET "name" = ct."name"
      FROM "company_translation" ct
      INNER JOIN "locale" l ON l."id" = ct."localeId"
      WHERE ct."companyId" = c."id" AND l."isDefault" = true AND ct."deletedAt" IS NULL
    `);
    await queryRunner.query(`
      UPDATE "module" m
      SET "name" = mt."name"
      FROM "module_translation" mt
      INNER JOIN "locale" l ON l."id" = mt."localeId"
      WHERE mt."moduleId" = m."id" AND l."isDefault" = true AND mt."deletedAt" IS NULL
    `);
    await queryRunner.query(`
      UPDATE "feature" f
      SET "name" = ft."name"
      FROM "feature_translation" ft
      INNER JOIN "locale" l ON l."id" = ft."localeId"
      WHERE ft."featureId" = f."id" AND l."isDefault" = true AND ft."deletedAt" IS NULL
    `);
    await queryRunner.query(`
      UPDATE "screen" s
      SET "name" = st."name"
      FROM "screen_translation" st
      INNER JOIN "locale" l ON l."id" = st."localeId"
      WHERE st."screenId" = s."id" AND l."isDefault" = true AND st."deletedAt" IS NULL
    `);
    await queryRunner.query(`
      UPDATE "mobile_app_theme_palette" p
      SET "name" = pt."name"
      FROM "mobile_app_theme_palette_translation" pt
      INNER JOIN "locale" l ON l."id" = pt."localeId"
      WHERE pt."paletteId" = p."id" AND l."isDefault" = true AND pt."deletedAt" IS NULL
    `);

    await queryRunner.query(
      `ALTER TABLE "company" ALTER COLUMN "name" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "module" ALTER COLUMN "name" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "feature" ALTER COLUMN "name" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "mobile_app_theme_palette" ALTER COLUMN "name" SET NOT NULL`,
    );

    await queryRunner.query(
      `ALTER TABLE "feature" ADD CONSTRAINT "UQ_5ba5b6621380d0c63d18acd6c24" UNIQUE ("name", "companyId")`,
    );
  }
}
