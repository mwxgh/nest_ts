import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm'

export class CreateCategoryAblesTable1650206464855
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'categoryAble',
        columns: [
          {
            name: 'categoryId',
            type: 'int',
            isPrimary: true,
          },
          {
            name: 'ableId',
            type: 'int',
            isPrimary: true,
          },
          {
            name: 'ableType',
            type: 'enum',
            enum: ['PRODUCT', 'POST'],
          },
        ],
      }),
      true,
    )
    await queryRunner.createIndex(
      'categoryAble',
      new TableIndex({
        name: 'IDX_CATEGORY_ID',
        columnNames: ['categoryId'],
      }),
    )
    await queryRunner.createIndex(
      'categoryAble',
      new TableIndex({
        name: 'IDX_ABLE_ID',
        columnNames: ['ableId'],
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('categoryAble')
  }
}
