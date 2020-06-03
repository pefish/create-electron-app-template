import React from 'react';
import { inject, observer } from 'mobx-react';
import './home.css'
import {
  Menu,
  Icon,
  Button,
  Select,
  Input,
} from 'antd';
import HomeStore from '../store/home_store';
import CommonStore from '../store/common_store';
const Option = Select.Option
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
    } else if (this.props.homeStore!.selectedMenu === `default1`) {
      return (
        <div className={'flex1 flex_direction_column display_flex'} style={{
          padding: 10,
          width: 1160,
          height: 760,
        }}>
          <div className={'flex_direction_row display_flex'}>
            <Select
              value={this.props.homeStore!.selectedClass}
              style={{ width: 120, marginRight: 10, }}
              placeholder="类别"
              loading={false}
              onChange={(v) => {
                console.log(v)
                this.props.homeStore!.selectedClass = v
              }}
            >
              {["a","b","c"].map((data) => {
                return <Option value={data}>{data}</Option>
              })}
            </Select>
            <Input addonBefore="ID" value={this.props.homeStore!.txid} style={{
              width: 500,
              marginRight: 10,
            }} onChange={(e) => this.props.homeStore!.txid = e.target.value} />
            <Button type="primary" onClick={() => {
              // this.props.homeStore!.doSth()
              alert(`成功`)
            }} style={{ marginRight: 10 }}>确定</Button>
          </div>
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
            <Menu.Item key="default1">
              <Icon type="alipay" />
              <span>Default1</span>
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
