import React from 'react';
import {
  HashRouter,
} from "react-router-dom";
import './App.css';
import { Provider } from 'mobx-react';
import Index from './page/index'
import {commonStore, homeStore} from "./store/init";

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
