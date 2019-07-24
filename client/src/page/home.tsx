import React from 'react';
import { inject, observer } from 'mobx-react';
import logo from '../logo.svg';
import './home.css'
import {
  Button,
} from 'antd';

@inject('homeStore')
@observer
export default class Home extends React.Component<any,any> {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/app.tsx</code> and save to reload.
          </p>
          <span>
            This is test.
          </span>
          <span>
            {this.props.homeStore.counter}
          </span>
          <Button type={`primary`} onClick={() => {
            this.props.homeStore.add()
          }}>add</Button>
          <Button type={`primary`} onClick={async () => {
            const datas = await this.props.homeStore.requestServer()
            alert(JSON.stringify(datas))
          }}>test</Button>
        </header>
      </div>
    );
  }
}
