import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm'

export class CreateCartItemsTable1650208769595 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'cartItems',
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
            name: 'cartId',
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
            default: 'now()',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
      true,
    )
    await queryRunner.createIndex(
      'cartItems',
      new TableIndex({
        name: 'IDX_CART_ITEM_PROD',
        columnNames: ['productId'],
      }),
    )
    await queryRunner.createIndex(
      'cartItems',
      new TableIndex({
        name: 'IDX_CART_ITEM_CART',
        columnNames: ['cartId'],
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('cartItems')
  }
}
