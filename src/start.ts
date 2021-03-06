import '@pefish/js-node-assist'
import path from 'path'
import App from './util/app'
import FileUtil from '@pefish/js-util-file'
import ConfigUtil from '@pefish/js-util-config'

declare global {
  namespace NodeJS {
    interface Global {
      app: App;
    }
  }
}

const config = ConfigUtil.loadYamlConfig({
  configEnvName: `NODE_CONFIG`,
  configFilePath: path.join(FileUtil.getStartFilePath(), `../config/prod.yaml`),
})

global.app = new App(
  require(path.join(FileUtil.getStartFilePath(), '../package.json')),
  config,
  config.env !== 'prod'
)
global.app.appendWindowOptions({
  resizable: true,
})

global.app.start(
  async () => {
    
  },
  path.join(__dirname, './controller'),
  `/index`,
)
