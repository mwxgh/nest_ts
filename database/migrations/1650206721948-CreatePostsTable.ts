import { MigrationInterface, QueryRunner, Table } from 'typeorm'
import { baseTimeColumn } from '../abstract/baseColumn'

export class CreatePostsTable1650206721948 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'post',
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
            isNullable: false,
          },
          {
            name: 'slug',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'summary',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'description',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'content',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['DRAFT', 'PENDING', 'PUBLISH', 'HIDE'],
          },
          {
            name: 'priority',
            type: 'enum',
            enum: ['HIGHEST', 'HIGH', 'MEDIUM', 'LOW'],
          },
          {
            name: 'type',
            type: 'enum',
            enum: ['GALLERY', 'SIDEBAR', 'CONTENT'],
          },
          {
            name: 'privacy',
            type: 'enum',
            enum: ['PUBLIC', 'SYSTEM', 'PROTECTED', 'PRIVATE'],
          },
          {
            name: 'releaseDate',
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
    await queryRunner.dropTable('post')
  }
}
