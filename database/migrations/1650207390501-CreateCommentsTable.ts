import { MigrationInterface, QueryRunner, Table } from 'typeorm'
import { baseTimeColumn } from './baseColumn'

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
    await queryRunner.dropTable('comment')
  }
}
