import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateProductsTable1650204918437 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'products',
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
            default: 1,
            type: 'int',
          },
          {
            name: 'originalPrice',
            default: 1,
            type: 'int',
          },
          {
            name: 'price',
            default: 1,
            type: 'int',
          },
          {
            name: 'quantity',
            default: 1,
            type: 'int',
          },
          {
            name: 'verifiedAt',
            isNullable: true,
            type: 'datetime',
          },
          {
            name: 'deletedAt',
            isNullable: true,
            type: 'datetime',
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('products');
  }
}
