import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm'
import { baseTimeColumn } from './baseColumn'

export class CreateImageAbleTable1650813488415 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'imageAble',
        columns: [
          {
            name: 'imageId',
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
          {
            name: 'isThumbnail',
            default: false,
            type: 'boolean',
          },
        ],
      }),
      true,
    )
    await queryRunner.createIndex(
      'imageAble',
      new TableIndex({
        name: 'IDX_IMAGE_ID',
        columnNames: ['imageId'],
      }),
    )
    await queryRunner.createIndex(
      'imageAble',
      new TableIndex({
        name: 'IDX_ABLE_ID',
        columnNames: ['ableId'],
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('imageAble')
  }
}
