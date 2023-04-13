import { MigrationInterface, QueryRunner, Table } from 'typeorm'
import { baseTimeColumn } from '../abstract/baseColumn'

export class CreateImagesTable1650207084687 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'image',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'title',
            type: 'varchar',
          },
          {
            name: 'slug',
            type: 'varchar',
          },
          {
            name: 'url',
            type: 'varchar',
          },

          ...baseTimeColumn,
        ],
      }),
      true,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('image')
  }
}
