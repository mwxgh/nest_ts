import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm'
import { baseAbleColumn } from '../abstract/baseColumn'

export class CreateTagAblesTable1650206036149 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'tagAble',
        columns: [
          {
            name: 'tagId',
            type: 'int',
            isPrimary: true,
          },

          ...baseAbleColumn,
        ],
      }),
      true,
    )
    await queryRunner.createIndex(
      'tagAble',
      new TableIndex({
        name: 'IDX_TAG_ABLE_COMPOSITE',
        columnNames: ['tagId', 'ableId'],
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('tagAble', 'IDX_TAG_ABLE_COMPOSITE')
    await queryRunner.dropTable('tagAble')
  }
}
