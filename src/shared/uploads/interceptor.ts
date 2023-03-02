import { FileInterceptor } from '@nestjs/platform-express'
import {
  HttpException,
  HttpStatus,
  Injectable,
  mixin,
  NestInterceptor,
  Type,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface'
import { diskStorage } from 'multer'
import { existsSync, mkdirSync } from 'fs'
import { extname } from 'path'

interface LocalFilesInterceptorOptions {
  fieldName: string
  path?: string
}

function LocalFilesInterceptor(
  options: LocalFilesInterceptorOptions,
): Type<NestInterceptor> {
  @Injectable()
  class Interceptor implements NestInterceptor {
    fileInterceptor: NestInterceptor
    constructor(configService: ConfigService) {
      const filesDestination = configService.get('UPLOADED_FILES_DESTINATION')

      const storage = diskStorage({
        destination: (req: any, file: any, cb: any) => {
          if (!existsSync(filesDestination)) {
            mkdirSync(filesDestination)
          }
          cb(null, filesDestination)
        },
        filename: (req, file: Express.Multer.File, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('')
          cb(null, `${randomName}${extname(file.originalname)}`)
        },
      })

      const multerOptions: MulterOptions = {
        storage,
        fileFilter: (req: any, file: any, cb: any) => {
          if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
            cb(null, true)
          } else {
            cb(
              new HttpException(
                `Unsupported file type ${extname(file.originalname)}`,
                HttpStatus.BAD_REQUEST,
              ),
              false,
            )
          }
        },
        limits: {
          fileSize: +process.env.MAX_FILE_SIZE || 10 * 10 * 10 * 1024,
        },
      }

      this.fileInterceptor = new (FileInterceptor(
        options.fieldName,
        multerOptions,
      ))()
    }

    intercept(...args: Parameters<NestInterceptor['intercept']>) {
      return this.fileInterceptor.intercept(...args)
    }
  }
  return mixin(Interceptor)
}

export default LocalFilesInterceptor
