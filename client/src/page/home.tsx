import React from 'react';
import { inject, observer } from 'mobx-react';
import './home.css'
import {
  Image, Layout, Menu, Button, Input
} from 'antd';
import { UploadOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import HomeStore from '../store/home_store';
import CommonStore from '../store/common_store';
import MyModal from "../component/my_modal";


const { Sider } = Layout;


@inject('homeStore', 'commonStore')
@observer
export default class Home extends React.Component<{
  homeStore?: HomeStore,
  commonStore?: CommonStore,
  [x: string]: any,
}, any> {

  componentDidMount() {
    this.props.homeStore!.setMediaListeners()
  }

  selectMenuContent() {
    if (this.props.homeStore!.selectedMenu === "test1") {
      return (
        <div className="menu-content">
          这是内容
        </div>
      )
    } else if (this.props.homeStore!.selectedMenu === "test2") {
      return (
        <div className="menu-content">test2</div>
      )
    } else {
      return (
        <div className="menu-content">nothing</div>
      )
    }

  }

  render() {
    return (
      <div className="app">
        <div className="suspension" style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <div className="click-div" onClick={() => {
            window.location.href = "./"
          }}>
            <span>{this.props.commonStore!.websiteSimpleTitle}</span>
          </div>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
          }}>
            <label style={{
              marginRight: 10,
              color: "red"
            }}>{this.props.commonStore!.persistenceStore.get("jwt") ? this.props.commonStore!.persistenceStore.get("username") : ""}</label>
            <div className="click-div" onClick={() => {
              if (this.props.commonStore!.persistenceStore.get("jwt")) {
                // logout
                this.props.homeStore!.loginOrLogout()
              } else {
                // login
                this.props.homeStore!.loginModalVisible = true
              }
            }}><span>{this.props.commonStore!.persistenceStore.get("jwt") ? "登出" : "登陆"}</span></div>
          </div>
        </div>
        <div className="content">
          <div className="left-space" style={{
            flex: this.props.homeStore!.isWeb ? 1 : 0
          }}></div>
          <div className="real-content">
            <div style={{
              display: "flex",
              flex: 1,
              flexDirection: "column"
            }}>
              <div className="content-header" style={{
                display: this.props.homeStore!.isWeb ? "flex" : "none"
              }}>
                <div style={{
                  display: "flex",
                  justifyContent: "left",
                  alignItems: "center"
                }}>
                  <Image
                    width={46}
                    src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                  />
                  <span style={{
                    color: "#009a61",
                    marginLeft: 10,
                    fontSize: 28
                  }}>{this.props.commonStore!.websiteSimpleTitle}</span>
                </div>
              </div>
              <Layout className="all-menu-content">
                <Sider
                  breakpoint="lg"
                  collapsedWidth="0"
                  onBreakpoint={broken => {
                    console.log(broken);
                  }}
                  onCollapse={(collapsed, type) => {
                    console.log(collapsed, type);
                  }}
                  theme="light"
                  style={{
                    backgroundColor: "#333",
                    color: "white"
                  }}
                >
                  <div className="logo" />
                  <Menu theme="dark" mode="inline" defaultSelectedKeys={[this.props.homeStore!.selectedMenu]} style={{
                    backgroundColor: "#333"
                  }} onSelect={(e) => {
                    this.props.homeStore!.setSelectedMemu(e.key as string)
                  }}>
                    <Menu.Item key="test1" icon={<UserOutlined />}>
                      test1
                    </Menu.Item>
                    <Menu.Item key="test2" icon={<VideoCameraOutlined />}>
                      test2
                    </Menu.Item>
                    <Menu.Item key="test3" icon={<UploadOutlined />}>
                      test3
                    </Menu.Item>
                    <Menu.Item key="test4" icon={<UserOutlined />}>
                      test4
                    </Menu.Item>
                  </Menu>
                </Sider>
                {this.selectMenuContent()}
              </Layout>
            </div>
          </div>
          <div className="right-space" style={{
            flex: this.props.homeStore!.isWeb ? 1 : 0
          }}></div>
        </div>
        <div className="footer">Copyright © 2020-2030 Created by PEFISH</div>

        <MyModal title={"登陆"} visible={this.props.homeStore!.loginModalVisible} onCancel={() => {
          this.props.homeStore!.loginModalVisible = false
        }}>
          <Input placeholder="用户名" addonBefore="用户名" value={this.props.homeStore!.loginUsername} onChange={(e) => {
            this.props.homeStore!.loginUsername = e.target.value
          }} />
          <Input placeholder="密码" addonBefore="密码" type={"password"} value={this.props.homeStore!.loginPassword} onChange={(e) => {
            this.props.homeStore!.loginPassword = e.target.value
          }} />
          <Button type={`primary`} onClick={() => {
            this.props.homeStore!.loginOrLogout()
          }} style={{
            marginTop: 10,
          }}>确认</Button>
        </MyModal>
      </div>
    );
  }
}
