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
import * as path from 'path'

interface CustomFilesInterceptorOptions {
  fieldName: string
  path?: string
}

function CustomFilesInterceptor(
  options: CustomFilesInterceptorOptions,
): Type<NestInterceptor> {
  @Injectable()
  class Interceptor implements NestInterceptor {
    fileInterceptor: NestInterceptor

    constructor(configService: ConfigService) {
      const filesDestination = configService.get('FILE_UPLOAD_DESTINATION')
      const absoluteFileDestination = path.resolve(
        process.cwd(),
        filesDestination,
      )

      const multerOptions: MulterOptions = {
        storage: diskStorage({
          destination: (req: any, file: any, cb: any) => {
            if (!existsSync(absoluteFileDestination)) {
              mkdirSync(absoluteFileDestination)
            }
            cb(null, absoluteFileDestination)
          },

          filename: (req, file: Express.Multer.File, cb) => {
            const randomName = Array(32)
              .fill(null)
              .map(() => Math.round(Math.random() * 16).toString(16))
              .join('')
            cb(null, `${randomName}${path.extname(file.originalname)}`)
          },
        }),

        fileFilter: (req, file: Express.Multer.File, cb) => {
          if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
            cb(null, true)
          } else {
            cb(
              new HttpException(
                `Unsupported file type ${path.extname(file.originalname)}`,
                HttpStatus.BAD_REQUEST,
              ),
              false,
            )
          }
        },
        limits: {
          fileSize:
            Number(process.env.FILE_UPLOAD_MAX_SIZE) ?? 50 * 1024 * 1024,
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

export default CustomFilesInterceptor
