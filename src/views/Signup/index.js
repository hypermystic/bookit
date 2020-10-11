import React from 'react';

import { auth, signInWithGoogle } from 'firebaseConfig';
import { Redirect, Route } from 'react-router-dom';

import { GoogleOutlined } from '@ant-design/icons';
import { Button } from 'antd';

import 'antd/dist/antd.css';
import './Signup.css';

class Signup extends React.Component {
  constructor() {
    super();

    this.state = {
      currentUser: null,
    };
  }

  unsubscribeFromAuth = null;

  componentDidMount() {
    this.unsubscribeFromAuth = auth.onAuthStateChanged((user) => {
      this.setState({ currentUser: user });
    });
  }

  componentWillUnmount() {
    this.unsubscribeFromAuth();
  }

  render() {
    return (
      <div className='signin__btn'>
        {this.state.currentUser ? (
          <Redirect to="/" />
        ) : (
          <Button size='middle' onClick={signInWithGoogle} icon={<GoogleOutlined />}>
            Sign In
          </Button>
        )}
      </div>
    );
  }
}

export default Signup;
