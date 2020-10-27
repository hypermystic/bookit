import React from 'react';

import { auth, signInWithGoogle, signInWithFacebook, signInWithTwitter } from 'firebaseConfig';
import { Redirect, Route } from 'react-router-dom';

import { GoogleOutlined, FacebookOutlined, TwitterOutlined } from '@ant-design/icons';
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
          <Redirect to='/' />
        ) : (
          <div className='bt_group'>
            <Button size='middle' onClick={signInWithGoogle} icon={<GoogleOutlined />}>
              Sign In
            </Button>

            <Button size='middle' onClick={signInWithFacebook} icon={<FacebookOutlined />}>
              Sign In
            </Button>

            <Button size='middle' onClick={signInWithTwitter} icon={<TwitterOutlined />}>
              Sign In
            </Button>
          </div>
        )}
      </div>
    );
  }
}

export default Signup;
