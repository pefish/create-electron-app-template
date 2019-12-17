import React from 'react';
import { Route, Switch } from "react-router-dom"
import Home from './home'
import Test from './test'
import NotFound from './not_found'
import { inject, observer } from 'mobx-react';

@inject('commonStore')
@observer
export default class Index extends React.Component {
  render() {
    return (
      <div style={{
        width: `100%`,
        height: `100%`,
      }}>
        <Switch>
          <Route exact path={`/`} component={Home} />
          <Route exact path={`/index`} component={Home} />
          <Route exact path={`/test`} component={Test} />
          <Route component={NotFound} />
        </Switch>
      </div>
    );
  }
}
