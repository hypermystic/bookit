import React, { useEffect, useState } from 'react';
import { Avatar, Layout, Drawer } from 'antd';
import { auth, db } from 'firebaseConfig';

import { PlusOutlined } from '@ant-design/icons';
import './Profile.css';

const { Sider, Content } = Layout;

function Profile() {
  const [currentUser, setCurrentUser] = useState('');
  const [books, setBooks] = useState([]);
  const [visibleDrawer, setVisibleDrawer] = useState(false);

  const bookArr = [];

  const showDrawer = () => {
    setVisibleDrawer(true);
  };

  const onCloseDrawer = () => {
    setVisibleDrawer(false);
  };

  const loadBooksData = (authUser) => {
    db.collection(authUser.email)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          bookArr.push({
            title: doc.data().name,
            key: doc.data().uid,
            children: doc.data().children,
          });
        });
      })
      .then(() => setBooks([...bookArr]));
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setCurrentUser(authUser);
        loadBooksData(authUser);
      } else {
        window.location.replace('http://localhost:3000/signup');
      }
    });
    return () => {
      unsubscribe();
    };
  });

  return (
    <div>
      <Layout style={{ width: '100vw', height: '100vh' }}>
        <Sider style={{ backgroundColor: 'white', borderRight: '1px solid lightgray' }}>
          <center>
            <Avatar
              size={120}
              src={auth.currentUser ? auth.currentUser.photoURL : ''}
              style={{ marginBottom: '10px', marginTop: '30px' }}
            ></Avatar>
          </center>
        </Sider>
        <Content style={{ backgroundColor: 'white', padding: '20px' }}>
          <h1 style={{ fontSize: '70px' }}>Books</h1>
          <div style={{ display: 'flex' }}>
            {books.map((book) => (
              <div onClick={showDrawer} className='book_title'>
                {book.title}
              </div>
            ))}
            <div className='book_title font_size' style={{border: '1px dashed lightgray'}}>
              <PlusOutlined style={{ color: 'darkgray' }} />
            </div>
          </div>
        </Content>
      </Layout>
      <Drawer
        title='Books'
        placement='right'
        closable={false}
        onClose={onCloseDrawer}
        visible={visibleDrawer}
        width='400px'
      ></Drawer>
    </div>
  );
}

export default Profile;
