import { observable } from 'mobx';
import CommonStore from './common_store';
import IpcRenderUtil from '../util/ipc_render'
import { withGlobalLoading } from '../util/decorator';

export default class HomeStore {

  private commonStore: CommonStore
  @observable
  public counter = 0;

  constructor (commonStore: CommonStore) {
    this.commonStore = commonStore
  }

  async add () {
    try {
      this.counter++
    } catch(err) {
      console.error(err)
      throw err
    }
  }

  @withGlobalLoading()
  async requestServer () {
    const datas = await IpcRenderUtil.sendAsyncCommand('test', 'test', {
      haha: `test`,
    })
    return datas
  }

  @withGlobalLoading()
  async netRequestServer () {
    const datas = await IpcRenderUtil.httpGet(`http://baidu.com`)
    return datas
  }

}
