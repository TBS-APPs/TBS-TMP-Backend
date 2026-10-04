import { MigrationInterface, QueryRunner } from "typeorm";

export class AddScreenTable1791144788633 implements MigrationInterface {
    name = 'AddScreenTable1791144788633'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "screen" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "name" character varying, "apiId" integer, "moduleId" integer, CONSTRAINT "PK_7d30806a7556636b84d24e75f4d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "screen" ADD CONSTRAINT "FK_bfa3d05ce2c8eed3d1b2d3164ff" FOREIGN KEY ("moduleId") REFERENCES "module"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "screen" DROP CONSTRAINT "FK_bfa3d05ce2c8eed3d1b2d3164ff"`);
        await queryRunner.query(`DROP TABLE "screen"`);
    }

}
