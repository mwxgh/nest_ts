import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm'

export class CreateUserRoleTable1650204109718 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'userRole',
        columns: [
          {
            name: 'userId',
            isPrimary: true,
            type: 'int',
          },
          {
            name: 'roleId',
            isPrimary: true,
            type: 'int',
          },
        ],
      }),
      true,
    )
    await queryRunner.createIndex(
      'userRole',
      new TableIndex({ name: 'IDX_UR_USER_ID', columnNames: ['userId'] }),
    )

    await queryRunner.createIndex(
      'userRole',
      new TableIndex({ name: 'IDX_UR_ROLE_ID', columnNames: ['roleId'] }),
    )

    // await queryRunner.createForeignKey(
    //   'userRole',
    //   new TableForeignKey({
    //     columnNames: ['userId'],
    //     referencedColumnNames: ['id'],
    //     referencedTableName: 'users',
    //     onDelete: 'CASCADE',
    //   }),
    // );

    // await queryRunner.createForeignKey(
    //   'userRole',
    //   new TableForeignKey({
    //     columnNames: ['roleId'],
    //     referencedColumnNames: ['id'],
    //     referencedTableName: 'roles',
    //     onDelete: 'CASCADE',
    //   }),
    // );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('userRole', 'IDX_UR_USER_ID')
    await queryRunner.dropIndex('userRole', 'IDX_UR_ROLE_ID')
    await queryRunner.dropTable('userRole')
  }
}
