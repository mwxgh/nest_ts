import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreatePostsTable1650206721948 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'posts',
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
            default: "''",
          },
          {
            name: 'slug',
            type: 'varchar',
            default: "''",
          },
          {
            name: 'summary',
            type: 'varchar',
            default: "''",
          },
          {
            name: 'description',
            type: 'varchar',
            default: "''",
          },
          {
            name: 'content',
            type: 'varchar',
            default: "''",
          },
          {
            name: 'status',
            type: 'varchar',
          },
          {
            name: 'priority',
            type: 'varchar',
          },
          {
            name: 'type',
            default: "''",
            type: 'varchar',
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
    await queryRunner.dropTable('posts');
  }
}
