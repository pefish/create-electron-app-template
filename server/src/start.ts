import '@pefish/js-node-assist'
import path from 'path'
import { AppUtil, ElectronRouteFactoryHelper } from '@pefish/js-electron-common'
import FileUtil from '@pefish/js-util-file'
import electron from 'electron'
import { Log4js } from '@pefish/js-helper-logger'
import ConfigUtil from '@pefish/js-util-config'
import os from 'os'

declare global {
  namespace NodeJS {
    interface Global {
      logger: any,
      config: {[x: string]: any};
      debug: boolean;
      mainWindow: electron.BrowserWindow;
      dataDir: string
    }
  }
}

new ElectronRouteFactoryHelper().buildRoute(
  path.join(__dirname, './controller')
)

AppUtil.onReady(async () => {
  global.logger.info(`启动中。。。`)
  global.config = ConfigUtil.loadYamlConfig({
    configEnvName: `NODE_CONFIG`,
  })
  global.debug = global.config.env !== 'prod'
  const packageInfo = require(path.join(FileUtil.getStartFilePath(), `../package.json`))
  const homedir = os.homedir()
  global.logger = new Log4js(packageInfo.name, `${homedir}/.${packageInfo.name}/log`)
  global.dataDir = `${homedir}/.${packageInfo.name}/data`
  FileUtil.mkdirSync(global.dataDir)


  global.mainWindow = AppUtil.getMainWindow({
    height: 600,
    width: 800,
  })
  const file = path.join(FileUtil.getStartFilePath(), '../build/index.html')
  let url = 'file://' + file
  if (global.debug) {
    url = `http://localhost:3000`
  }
  global.mainWindow.loadURL(url + `#/index`)
  global.mainWindow.show()
  global.logger.info(`启动成功!!!`)
})
