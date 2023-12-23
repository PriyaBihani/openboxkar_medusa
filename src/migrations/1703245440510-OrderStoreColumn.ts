import { MigrationInterface, QueryRunner } from "typeorm";

export class OrderStoreColumn1703245440510 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE public."order" ADD COLUMN IF NOT EXISTS "store_id" text`
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "OrderStoreId" ON public."order" ("store_id") `
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE public."order" DROP COLUMN "store_id"`
    );
    await queryRunner.query(`DROP INDEX IF EXISTS "OrderStoreId"`);
  }
}
