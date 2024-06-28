import { MigrationInterface, QueryRunner } from 'typeorm'

export class Mig1700199870000 implements MigrationInterface {
    name = 'Mig1700199870000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`SET search_path TO main, public`)
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`)
        await queryRunner.query(`
            CREATE OR REPLACE FUNCTION main.uuid_generate_v4()
            RETURNS uuid AS '$libdir/uuid-ossp', 'uuid_generate_v4'
            LANGUAGE C VOLATILE STRICT;
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP FUNCTION IF EXISTS main.uuid_generate_v4()`)
        await queryRunner.query(`DROP EXTENSION IF EXISTS "uuid-ossp"`)
    }
}
