export const baseTimeColumn = [
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
  {
    name: 'deletedAt',
    type: 'timestamp',
    isNullable: true,
  },
]
