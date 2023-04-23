import { InternalServerErrorException } from '@nestjs/common'
import { Entity, ResponseEntity } from '@shared/interfaces/response.interface'
import { camelCase, forEach, isArray, isFunction, isNil, map } from 'lodash'

export interface TransformerInterface {
  /**
   * Get entity
   *
   * @param entity Entity
   * @return Entity
   */
  get(entity: Entity): Entity

  /**
   * Create a new item resource
   *
   * @param entity Entity
   * @param transformer TransformerInterface
   * @return Entity
   */
  item(entity: Entity, transformer: TransformerInterface): ResponseEntity

  /**
   * Create a new collection resource
   *
   * @param collection Entity[]
   * @param transformer TransformerInterface
   * @return Collection array entity
   */
  collection(
    collection: Entity[],
    transformer: TransformerInterface,
  ): ResponseEntity[]
}

export class Transformer implements TransformerInterface {
  public includes: any[]
  constructor(includes?: any[]) {
    this.includes = includes
  }

  item(entity: Entity, transformer: TransformerInterface): ResponseEntity {
    if (isNil(entity)) {
      return null
    }

    return transformer.get(entity)
  }

  collection(
    collection: Entity[],
    transformer: TransformerInterface,
  ): ResponseEntity[] {
    if (!isArray(collection)) {
      throw new InternalServerErrorException('Collection should be an array')
    }

    const data = map(collection, (i) => transformer.get(i))
    return data
  }

  get(entity: Entity): Entity {
    const data = (this as any).transform(entity)

    if (Array.isArray(this.includes) && this.includes.length > 0) {
      forEach(this.includes, (include) => {
        const f = camelCase(`include_${include}`)

        if (!isFunction(this[f])) {
          throw new Error(`${f} function is missing`)
        }

        data[include] = this[f](entity)
      })
    }

    return data
  }

  with(include: string): TransformerInterface {
    this.includes.push(include)
    return this
  }
}
