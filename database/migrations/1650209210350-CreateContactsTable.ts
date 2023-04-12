import { MigrationInterface, QueryRunner, Table } from 'typeorm'
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('contact')
  }
}
