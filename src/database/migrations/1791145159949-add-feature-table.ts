import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFeatureTable1791145159949 implements MigrationInterface {
    name = 'AddFeatureTable1791145159949'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "feature" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "name" character varying NOT NULL, "companyId" integer, CONSTRAINT "UQ_5ba5b6621380d0c63d18acd6c24" UNIQUE ("name", "companyId"), CONSTRAINT "PK_03930932f909ca4be8e33d16a2d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "feature" ADD CONSTRAINT "FK_7ce4fc6fad19e4a71be12ee086c" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "feature" DROP CONSTRAINT "FK_7ce4fc6fad19e4a71be12ee086c"`);
        await queryRunner.query(`DROP TABLE "feature"`);
    }

}
