import React from 'react';
import { Route, Switch } from "react-router-dom"
import Home from './home'
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
          <Route path={`/index`} component={Home} />
          <Route component={NotFound} />
        </Switch>
      </div>
    );
  }
}
