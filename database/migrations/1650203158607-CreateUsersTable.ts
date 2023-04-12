import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm'
import { baseTimeColumn } from '../abstract/baseColumn'

export class CreateUsersTable1650203158607 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user',
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
            isUnique: true,
          },
          {
            name: 'username',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'password',
            type: 'varchar',
          },
          {
            name: 'firstName',
            default: "''",
            type: 'varchar',
          },
          {
            name: 'lastName',
            default: "''",
            type: 'varchar',
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['ACTIVE', 'INACTIVE'],
          },
          {
            name: 'socketId',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'refreshToken',
            isNullable: true,
            type: 'varchar',
          },
          {
            name: 'verifyToken',
            isNullable: true,
            type: 'varchar',
          },
          {
            name: 'verified',
            default: false,
            type: 'boolean',
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

    await queryRunner.createIndex(
      'user',
      new TableIndex({
        name: 'IDX_USER_EMAIL',
        columnNames: ['email'],
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('user')
  }
}
