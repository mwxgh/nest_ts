import { Connection } from 'typeorm'
import {
  TagEntity,
  TagStatus,
} from '../../src/components/tag/entities/tag.entity'

export default class DumpTags {
  async up(connection: Connection): Promise<void> {
    const seed = [
      { id: -1, name: 'Dump Tag -1', status: TagStatus.publish },
      { id: -2, name: 'Dump Tag -2', status: TagStatus.publish },
    ]

    const tags = seed.map((item) => {
      const tag = new TagEntity()
      tag.id = item.id
      tag.name = item.name
      tag.status = item.status
      return tag
    })

    await connection.manager.save(tags)
  }
}
