import { Test, TestingModule } from '@nestjs/testing'
import { ForgotPasswordController } from './forgotPassword.controller'

describe('ForgotPassword Controller', () => {
  let controller: ForgotPasswordController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ForgotPasswordController],
    }).compile()

    controller = module.get<ForgotPasswordController>(ForgotPasswordController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
