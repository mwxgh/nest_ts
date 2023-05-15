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

export const baseAbleColumn = [
  {
    name: 'ableId',
    type: 'int',
    isPrimary: true,
  },
  {
    name: 'ableType',
    type: 'enum',
    enum: ['POST', 'PRODUCT'],
  },
]
