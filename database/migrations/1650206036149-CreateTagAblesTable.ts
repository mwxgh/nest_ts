import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm'

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
          {
            name: 'ableId',
            type: 'int',
            isPrimary: true,
          },
          {
            name: 'ableType',
            type: 'enum',
            enum: ['POST', 'PRODUCT'],
          },
        ],
      }),
      true,
    )
    await queryRunner.createIndex(
      'tagAble',
      new TableIndex({
        name: 'IDX_TAG_ID',
        columnNames: ['tagId'],
      }),
    )
    await queryRunner.createIndex(
      'tagAble',
      new TableIndex({
        name: 'IDX_ABLE_ID',
        columnNames: ['ableId'],
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('tagAble')
  }
}
