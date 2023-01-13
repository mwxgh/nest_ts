import { PrimitiveService } from '@shared/services/primitive.service'
import { TagService } from './services/tag.service'
import { TagAbleService } from './services/tagAble.service'

export const tagProviders = [TagAbleService, TagService, PrimitiveService]
