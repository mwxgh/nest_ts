import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm'
import { baseTimeColumn } from './baseColumn'

export class CreateImageAbleTable1650813488415 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'imageAble',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'imageId',
            type: 'int',
          },
          {
            name: 'imageAbleId',
            type: 'int',
          },
          {
            name: 'imageAbleType',
            type: 'enum',
            enum: ['PRODUCT', 'POST'],
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['PUBLISH', 'HIDE'],
          },
          {
            name: 'isThumbnail',
            default: false,
            type: 'boolean',
          },
          ...baseTimeColumn,
        ],
      }),
      true,
    )
    await queryRunner.createIndex(
      'imageAble',
      new TableIndex({
        name: 'FK_IMAGE_ABLE_ID',
        columnNames: ['imageAbleId'],
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('imageAble')
  }
}
