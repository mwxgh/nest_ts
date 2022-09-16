import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateCommentsTable1650207390501 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'comments',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'email',
            type: 'varchar',
          },
          {
            name: 'fullName',
            type: 'varchar',
          },
          {
            name: 'contacts',
            type: 'varchar',
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['PENDING', 'FORWARD', 'PUBLISH', 'HIDE'],
          },
          {
            name: 'commentAbleId',
            type: 'int',
          },
          {
            name: 'commentAbleType',
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('comments');
  }
}
