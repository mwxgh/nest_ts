import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm'
import { baseTimeColumn } from '../abstract/baseColumn'

export class CreatePermissionsTable1650203910371 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'permission',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'slug',
            type: 'varchar',
          },

          ...baseTimeColumn,
        ],
      }),
      true,
    )
    await queryRunner.createIndex(
      'permission',
      new TableIndex({
        name: 'IDX_PERMISSION_SLUG',
        columnNames: ['slug'],
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('permission', 'IDX_PERMISSION_SLUG')
    await queryRunner.dropTable('permission')
  }
}
