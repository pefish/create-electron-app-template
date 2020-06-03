import React from 'react';
import { inject, observer } from 'mobx-react';
import './home.css'
import {
  Menu,
  Icon,
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

  _renderContent() {
    if (this.props.homeStore!.selectedMenu === `default`) {
      return (
        <div className="home" style={{
          flex: 1,
          display: `flex`,
          flexDirection: `column`,
        }}>
          <span style={{
            color: "black"
          }}>
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
      )
    } else {
      return <span>nothing</span>
    }
  }

  render() {
    return (
      <div className={`display_flex flex1 flex_direction_row`} style={{
        marginTop: 5,
        borderTopStyle: `solid`,
        borderTopWidth: 1,
        borderTopColor: `#2500001f`,
      }}>
        <div style={{ minWidth: 200, maxWidth: 200, flex: 2 }}>
          <Menu
            defaultSelectedKeys={[this.props.homeStore!.selectedMenu]}
            defaultOpenKeys={['sub1']}
            mode="inline"
            inlineCollapsed={false}
            style={{
              height: `100%`,
            }}
            onSelect={({ key }) => {
              this.props.homeStore!.selectedMenu = key
            }}
          >
            <Menu.Item key="default">
              <Icon type="alipay" />
              <span>Default</span>
            </Menu.Item>
          </Menu>
        </div>
        <div className={`display_flex flex1`}>
          {this._renderContent.bind(this)()}
        </div>
      </div>
    )
  }
}
