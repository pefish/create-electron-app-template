import React from 'react';
import { Provider } from 'mobx-react';
import CommonStore from './store/common_store';
import HomeStore from './store/home_store';
import { HashRouter } from "react-router-dom"
import Index from './page/index'
import LoginStore from './store/login_store';

const commonStore = new CommonStore()
const homeStore = new HomeStore(commonStore)
const loginStore = new LoginStore(commonStore)
const stores = {
  commonStore,
  homeStore,
  loginStore,
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
