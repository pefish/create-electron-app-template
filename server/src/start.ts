import '@pefish/js-node-assist'
import AppUtil from '@pefish/js-electron-common/lib/utils/app'
import path from 'path'
import ElectronRouteFactory from '@pefish/js-electron-common/lib/helpers/electron_route_factory'
import FileUtil from '@pefish/js-util-file'
import electron from 'electron'
import Log4js from '@pefish/js-helper-logger/lib/log4js'
import MenuItemConstructorOptions = Electron.MenuItemConstructorOptions;
import ConfigUtil from '@pefish/js-util-config'
import os from 'os'

declare global {
  namespace NodeJS {
    interface Global {
      logger: any,
      config: object;
      debug: boolean;
      mainWindow: any;
      dataDir: string
    }
  }
}

new ElectronRouteFactory().buildRoute(
  path.join(__dirname, './controller')
)

AppUtil.onReady(async () => {
  global.logger.info(`启动中。。。`)
  global.config = ConfigUtil.loadConfig(path.join(FileUtil.getStartFilePath(), `../config/prod.json`))
  global.debug = global.config['env'] !== 'prod'
  const packageInfo = require(path.join(FileUtil.getStartFilePath(), `../package.json`))
  const homedir = os.homedir()
  global.logger = new Log4js(packageInfo[`name`], `${homedir}/.${packageInfo[`name`]}/log`)
  global.dataDir = `${homedir}/.${packageInfo[`name`]}/data`
  FileUtil.mkdirSync(global[`dataDir`])


  const menuTemplate = [
    {
      label: 'Test',
      submenu: [
        {
          label: 'About ...',
          click: () => {
            electron.dialog.showMessageBox({
              message: `这是测试  v${packageInfo[`version`]}`
            })
          }
        },
        {
          type: 'separator'
        },
        {
          label: 'Quit',
          click: () => {
            electron.app.quit();
          }
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { label: 'Undo', accelerator: "CmdOrCtrl+Z", selector: "undo:" },
        { label: 'Redo', accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
        { type: "separator" },
        { label: 'Cut', accelerator: "CmdOrCtrl+X", selector: "cut:" },
        { label: 'Copy', accelerator: "CmdOrCtrl+C", selector: "copy:" },
        { label: 'Paste', accelerator: "CmdOrCtrl+V", selector: "paste:" },
        { label: 'Select All', accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
      ]
    },
    {
      label: 'Help',
      role: 'help',
      id: 'help',
      submenu: [
        {
          label: 'TEST',
          click: () => {
            const window = new electron.BrowserWindow({
              width: 1000,
              height: 600,
              resizable: true,
              icon: path.join(__dirname, 'icon.png'),
            })
            window.loadFile('doc/test.md')
            window.show()
          }
        },
        { type: "separator" },
        {
          label: '开发者选项',
          click: () => {
            window.webContents.openDevTools()
          }
        },
        {
          label: 'Reload',
          click: () => {
            global.mainWindow.reload()
          }
        },
      ]
    },
  ]
  const menu = electron.Menu.buildFromTemplate(menuTemplate as MenuItemConstructorOptions[])
  electron.Menu.setApplicationMenu(menu)

  const window = new electron.BrowserWindow({
    width: 800,
    height: 600,
    resizable: false,
    icon: path.join(__dirname, 'icon.icns'),
    webPreferences: {
      nodeIntegration: true
    },
  })
  const file = path.join(FileUtil.getStartFilePath(), '../build/index.html')
  let url = 'file://' + file
  if (global.debug) {
    url = `http://localhost:3000`
  }
  window.loadURL(url + `#/index`)
  window.show()
  global['mainWindow'] = window
  global.logger.info(`启动成功!!!`)
})
