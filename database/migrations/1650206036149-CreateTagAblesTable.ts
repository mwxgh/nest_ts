import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateTagAblesTable1650206036149 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'tagAbles',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'status',
            type: 'int',
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
            type: 'varchar',
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
      'tagAbles',
      new TableIndex({
        name: 'IDX_TAG_ID',
        columnNames: ['tagId'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('tagAbles');
  }
}
