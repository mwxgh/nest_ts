import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm'
import { baseTimeColumn } from '../abstract/baseColumn'

export class CreateCommentsTable1650207390501 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'comment',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'userId',
            type: 'int',
          },
          {
            name: 'postId',
            type: 'int',
          },
          {
            name: 'content',
            type: 'varchar',
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['PENDING', 'FORWARD', 'PUBLISH', 'HIDE'],
          },
          {
            name: 'parentId',
            type: 'int',
            isNullable: true,
          },

          ...baseTimeColumn,
        ],
      }),
      true,
    )
    await queryRunner.createIndex(
      'comment',
      new TableIndex({
        name: 'IDX_COMMENT_USER_ID',
        columnNames: ['userId'],
      }),
    )
    await queryRunner.createIndex(
      'comment',
      new TableIndex({
        name: 'IDX_COMMENT_POST_ID',
        columnNames: ['postId'],
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('comment', 'IDX_COMMENT_USER_ID')
    await queryRunner.dropIndex('comment', 'IDX_COMMENT_POST_ID')
    await queryRunner.dropTable('comment')
  }
}
