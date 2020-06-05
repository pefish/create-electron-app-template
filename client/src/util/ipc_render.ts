/** @module */

import electron from 'electron'
import { RequestOpts } from '@pefish/js-util-httprequest';
import {
  Modal,
} from 'antd';
import { wrapPromise } from './decorator';
import { ReturnType } from './type';
/**
 * 副窗口ipc工具类
 */
class IpcRendererUtil {
  /**
   * 会阻塞UI进程
   * @param controller
   * @param method
   * @param args
   * @returns {*}
   */
  static sendSyncCommandForResult (controller: string, method: string, args: {[x: string]: any}): ReturnType {
    const sendEventName = `sync_message`
    const datas = {
      cmd: `${controller}.${method}`,
      args
    }
    const result = electron.ipcRenderer.sendSync(sendEventName, datas)
    if (result.code !== 0) {
      Modal.error({
        title: `错误`,
        content: result[`msg`],
      })
      return [null, new Error(result[`msg`])]
    }
    return [result[`data`], null]
  }

  @wrapPromise()
  static async sendAsyncCommand (controller: string, method: string, args: {[x: string]: any}): Promise<ReturnType> {
    const cmd = `${controller}.${method}`
    return new Promise((resolve, reject) => {
      const receiveEventName = `async_message_${cmd}`
      electron.ipcRenderer.once(receiveEventName, (event, result) => {
        if (result.code !== 0) {
          Modal.error({
            title: `错误`,
            content: result[`msg`],
          })
          reject([null, new Error(result[`msg`])])
        }
        resolve([result[`data`], null])
      })

      const sendEventName = `async_message`
      const datas = {
        cmd,
        args
      }
      electron.ipcRenderer.send(sendEventName, datas)
    })
  }

  static async httpGet (url: string, opts?: RequestOpts): Promise<[any, Error | null]> {
    return await this.sendAsyncCommand(`net`, `httpGet`, {
      url,
      opts,
    })
  }

  static async httpPost (url: string, opts?: RequestOpts): Promise<[any, Error | null]> {
    return await this.sendAsyncCommand(`net`, `httpPost`, {
      url,
      opts,
    })
  }
}

export default IpcRendererUtil
