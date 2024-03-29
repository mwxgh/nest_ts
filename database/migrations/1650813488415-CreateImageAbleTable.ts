import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm'

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
            enum: ['PRODUCT', 'POST', 'COMMENT'],
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
        name: 'IDX_IMAGE_ABLE_COMPOSITE',
        columnNames: ['imageId', 'ableId'],
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('imageAble', 'IDX_IMAGE_ABLE_COMPOSITE')
    await queryRunner.dropTable('imageAble')
  }
}
