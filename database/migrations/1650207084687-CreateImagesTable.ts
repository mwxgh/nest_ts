import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateImagesTable1650207084687 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'images',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'url',
            type: 'varchar',
          },
          {
            name: 'imageAbleId',
            type: 'int',
          },
          {
            name: 'imageAbleType',
            type: 'varchar',
          },
          {
            name: 'isThumbnail',
            default: 0,
            type: 'int',
          },
          {
            name: 'status',
            default: 1,
            type: 'int',
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
      'images',
      new TableIndex({
        name: 'FK_IMAGE_ID',
        columnNames: ['imageAbleId'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('images');
  }
}
