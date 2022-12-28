import { CommonService } from '@sharedServices/common.service'
import { TagService } from './services/tag.service'
import { TagAbleService } from './services/tagAble.service'

export const tagProviders = [TagAbleService, TagService, CommonService]
