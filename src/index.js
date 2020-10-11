import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Signup from './Signup';
import Profile from './Profile';
import Error404 from './Error404';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

const routing = (
  <Router>
    <Switch>
    <Route exact path="/signup" component={Signup} />
    <Route exact path="/profile" component={Profile} />
    <Route exact path="/" component={App} />
    <Route path="/?key=:id" component={App}/>
    <Route component={Error404} />
    </Switch>
 </Router>
)


ReactDOM.render(
  routing,
  document.getElementById('root')
);


