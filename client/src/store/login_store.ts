import { observable } from 'mobx';
import IpcRendererUtil from '../util/ipc_render'
import CommonStore from './common_store';
import { withGlobalLoading } from '../util/decorator';
import {
  Modal,
} from 'antd';
export default class LoginStore {
  private commonStore: CommonStore

  @observable
  public r = 255;
  @observable
  public g = 0;
  @observable
  public b = 0;
  @observable
  public a = 0.25;
  private timer;
  @observable
  public username;
  @observable
  public password;
  @observable
  public isAuthenticated = false;

  constructor(commonStore) {
    this.commonStore = commonStore
  }

  startTimer() {
    let intervalR = -5, intervalG = -5, intervalB = -5
    this.timer = setInterval(() => {
      this.r = this.r + intervalR
      if (this.r < 0 || this.r > 255) {
        intervalR = -intervalR
      }

      this.g = this.g + intervalG
      if (this.g < 0 || this.g > 255) {
        intervalG = -intervalG
      }

      this.b = this.b + intervalB
      if (this.b < 0 || this.b > 255) {
        intervalB = -intervalB
      }
    }, 100)
  }

  stopTimer() {
    this.timer && clearInterval(this.timer)
  }

  @withGlobalLoading()
  async authenticate(): Promise<boolean> {
    if (!this.username) {
      Modal.error({
        title: "错误",
        content: "请填写用户名",
      })
      return false
    }
    if (!this.password) {
      Modal.warn({
        title: "错误",
        content: "请填写密码",
      })
      return false
    }
    const [_, err] = await IpcRendererUtil.sendAsyncCommand('login', 'login', {
      username: this.username,
      password: this.password,
    })
    if (err) {
      return false
    }
    this.isAuthenticated = true;
    return true
  }

  signout() {
    this.isAuthenticated = false;
  }
}
