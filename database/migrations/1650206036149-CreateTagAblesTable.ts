import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm'
import { baseTimeColumn } from './baseColumn'

export class CreateTagAblesTable1650206036149 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'tagAble',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'tagId',
            type: 'int',
          },
          {
            name: 'tagAbleId',
            type: 'int',
          },
          {
            name: 'tagAbleType',
            type: 'enum',
            enum: ['POST', 'PRODUCT'],
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
    await queryRunner.createIndex(
      'tagAble',
      new TableIndex({
        name: 'IDX_TAG_ID',
        columnNames: ['tagId'],
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('tagAble')
  }
}
