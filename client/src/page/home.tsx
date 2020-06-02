import React from 'react';
import { inject, observer } from 'mobx-react';
import './home.css'
import {
  Button,
} from 'antd';
import HomeStore from '../store/home_store';
import CommonStore from '../store/common_store';

@inject('homeStore', 'commonStore')
@observer
export default class Home extends React.Component<{
  homeStore?: HomeStore,
  commonStore?: CommonStore,
  [x: string]: any,
}, any> {
  render() {
    return (
      <div className="home" style={{
        flex: 1,
        display: `flex`,
        flexDirection: `column`,
      }}>
        <span>
          {this.props.homeStore!.counter}
        </span>
        <Button type={`primary`} onClick={() => {
          this.props.homeStore!.add()
        }}>加计数</Button>
        <Button type={`primary`} onClick={async () => {
          const datas = await this.props.homeStore!.requestServer()
          alert(JSON.stringify(datas))
        }}>IPC请求后端</Button>
        <Button type={`primary`} onClick={async () => {
          const datas = await this.props.homeStore!.netRequestServer()
          alert(JSON.stringify(datas))
        }}>网络请求百度</Button>
      </div>
    );
  }
}
