import React from 'react';
import { Provider } from 'mobx-react';
import CommonStore from './store/common_store';
import HomeStore from './store/home_store';
import { HashRouter } from "react-router-dom"
import Index from './page/index'

const commonStore = new CommonStore()
const homeStore = new HomeStore(commonStore)
const stores = {
  commonStore,
  homeStore,
};

const App: React.FC = () => {
  return (
    <Provider {...stores}>
      <HashRouter>
        <Index />
      </HashRouter>
    </Provider>
  );
}

export default App;
