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
