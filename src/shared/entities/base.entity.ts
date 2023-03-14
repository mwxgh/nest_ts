import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

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
