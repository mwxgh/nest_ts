import { MigrationInterface, QueryRunner, Table } from 'typeorm'
import { baseTimeColumn } from './baseColumn'

export class CreateCategoriesTable1650206288109 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'category',
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
            name: 'categoryType',
            type: 'varchar',
          },
          {
            name: 'parentId',
            type: 'int',
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['PUBLISH', 'HIDE'],
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('category')
  }
}
