import { observable } from 'mobx';
import CommonStore from './common_store';
import IpcRenderUtil from '../util/ipc_render'
import { withGlobalLoading } from '../util/decorator';

export default class HomeStore {

  private commonStore: CommonStore
  @observable public counter = 0;
  @observable public selectedMenu = `default`;
  @observable public selectedClass = `a`
  @observable public txid

  constructor (commonStore: CommonStore) {
    this.commonStore = commonStore
  }

  add () {
    this.counter++
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
