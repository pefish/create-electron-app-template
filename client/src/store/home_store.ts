import { observable } from 'mobx';
import CommonStore from './common_store';
import IpcRenderUtil from '../util/ipc_render'
import { withGlobalLoading } from '../util/decorator';
import { ReturnType } from '../util/type';
import { Moment } from 'moment';

export default class HomeStore {

  private commonStore: CommonStore
  @observable public counter: number = 0;
  @observable public selectedMenu: string = `default`;
  @observable public selectedClass: string = `a`
  @observable public txid: string = ``
  @observable public uuid: string = ``
  @observable public time: [Moment, Moment] = [null, null]
  @observable public datas: {[x: string]: any}[]
  @observable public page: number = 1
  public size: number = 20
  @observable public total: number = 0

  constructor (commonStore: CommonStore) {
    this.commonStore = commonStore
  }

  add () {
    this.counter++
  }

  @withGlobalLoading()
  async requestServer (): Promise<ReturnType> {
    return await IpcRenderUtil.sendAsyncCommand('test', 'test', {
      haha: `test`,
    })
  }

  @withGlobalLoading()
  async netRequestServer (): Promise<ReturnType> {
    return await IpcRenderUtil.httpGet(`http://baidu.com`)
  }

  @withGlobalLoading()
  async loadDatas(): Promise<boolean> {
    // const [{ datas, total }, err] = await IpcRenderUtil.sendAsyncCommand('withdraw', 'listRecords', {
    //   page: this.page,
    //   size: this.size,
    //   uuid: this.uuid,
    //   start_time: this.time[0] && this.time[0].format('YYYY-MM-DD HH:mm:ss'),
    //   end_time: this.time[1] && this.time[1].format('YYYY-MM-DD HH:mm:ss'),
    // })
    // if (err) {
    //   return false
    // }
    const datas = []
    const total = 20
    for (let i = 0; i < 10; i++) {
      datas.push({
        id: i,
        tx_id: "dgjdj",
        fee: "1.2",
        mark: i,
        created_at: "2020-01-01 12:12:00"
      })
    }
    this.datas = datas;
    this.total = total
    return true
  }

}
