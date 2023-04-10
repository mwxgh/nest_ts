import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm'
import { baseTimeColumn } from '../abstract/baseColumn'

export class CreateOrderProductsTable1650207970052
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'orderProduct',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'productId',
            type: 'int',
          },
          {
            name: 'orderId',
            type: 'int',
          },
          {
            name: 'quantity',
            type: 'int',
          },
          {
            name: 'amount',
            type: 'int',
          },
          ...baseTimeColumn,
        ],
      }),
      true,
    )
    await queryRunner.createIndex(
      'orderProduct',
      new TableIndex({
        name: 'IDX_PRODUCT_ID',
        columnNames: ['productId'],
      }),
    )
    await queryRunner.createIndex(
      'orderProduct',
      new TableIndex({
        name: 'IDX_ORDER_ID',
        columnNames: ['orderId'],
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('orderProduct')
  }
}
