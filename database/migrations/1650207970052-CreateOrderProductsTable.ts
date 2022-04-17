import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateOrderProductsTable1650207970052
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'orderProducts',
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
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'NOW()',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'NOW()',
          },
        ],
      }),
      true,
    );
    await queryRunner.createIndex(
      'orderProducts',
      new TableIndex({
        name: 'IDX_PRODUCT_ID',
        columnNames: ['productId'],
      }),
    );
    await queryRunner.createIndex(
      'orderProducts',
      new TableIndex({
        name: 'IDX_ORDER_ID',
        columnNames: ['orderId'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('orderProducts');
  }
}
