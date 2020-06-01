import '@firebase/remote-config'
import * as firebase from 'firebase'
import { observable } from 'mobx';
import IpcRenderUtil from '../util/ipc_render'

export default class CommonStore {
  @observable public globalLoading = true;
  public configs: {[x: string]: any} = {
    remoteConfigName: `default`
  };

  constructor () {
    this.init()
  }

  async init () {
    this.globalLoading = true
    await this.loadLocalConfig()
    if (this.configs.remoteConfig && this.configs.remoteConfig.enable) {
      await this.loadRemoteConfig()
    }
    this.globalLoading = false
  }
  
  async loadLocalConfig () {
    try {
      const datas = await IpcRenderUtil.sendAsyncCommand('config', 'loadLocalConfig', {})
      this.configs = Object.assign(this.configs, datas)
    } catch(err) {
      console.error(err)
      throw err
    }
  }

  async loadRemoteConfig () {
    try {
      const app = firebase.initializeApp(this.configs.remoteConfig)
      const remoteConfig = firebase.remoteConfig(app)
      remoteConfig.settings = {
        fetchTimeoutMillis: 20000,
        minimumFetchIntervalMillis: 10000,
      }
      const activated = await remoteConfig.fetchAndActivate()
      if (activated) {
        const config = JSON.parse(remoteConfig.getValue(this.configs.remoteConfig.remoteConfigName).asString())
        this.configs = Object.assign(this.configs, config)
      }
    } catch(err) {
      console.error(err)
      throw err
    }
  }
  
}