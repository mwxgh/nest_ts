import { MigrationInterface, QueryRunner, Table } from 'typeorm'
import { baseTimeColumn } from '../abstract/baseColumn'

export class CreateOrdersTable1650207746440 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'order',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'fullName',
            type: 'varchar',
            default: "''",
          },
          {
            name: 'email',
            type: 'varchar',
            default: "''",
          },
          {
            name: 'phone',
            type: 'varchar',
          },
          {
            name: 'address',
            type: 'varchar',
            default: "''",
          },
          {
            name: 'note',
            type: 'varchar',
            default: "''",
          },
          {
            name: 'amount',
            type: 'int',
          },
          {
            name: 'status',
            default: 1,
            type: 'int',
          },
          ...baseTimeColumn,
        ],
      }),
      true,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('order')
  }
}
