import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm'
import { baseTimeColumn } from './baseColumn'

export class CreateCartItemsTable1650208769595 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'cartItem',
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
          ...baseTimeColumn,
        ],
      }),
      true,
    )
    await queryRunner.createIndex(
      'cartItem',
      new TableIndex({
        name: 'IDX_CART_ITEM_PROD',
        columnNames: ['productId'],
      }),
    )
    await queryRunner.createIndex(
      'cartItem',
      new TableIndex({
        name: 'IDX_CART_ITEM_CART',
        columnNames: ['cartId'],
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('cartItem')
  }
}
