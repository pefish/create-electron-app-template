import { observable, action } from 'mobx';
import CommonStore from './common_store';
import { IpcRenderUtil } from '@pefish/js-electron-common'

export default class HomeStore {

  private commonStore: CommonStore
  @observable
  private counter = 0;

  constructor (commonStore: CommonStore) {
    this.commonStore = commonStore
  }

  @action
  async add () {
    try {
      this.counter++
    } catch(err) {
      console.error(err)
      throw err
    }
  }

  async requestServer () {
    try {
      const datas = await IpcRenderUtil.sendAsyncCommand('test', 'test', {
        haha: `test`,
      })
      return datas
    } catch(err) {
      console.error(err)
      throw err
    }
  }

  async netRequestServer () {
    try {
      const datas = await IpcRenderUtil.httpGet(`http://baidu.com`)
      return datas
    } catch(err) {
      console.error(err)
      throw err
    }
  }

}
