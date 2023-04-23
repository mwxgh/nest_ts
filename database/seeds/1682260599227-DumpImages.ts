import { Connection } from 'typeorm'
import { ImageEntity } from '../../src/components/image/entities/image.entity'

export default class DumpImages {
  async up(connection: Connection): Promise<void> {
    const seed = [
      {
        id: -1,
        title: 'Dump Image -1',
        slug: 'dump_image_1',
        url: 'https://cdn.pixabay.com/photo/2021/10/08/13/02/woman-6691311_960_720.jpg',
      },
      {
        id: -2,
        title: 'Dump Image -2',
        slug: 'dump_image_2',
        url: 'https://cdn.pixabay.com/photo/2020/10/23/17/52/fox-5679446_960_720.png',
      },
    ]

    const images = seed.map((item) => {
      const image = new ImageEntity()
      image.id = item.id
      image.title = item.title
      image.slug = item.slug
      image.url = item.url
      return image
    })

    await connection.manager.save(images)
  }
}
