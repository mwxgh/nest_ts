import { Connection } from 'typeorm'
import {
  CategoryEntity,
  CategoryStatus,
} from '../../src/components/category/entities/category.entity'

export default class DumpCategories {
  async up(connection: Connection): Promise<void> {
    const seed = [
      { id: -1, name: 'Dump Category -1', status: CategoryStatus.publish },
      { id: -2, name: 'Dump Category -2', status: CategoryStatus.publish },
      {
        id: -3,
        name: 'Dump Category -3',
        status: CategoryStatus.publish,
        parentId: -1,
      },
      {
        id: -4,
        name: 'Dump Category -4',
        status: CategoryStatus.publish,
        parentId: -1,
      },
      {
        id: -5,
        name: 'Dump Category -5',
        status: CategoryStatus.publish,
        parentId: -2,
      },
      {
        id: -6,
        name: 'Dump Category -6',
        status: CategoryStatus.publish,
        parentId: -2,
      },
    ]

    const categories = seed.map((item) => {
      const category = new CategoryEntity()
      category.id = item.id
      category.name = item.name
      category.status = item.status
      category.parentId = item.parentId
      return category
    })

    await connection.manager.save(categories)
  }
}
