import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

export enum AbleType {
  product = 'PRODUCT',
  post = 'POST',
}

export abstract class IdEntity {
  @PrimaryGeneratedColumn()
  id: number
}

export abstract class BaseTimeStampEntity extends IdEntity {
  @CreateDateColumn({
    type: 'timestamp',
    precision: null,
    default: () => 'NOW()',
  })
  public createdAt: Date

  @UpdateDateColumn({
    type: 'timestamp',
    precision: null,
    default: () => 'NOW()',
  })
  public updatedAt: Date
}

export abstract class TimeStampEntity extends BaseTimeStampEntity {
  @DeleteDateColumn({ type: 'timestamp', precision: null })
  public deletedAt: Date
}

export abstract class AbleEntity {
  @PrimaryColumn({ name: 'ableId', type: 'int' })
  ableId: number

  @Column({ name: 'ableType', type: 'enum', enum: AbleType })
  ableType: AbleType
}
