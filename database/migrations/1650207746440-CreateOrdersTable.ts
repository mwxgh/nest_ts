import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateOrdersTable1650207746440 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'orders',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'fullName',
            type: 'varchar',
            default: "''",
          },
          {
            name: 'email',
            type: 'varchar',
            default: "''",
          },
          {
            name: 'phoneNumber',
            type: 'int',
          },
          {
            name: 'address',
            type: 'varchar',
            default: "''",
          },
          {
            name: 'note',
            type: 'varchar',
            default: "''",
          },
          {
            name: 'amount',
            type: 'int',
          },
          {
            name: 'status',
            default: 1,
            type: 'int',
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
    await queryRunner.dropTable('orders');
  }
}
