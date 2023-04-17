import { MigrationInterface, QueryRunner, Table } from 'typeorm'
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
          {
            name: 'releaseDate',
            isNullable: true,
            type: 'timestamp',
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
