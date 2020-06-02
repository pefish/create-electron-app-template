import React from 'react';
import { Route, Switch, Redirect } from "react-router-dom"
import Home from './home'
import NotFound from './not_found'
import { inject, observer } from 'mobx-react';
import Login from './login'
import LoginStore from '../store/login_store';
import CommonStore from '../store/common_store';
import {
  Spin,
} from 'antd';

@inject('commonStore', "loginStore")
@observer
export default class Index extends React.Component<{
  loginStore?: LoginStore,
  commonStore?: CommonStore,
  [x: string]: any,
}> {
  render() {
    let switchCompo = (
      <Switch>
        <Route exact path={`/`} component={Home} />
        <Route exact path={`/index`} component={Home} />
        <Route component={NotFound} />
      </Switch>
    )
    if (this.props.commonStore!.configs.pages.login.enable === true) {
      switchCompo = (
        <Switch>
          <Route exact path={`/`} component={Login} />
          <Route exact path={`/index`} component={Login} />
          <Route exact path={`/login`} component={Login} />
          <Route
            exact
            path={`/home`}
            render={props => {
              return this.props.loginStore!.isAuthenticated ? (
                <Home {...props} />
              ) : (
                  <Redirect
                    to={{
                      pathname: "/login",
                      state: { from: props.location }
                    }}
                  />
                )
            }}
          />
          <Route component={NotFound} />
        </Switch>
      )
    }

    // console.log("aaa: ", this.props.commonStore)
    return (
      <Spin style={{
        width: `100%`,
      }} tip="Loading..." spinning={this.props.commonStore!.globalLoading}>
        <div style={{
          width: `100%`,
          height: `100%`,
          display: `flex`,
        }}>
          {switchCompo}
        </div>
      </Spin>

    );
  }
}
