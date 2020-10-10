import React from 'react';
import ReactDOM from 'react-dom';
import { Route, BrowserRouter as Router } from 'react-router-dom';

import App from 'App';
import Signup from 'views/Signup';
import Profile from 'views/Profile';

import './index.css';
import 'antd/dist/antd.css';

const routing = (
  <Router>
    <Route exact path='/signup' component={Signup} />
    <Route exact path='/profile' component={Profile} />
    <Route exact path='/' component={App} />
    <Route path='/?key=:id' component={App} />
  </Router>
);

ReactDOM.render(routing, document.getElementById('root'));
