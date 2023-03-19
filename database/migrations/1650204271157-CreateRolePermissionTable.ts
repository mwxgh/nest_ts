import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm'

export class CreateRolePermissionTable1650204271157
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'rolePermission',
        columns: [
          {
            name: 'roleId',
            isPrimary: true,
            type: 'int',
          },
          {
            name: 'permissionId',
            isPrimary: true,
            type: 'int',
          },
        ],
      }),
      true,
    )

    await queryRunner.createIndex(
      'rolePermission',
      new TableIndex({
        name: 'IDX_ROLE_PERMISSION_ROLE_ID',
        columnNames: ['roleId'],
      }),
    )

    await queryRunner.createIndex(
      'rolePermission',
      new TableIndex({
        name: 'IDX_ROLE_PERMISSION_PERMISSION_ID',
        columnNames: ['permissionId'],
      }),
    )

    // await queryRunner.createForeignKey(
    //   'rolePermission',
    //   new TableForeignKey({
    //     columnNames: ['roleId'],
    //     referencedColumnNames: ['id'],
    //     referencedTableName: 'roles',
    //     onDelete: 'CASCADE',
    //   }),
    // );

    // await queryRunner.createForeignKey(
    //   'rolePermission',
    //   new TableForeignKey({
    //     columnNames: ['permissionId'],
    //     referencedColumnNames: ['id'],
    //     referencedTableName: 'permissions',
    //     onDelete: 'CASCADE',
    //   }),
    // );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('rolePermission')
  }
}
