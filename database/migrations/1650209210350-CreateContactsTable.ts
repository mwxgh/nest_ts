import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm'
import { baseTimeColumn } from '../abstract/baseColumn'

export class CreateContactsTable1650209210350 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'contact',
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
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'phone',
            type: 'varchar',
          },
          {
            name: 'address',
            type: 'varchar',
          },
          {
            name: 'type',
            type: 'enum',
            enum: ['PRIORITY', 'NORMAL'],
          },

          ...baseTimeColumn,
        ],
      }),
      true,
    )
    await queryRunner.createIndex(
      'contact',
      new TableIndex({
        name: 'IDX_CONTACT_USER_ID',
        columnNames: ['userId'],
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('contact', 'IDX_CONTACT_USER_ID')
    await queryRunner.dropTable('contact')
  }
}
