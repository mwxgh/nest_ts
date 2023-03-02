import { HttpException, HttpStatus } from '@nestjs/common'
import { existsSync, mkdirSync } from 'fs'
import { diskStorage } from 'multer'
import { extname } from 'path'

export const multerConfig = {
  dest:
    process.env.APP_ENV === 'local' ? 'public/uploads' : 'dist/public/uploads',
}

const storage = diskStorage({
  destination: (req: any, file: any, cb: any) => {
    const uploadPath = multerConfig.dest
    if (!existsSync(uploadPath)) {
      mkdirSync(uploadPath)
    }
    cb(null, uploadPath)
  },
  filename: (req, file: Express.Multer.File, cb) => {
    const randomName = Array(32)
      .fill(null)
      .map(() => Math.round(Math.random() * 16).toString(16))
      .join('')
    cb(null, `${randomName}${extname(file.originalname)}`)
  },
})

export const multerOptions = {
  limits: {
    fileSize: +process.env.MAX_FILE_SIZE || 10 * 10 * 10 * 1024,
  },

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

  storage,
}

export default multerOptions
