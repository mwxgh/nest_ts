import * as fs from 'fs'
import * as fse from 'fs-extra'
import { isNil } from 'lodash'
import * as path from 'path'
import { Command, Error, IOption, Info } from './Command'

export class MakeSeederCommand extends Command {
  signature(): string {
    return 'make:seeder <seeder>'
  }

  description(): string {
    return 'Create new seeder file'
  }

  options(): IOption[] {
    return [{ key: 'override?', description: 'Override existing file' }]
  }

  async handle(
    seeder: string,
    options: { override: undefined | string },
  ): Promise<any> {
    if (isNil(seeder) || seeder === '') {
      Error('Seeder name is required')
    }
    const file = path.resolve(
      __dirname,
      '../../../database/seeds',
      `${Date.now()}-${seeder}.ts`,
    )
    if (
      fs.existsSync(file) &&
      (options.override === undefined || options.override.toString() !== 'true')
    ) {
      Error(`${seeder} already exist`)
    }
    const content = `import { Connection } from 'typeorm'
// import { User } from '../../entities/user.entity'

export default class ${seeder} {
  async up(connection: Connection): Promise<void> {
    // const repository = connection.getCustomRepository(CustomRepository)
    // let items = [
    //   { name: 'Custom', slug: 'custom', type: 1 },
    //   { name: 'Weekly', slug: 'weekly', type: 1 },
    //   { name: 'Monthly', slug: 'monthly', type: 1 },
    //   { name: 'Quarterly', slug: 'quarterly', type: 1 },
    // ]
    // items = items.map(i => {
    //   return repository.create(i);
    // })
    // await connection.manager.save(items)
  }
}
`
    fse.outputFileSync(file, content)
    Info(`${file} is created`)

    return file
  }
}
