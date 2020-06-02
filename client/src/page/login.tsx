import React, { Component } from 'react';
import { Button, Input } from 'antd';
import { withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react';
import CommonStore from '../store/common_store';
import LoginStore from '../store/login_store';


@inject('commonStore', 'loginStore')
@(withRouter as any)
@observer
class Login extends Component<{
  commonStore?: CommonStore,
  loginStore?: LoginStore,
  history?: any,
  [x: string]: any,
}, any> {
  componentDidMount() {
    this.props.loginStore!.startTimer()
  }

  componentWillUnmount() {
    this.props.loginStore!.stopTimer()
  }

  render() {
    // console.log(123, this.props, this.props.loginStore.isAuthenticated)
    return (
      <div className={'drag display_flex'} style={{
        flex: 1,
        alignItems: `center`,
        justifyContent: `flex-end`,
        backgroundColor: `rgba(${this.props.loginStore!.r},${this.props.loginStore!.g},${this.props.loginStore!.b}, ${this.props.loginStore!.a})`,
      }}>
        <div className={'display_flex'} style={{
          flex: 1,
          height: 300,
          paddingRight: 60
        }}>
          <div className={'display_flex'} style={{
            flex: 1,
            alignItems: `center`,
            justifyContent: `center`
          }}>
            <span style={{
              fontSize: 70,
              color: `white`
            }}>{this.props.commonStore!.configs.pages.login.title}</span>
          </div>
          <div className={'display_flex'} style={{
            backgroundColor: `white`,
            width: 300,
            boxShadow: `10px 10px 5px #888888`,
            borderRadius: 5,
            flexDirection: 'column',
            paddingLeft: 20,
            paddingRight: 20,
            justifyContent: 'center',
            alignItems: `center`,
          }}>
            <Input style={{
              width: 240,
            }} placeholder="用户名" onChange={(e) => {
              this.props.loginStore!.username = e.target.value
            }} />
            <Input.Password style={{
              marginTop: 10,
              width: 240,
            }} placeholder="密码" onChange={(e) => {
              this.props.loginStore!.password = e.target.value
            }} />
            <Button
              loading={this.props.commonStore!.globalLoading}
              style={{
                height: 34,
                marginTop: 40,
                width: 240,
              }}
              type={`primary`}
              size={`small`}
              onClick={async () => {
                await this.props.loginStore!.authenticate()
                this.props.history!.replace('/home')
              }}
            >登录</Button>
          </div>
        </div>
      </div>
    )
  }
}

export default Login