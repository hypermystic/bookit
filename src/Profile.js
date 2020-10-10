import React, { useEffect, useState } from 'react'
import { Avatar, Layout, Drawer } from 'antd'
import { auth, db } from "./firebaseConfig";

import { PlusOutlined } from "@ant-design/icons";

const { Sider, Content } = Layout;

function Profile() {

    const [currentUser, setCurrentUser] = useState('');
    const [books, setBooks] = useState([]);
    const [visibleDrawer, setVisibleDrawer] = useState(false);

    const bookArr = []

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
        }).then(() => setBooks([...bookArr]));
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((authUser) => {
          if (authUser) {
            
            setCurrentUser(authUser);
            loadBooksData(authUser);

          } else {
            window.location.replace("https://todo-7e79c.web.app/signup");
          }
        });
        return () => {
          unsubscribe();
        };
    }, []);


    return (
        <div>
            <Layout style={{width: '100vw', height: '100vh'}}>
                <Sider style={{backgroundColor: 'white', borderRight: '1px solid lightgray'}}>
                    <center>
                        <Avatar
                            size={120}
                            src={auth.currentUser ? auth.currentUser.photoURL : ""}
                            style={{ marginBottom: "10px", marginTop: "30px" }}
                        >
                        </Avatar>
                    </center>
                </Sider>
                <Content style={{backgroundColor: 'white', padding: '20px'}}>
                    <h1 style={{fontSize: '70px'}}>Books</h1>
                    <div style={{display: 'flex'}}>
                        {
                            books.map((book) => (
                            <div 
                                onClick={showDrawer}
                                style={{ display: 'flex', width: '150px', height: '150px', border: '1px solid lightgray', margin: '5px', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'}}>{book.title}</div>
                            ))
                        }
                        <div style={{ display: 'flex', width: '150px', height: '150px', border: '1px dashed lightgray', fontSize: '70px', margin: '5px', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'}}><PlusOutlined style={{color: 'darkgray'}}/></div>
                    </div>
                </Content>
            </Layout>
            <Drawer
                title="Books"
                placement="right"
                closable={false}
                onClose={onCloseDrawer}
                visible={visibleDrawer}
                width="400px"
                >

                    

            </Drawer>
        </div>
    )
}

export default Profile
