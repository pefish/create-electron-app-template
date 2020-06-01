/** @module */

import electron from 'electron'

/**
 * 主窗口ipc工具类
 */
class IpcMainUtil {
  static onSyncCommand (cb) {
    electron.ipcMain.on('sync_message', (event, args) => {
      cb(event, args['cmd'], args['args'])
    })
  }

  static onAsyncCommand (cb) {
    electron.ipcMain.on('async_message', (event, args) => {
      cb(event, args['cmd'], args['args'])
    })
  }

  static sendAsyncCommand (event, cmd, args) {
    event.sender.send(`async_message_${cmd}`, args)
  }

  static return_ (event, datas) {
    event.returnValue = datas
  }
}

export default IpcMainUtil
