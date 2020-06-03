/** @module */

import electron, { BrowserWindowConstructorOptions, MenuItem } from 'electron'
import path from 'path'
import MenuItemConstructorOptions = Electron.MenuItemConstructorOptions;
import * as util from "util";
import { Log4js } from '@pefish/js-helper-logger'
import os from 'os'
import FileUtil from '@pefish/js-util-file'
import HttpRequestUtil from '@pefish/js-util-httprequest';
import IpcMainUtil from './ipc_main'
import DesensitizeUtil from '@pefish/js-util-desensitize'
import { spawn, ChildProcess } from 'child_process'
import TimeUtil from '@pefish/js-util-time'
import kill from 'tree-kill'

class App {
  public dataDir: string
  public logger: Log4js
  public packageInfo: { [x: string]: any }
  public config: { [x: string]: any }
  public isDebug: boolean
  public mainWindow: electron.BrowserWindow
  private routes: { [x: string]: any } = {}
  private windowOptions: BrowserWindowConstructorOptions = {
    width: 1000,
    height: 600,
    resizable: false,
    icon: path.join(__dirname, 'icon.icns'),
    webPreferences: {
      nodeIntegration: true
    },
  }
  private appMenuArr: { [x: string]: any }[] = []
  private prodUri: string = path.join(FileUtil.getStartFilePath(), '../build/index.html')
  private child: ChildProcess

  constructor(packageInfo: { [x: string]: any }, config: { [x: string]: any }, isDebug: boolean = true) {
    this.packageInfo = packageInfo
    this.config = config
    this.isDebug = isDebug
    const homedir = os.homedir()
    this.logger = new Log4js(this.packageInfo.name, `${homedir}/.${this.packageInfo.name}/log`, isDebug ? `debug` : `info`)
    this.dataDir = `${homedir}/.${packageInfo.name}/data`
    FileUtil.mkdirSync(this.dataDir)
  }

  public appendWindowOptions (windowOptions: BrowserWindowConstructorOptions) {
    this.windowOptions = Object.assign(this.windowOptions, windowOptions)
  }

  public appendAppMenu (appMenu: { [x: string]: any }) {
    this.appMenuArr.push(appMenu)
  }

  async waitKillClient () {
    if (this.child) {
      let clientClosed = false
      this.child.on('close', (code, signal) => {
        this.logger.info(`client killed`)
        clientClosed = true
      })
      kill(this.child.pid, "SIGINT")
      while (!clientClosed) {
        await TimeUtil.sleep(300)
      }
    }
  }

  async waitStartClient (): Promise<string> {
    let url = "http://localhost:3000/"
    if (process.env["NO_CLIENT"] === "1") {
      return url
    }

    let done = false
    let allData = ""
    let error = null

    this.child = spawn('yarn', ["start-client"], {
      detached: false,
    })
    this.child.stdout.on('data', (data: string) => {
      // console.log(`child stdout: ${data}`);
      allData += data
      if (data.includes("Compiled with warnings")) {
        error = new Error(data)
        done = true
        return
      }
      if (data.includes("You can now view client in the browser")) {
        // url = "http://localhost:3000/"  // 可以使用正则取出url。TODO
        done = true
      }
    })
    let counter = 0
    while (!done) {
      await TimeUtil.sleep(5000)
      this.logger.info(`waiting client start...`)
      counter++
      if (counter >= 7) {
        error = new Error(`client start failed!!! allData: ${allData}`)
        break
      }
    }
    if (error) {
      await this.waitKillClient()
      throw error
    }
    this.logger.info(`client start done!!!`)
    return url
  }

  start(
    willStartFunc: () => Promise<void>,
    controllerPath: string,
    loadPage: string = `/index`,
    onClosed: () => Promise<void> = null,
  ) {
    electron.app.on('ready', async () => {
      try {
        this.logger.info(`starting ...`)
        this.buildRoute(controllerPath)
        await willStartFunc()
        this.mainWindow = this.getMainWindow()
        let url = 'file://' + this.prodUri
        if (this.isDebug) {
          url = await this.waitStartClient()
        }
        url += `#` + loadPage
        this.logger.info(`url: ${url}`)
        this.mainWindow.loadURL(url)
        this.mainWindow.show()
        this.logger.info(`started !!!`)
      } catch (err) {
        this.logger.error(util.inspect(err))
        electron.app.quit()
      }
    })
    electron.app.on('window-all-closed', async () => {
      try {
        await this.waitKillClient()
        onClosed && await onClosed()
      } catch (err) {
        this.logger.error(util.inspect(err))
      } finally {
        electron.app.quit()
      }
    })
  }

  async buildRoute (controllersPath: string) {
    const filesAndDirs = FileUtil.getFilesAndDirs(controllersPath)
    for (let file of filesAndDirs.files) {
      if (!file.endsWith(`.js`) && !file.endsWith(`.ts`)) {
        continue
      }
      let name = path.basename(file)
      name = name.substring(0, name.length - 3);
      this.routes[name] = new (require(`${controllersPath}/${name}`).default)()
      this.routes[name].init && await this.routes[name].init()
    }
    this.routes[`net`] = new NetClass()
    this.routes[`net`].init && await this.routes[`net`].init()

    IpcMainUtil.onSyncCommand(async (event, cmd, args) => {
      let reply
      try {
        this.logger.info(`收到同步请求 ${cmd} ${DesensitizeUtil.desensitizeObjectToString(args)}`)
        const [instanceName, methodName] = cmd.split(/\./)
        if (!this.routes[instanceName]) {
          const msg = `${cmd} 未找到路由`
          IpcMainUtil.return_(event, msg)
          this.logger.error(msg)
          return
        }
        const result = await this.routes[instanceName][methodName](args)
        reply = {
          code: 0,
          data: result
        }
        IpcMainUtil.return_(event, reply)
      } catch (err) {
        this.logger.error(util.inspect(err))
        reply = {
          code: 1,
          msg: err.getErrorMessage_ ? err.getErrorMessage_() : err.message
        }
        IpcMainUtil.return_(event, reply)
      }
    })

    IpcMainUtil.onAsyncCommand(async (event, cmd, args) => {
      let reply
      try {
        this.logger.info(`收到异步请求 ${cmd} ${DesensitizeUtil.desensitizeObjectToString(args)}`)
        const [instanceName, methodName] = cmd.split(/\./)
        if (!this.routes[instanceName]) {
          const msg = `${cmd} 未找到路由`
          this.logger.error(msg)
          reply = {
            code: 1,
            msg,
          }
        } else {
          const result = await this.routes[instanceName][methodName](args)
          reply = {
            code: 0,
            data: result
          }
        }
        IpcMainUtil.sendAsyncCommand(event, cmd, reply)
      } catch (err) {
        this.logger.error(util.inspect(err))
        reply = {
          code: 1,
          msg: err.getErrorMessage_ ? err.getErrorMessage_() : err.message
        }
        IpcMainUtil.sendAsyncCommand(event, cmd, reply)
      }
    })
  }

  getMainWindow(): electron.BrowserWindow {
    const window = new electron.BrowserWindow(this.windowOptions)

    const menuTemplate = [
      {
        label: this.packageInfo.name,
        submenu: [
          {
            label: 'About ...',
            click: () => {
              electron.dialog.showMessageBox({
                message: this.packageInfo.description
              })
            }
          },
          {
            type: 'separator'
          },
          {
            label: 'Version ...',
            click: () => {
              electron.dialog.showMessageBox({
                message: `v${this.packageInfo.version}\n${this.packageInfo.versionDescription || ""}`
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
            label: '开发者选项',
            click: () => {
              window.webContents.openDevTools()
            }
          },
          { type: "separator" },
          {
            label: 'Reload',
            click: () => {
              window.reload()
            }
          },
        ]
      },
      ...this.appMenuArr,
    ]
    const menu = electron.Menu.buildFromTemplate(menuTemplate as MenuItemConstructorOptions[])
    electron.Menu.setApplicationMenu(menu)

    const selectionMenu = electron.Menu.buildFromTemplate([
      { role: "copy" } as MenuItem,
      { type: 'separator' } as MenuItem,
      { role: 'selectAll' } as MenuItem,
    ])
    const inputMenu = electron.Menu.buildFromTemplate([
      { role: 'undo' } as MenuItem,
      { role: 'redo' } as MenuItem,
      { type: 'separator' } as MenuItem,
      { role: 'cut' } as MenuItem,
      { role: 'copy' } as MenuItem,
      { role: 'paste' } as MenuItem,
      { type: 'separator' } as MenuItem,
      { role: 'selectAll' } as MenuItem,
    ])
    window.webContents.on('context-menu', (e, props) => {
      const { selectionText, isEditable } = props;
      if (isEditable) {
        inputMenu.popup(window as any);
      } else if (selectionText && selectionText.trim() !== '') {
        selectionMenu.popup(window as any);
      }
    })

    return window
  }
}

class NetClass {
  async httpGet (args: {
    url: string,
    opts: {[x: string]: any},
  }) {
    return HttpRequestUtil.get(args.url, args.opts)
  }

  async httpPost (args: {
    url: string,
    opts: {[x: string]: any},
  }) {
    return HttpRequestUtil.post(args.url, args.opts)
  }
}

export default App
