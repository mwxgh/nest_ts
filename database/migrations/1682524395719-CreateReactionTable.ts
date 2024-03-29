import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm'

export class CreateReactionTable1682524395719 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'reaction',
        columns: [
          {
            name: 'userId',
            type: 'int',
            isPrimary: true,
          },
          {
            name: 'ableId',
            type: 'int',
            isPrimary: true,
          },
          {
            name: 'ableType',
            type: 'enum',
            enum: ['COMMENT', 'POST'],
          },
          {
            name: 'reaction',
            type: 'enum',
            enum: ['LIKE', 'CARE', 'LOVE', 'HAHA', 'WOW', 'SAD', 'ANGRY'],
          },
        ],
      }),
      true,
    )
    await queryRunner.createIndex(
      'reaction',
      new TableIndex({
        name: 'IDX_REACTION_COMPOSITE',
        columnNames: ['userId', 'ableId'],
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('reaction', 'IDX_REACTION_COMPOSITE')
    await queryRunner.dropTable('reaction')
  }
}
