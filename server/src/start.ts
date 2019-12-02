import '@pefish/js-node-assist'
import path from 'path'
import { App } from '@pefish/js-electron-common'
import FileUtil from '@pefish/js-util-file'
import ConfigUtil from '@pefish/js-util-config'

declare global {
  namespace NodeJS {
    interface Global {
      logger: any,
      config: {[x: string]: any};
      debug: boolean;
      app: App;
    }
  }
}

global.config = ConfigUtil.loadYamlConfig({
  configEnvName: `NODE_CONFIG`,
  configFilePath: path.join(FileUtil.getStartFilePath(), `../config/prod.yaml`),
})
global.debug = global.config.env !== 'prod'
const packageInfo = require(path.join(FileUtil.getStartFilePath(), '../package.json'))

global.app = new App(packageInfo)
global.app.start(
  async () => {
    global.logger = global.app.logger
  },
  path.join(__dirname, './controller'),
  path.join(FileUtil.getStartFilePath(), '../build/index.html'),
  global.config,
)
