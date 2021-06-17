import { observable } from 'mobx';
import { withGlobalLoading, wrapPromiseWithErrorTip } from '../util/decorator';
import HttpRequestUtil from "@pefish/js-util-httprequest"
import {commonStore} from "./init";


const isWebMediaString = "(min-width: 996px)"
export default class HomeStore {

  @observable
  public counter = 0;

  private isWebMatchMedia = window.matchMedia(isWebMediaString)
  @observable public isWeb = this.isWebMatchMedia.matches
  @observable public selectedMenu: string = "test1"

  @observable public loginModalVisible: boolean = false
  @observable public loginUsername: string = ""
  @observable public loginPassword: string = ""


  public setMediaListeners () {
    this.isWebMatchMedia.addListener(e => {
      this.isWeb = e.matches
    });
  }

  public setSelectedMemu (key: string) {
    this.selectedMenu = key
  }

  @wrapPromiseWithErrorTip()
  @withGlobalLoading()
  public async loginOrLogout (): Promise<any> {
    if (commonStore.persistenceStore.get("jwt")) {
      // logout
      commonStore.persistenceStore.remove("jwt")
      commonStore.persistenceStore.remove("username")
      return {}
    } else {
      // login
      // const jwt = await HttpRequestUtil.post("https://www.baidu.com")
      // throw new Error("test")
      const jwt = "hsgfjsfgjsyjsfjs"
      this.loginModalVisible = false
      commonStore.persistenceStore.set("jwt", jwt)
      commonStore.persistenceStore.set("username", this.loginUsername)
      return {}
    }

  }
}
