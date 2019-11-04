import React from 'react';
import { inject, observer } from 'mobx-react';
import './home.css'
import {
  Button, Input,
} from 'antd';

@inject('homeStore')
@observer
export default class Home extends React.Component<any, any> {
  render() {
    return (
      <div className="app">
        <div style={{
          width: 300
        }}>
          <Input placeholder={`用户名`} />
          <Input placeholder={`密码`} />
          <Button type={`primary`}>登录</Button>
        </div>
        <div style={{
          display: `flex`,
          flexDirection: `column`,
          marginTop: 100
        }}>
          <span>
            {this.props.homeStore.counter}
          </span>
          <Button type={`primary`} onClick={() => {
            this.props.homeStore.add()
          }}>加计数</Button>
          <Button type={`primary`} onClick={async () => {
            const datas = await this.props.homeStore.requestServer()
            alert(JSON.stringify(datas))
          }}>IPC请求后端</Button>
          <Button type={`primary`} onClick={async () => {
            const datas = await this.props.homeStore.netRequestServer()
            alert(JSON.stringify(datas))
          }}>网络请求百度</Button>
        </div>
      </div>
    );
  }
}
