import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateCategoryAblesTable1650206464855
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'categoryAble',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'categoryId',
            type: 'int',
          },
          {
            name: 'categoryAbleId',
            type: 'int',
          },
          {
            name: 'categoryAbleType',
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
            default: 'now()',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
      true,
    );
    await queryRunner.createIndex(
      'categoryAble',
      new TableIndex({
        name: 'IDX_CATEGORIABLE_ID',
        columnNames: ['categoryId'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('categoryAble');
  }
}
