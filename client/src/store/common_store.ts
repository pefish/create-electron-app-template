import { observable } from 'mobx';
import PersistenceStore from "./persistence_store";

export default class CommonStore {
  
  @observable public globalLoading: boolean = false;
  
  public websiteSimpleTitle: string = "Swarm 管理端"
  public persistenceStore: PersistenceStore

  constructor() {
    this.persistenceStore = new PersistenceStore()
  }
}