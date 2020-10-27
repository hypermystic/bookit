import React from 'react';
import ReactDOM from 'react-dom';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';

import App from 'App';
import Signup from 'views/Signup';
import Profile from 'views/Profile';
import Error404 from 'views/Error404';

import './index.css';

const routing = (
  <Router>
    <Switch>
      <Route exact path='/signup' component={Signup} />
      <Route exact path='/profile' component={Profile} />
      <Route exact path='/' component={App} />
      <Route path='/?key=:id' component={App} />
      <Route component={Error404} />
    </Switch>
  </Router>
);

ReactDOM.render(routing, document.getElementById('root'));
