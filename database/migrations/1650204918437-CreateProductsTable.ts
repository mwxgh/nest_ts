import { MigrationInterface, QueryRunner, Table } from 'typeorm'
import { baseTimeColumn } from '../abstract/baseColumn'

export class CreateProductsTable1650204918437 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'product',
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
            name: 'sku',
            type: 'varchar',
            default: "''",
          },
          {
            name: 'slug',
            type: 'varchar',
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['INVENTORY', 'OUT_OF_STOCK', 'HIDE'],
          },
          {
            name: 'originalPrice',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'price',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'quantity',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'verifiedAt',
            isNullable: true,
            type: 'datetime',
          },
          ...baseTimeColumn,
        ],
      }),
      true,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('product')
  }
}
