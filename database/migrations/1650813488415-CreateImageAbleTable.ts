import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateImageAbleTable1650813488415 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'imageAbles',
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
            name: 'isThumbnail',
            default: false,
            type: 'boolean',
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
    await queryRunner.createIndex(
      'imageAbles',
      new TableIndex({
        name: 'FK_IMAGE_ABLE_ID',
        columnNames: ['imageAbleId'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('imageAbles');
  }
}
