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
    isNullable: true,
    type: 'datetime',
  },
]
