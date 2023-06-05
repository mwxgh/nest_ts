declare const module: any
import { Logger, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  if (process.env.APP_ENV !== 'production') {
    const config = new DocumentBuilder()
      .addBearerAuth()
      .setTitle('NEST_TS')
      .setDescription(
        `[REST Resource Naming Guide](https://restfulapi.net/resource-naming/)`,
      )
      .setVersion('1.0')
      .build()
    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('swaggerUI', app, document)
    Logger.log(`Documentation: http://localhost:${process.env.PORT}/swaggerUI`)
  }

  app.enableCors()
  app.useGlobalPipes(new ValidationPipe())
  await app.listen(process.env.PORT)

  if (module.hot) {
    module.hot.accept()
    module.hot.dispose(() => app.close())
  }
}
bootstrap()
