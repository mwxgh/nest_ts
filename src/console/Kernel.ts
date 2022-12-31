import { KeyGenerateCommand } from './Commands/KeyGenerateCommand'
import { MakeCommandCommand } from './Commands/MakeCommandCommand'
import { MakeSeederCommand } from './Commands/MakeSeederCommand'
import { SeedCommand } from './Commands/SeedCommand'

interface ICommand {
  'make:command': any
  'make:seeder': any
  'key:generate': any
  seed: any
}

export class Kernel {
  commands(): ICommand {
    return {
      'make:command': MakeCommandCommand,
      'make:seeder': MakeSeederCommand,
      'key:generate': KeyGenerateCommand,
      seed: SeedCommand,
    }
  }
}
