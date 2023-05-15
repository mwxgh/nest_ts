import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm'
import { baseAbleColumn } from '../abstract/baseColumn'

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

          ...baseAbleColumn,
        ],
      }),
      true,
    )
    await queryRunner.createIndex(
      'categoryAble',
      new TableIndex({
        name: 'IDX_CATEGORY_ABLE_COMPOSITE',
        columnNames: ['categoryId', 'ableId'],
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('categoryAble', 'IDX_CATEGORY_ABLE_COMPOSITE')
    await queryRunner.dropTable('categoryAble')
  }
}
