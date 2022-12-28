import { CommonService } from '@sharedServices/common.service'
import { ContactService } from './services/contact.service'

export const contactProviders = [ContactService, CommonService]
