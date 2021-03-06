import Edmunds from '../edmunds'
import Kernel from './kernel'
import { expect } from 'chai'
import 'mocha'
import * as appRootPath from 'app-root-path'
import * as commander from 'commander'
import Command from './command'

describe('Kernel', () => {
  beforeEach(() => {
    MyKernel.iRan = false
    MyCommand.iRegistered = false
    MyCommand.iRan = false
  })

  it('should pass basics', async () => {
    class ThisKernel extends MyKernel {
      async run () {
        expect(this.edmunds).to.equal(edmunds)
        expect(this.argv).to.deep.equal(process.argv)
        await super.run()
      }
    }

    const edmunds = new Edmunds(appRootPath.path)
    const kernel = new ThisKernel(edmunds)

    expect(kernel).to.be.instanceof(Kernel)
    await kernel.run()
    expect(MyKernel.iRan).to.equal(true)
  })

  it('should load commands', async () => {
    const edmunds = new Edmunds(appRootPath.path)
    const kernel = new MyKernel(edmunds, ['node', 'cli.js'])

    await kernel.run()

    expect(MyKernel.iRan).to.equal(true)
    expect(MyCommand.iRegistered).to.equal(true)
    expect(MyCommand.iRan).to.equal(false)
  })

  it('should run commands', async () => {
    const edmunds = new Edmunds(appRootPath.path)
    const kernel = new MyKernel(edmunds, ['node', 'cli.js', '--', 'mycommand'])

    await kernel.run()

    expect(MyKernel.iRan).to.equal(true)
    expect(MyCommand.iRegistered).to.equal(true)
    expect(MyCommand.iRan).to.equal(true)
  })

})

class MyCommand extends Command {
  static iRegistered = false
  static iRan = false

  register (program: commander.Command): commander.Command {
    MyCommand.iRegistered = true
    return program.command('mycommand')
  }

  async run (...args: any[]): Promise<void> {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        MyCommand.iRan = true
        resolve()
      }, 100)
    })
  }
}

class MyKernel extends Kernel {
  static iRan = false

  async run () {
    await super.run()
    MyKernel.iRan = true
  }

  protected help (program: commander.Command): void {
    // Don't print help as it closes the current process
  }

  protected createProgram (): commander.Command {
    return super.createProgram()
      .option('-r, --require', 'Dummy to avoid error on debugging')
  }

  protected getCommands (): { new(program: commander.Command, app: Edmunds): Command }[] {
    return [MyCommand]
  }
}
