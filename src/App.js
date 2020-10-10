import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import ReactDOM, { unmountComponentAtNode } from "react-dom";
import {
  Layout,
  Divider,
  Tree,
  Button,
  Drawer,
  Form,
  Input,
  Breadcrumb,
  Alert,
  Avatar,
  Tooltip,
} from "antd";

import Editor from 'react-medium-editor';

import "antd/dist/antd.css";

import { auth, db } from "./firebaseConfig";
import { v4 as uuidv4 } from "uuid";

import "./App.css";

import {
  CarryOutOutlined,
  PlusOutlined,
  FileAddOutlined,
  SaveOutlined,
} from "@ant-design/icons";




const { Sider, Header } = Layout;
const { DirectoryTree } = Tree;
const { TextArea } = Input;

const treeArr = [];

const editorOptions = {
  placeholder: {
    text: "Start your Chapter from here...",
    hideOnClick: true,
  },
  toolbar: {
    allowMultiParagraphSelection: true,
    buttons: [
      "bold",
      "italic",
      "underline",
      "anchor",
      "h2",
      "h3",
      "quote",
      "strikethrough",
      "unorderedlist",
      "orderedlist",
      "pre",
    ],
    diffLeft: 0,
    diffTop: -10,
    firstButtonClass: "medium-editor-button-first",
    lastButtonClass: "medium-editor-button-last",
    relativeContainer: null,
    standardizeSelectionStart: false,
    static: false,
    align: "center",
    sticky: false,
    updateOnEmptySelection: false,
  },
}

// Function Starts here

function App() {
  // Variables Defined here
  let history = useHistory();
  const [drawerVisible, setDrawerVisible] = useState(false);

  const [currentUser, setCurrentUser] = useState(null);

  const [treeData, setTreeData] = useState([]);

  const [currentFile, setCurrentFile] = useState("");
  const [currentFolder, setCurrentFolder] = useState("");

  const [fileContent, setFileContent] = useState('');

  const [currentBook, setCurrentBook] = useState({key: '', isLeaf: false});

  const [alert, setAlert] = useState({message: null, type: null, show: false});

  // Function loading the File structure on the first reload

  const loadFileStructure = (authUser) => {
    db.collection(authUser.email)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          treeArr.push({
            title: doc.data().name,
            key: doc.data().uid,
            children: doc.data().children,
          });
        });
      })
      .then(() => setTreeData([...treeArr]));
  };

  // Checking the current user state

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // logged in
        setCurrentUser(authUser);
        loadFileStructure(authUser);
      } else {
        window.location.replace("https://todo-7e79c.web.app/signup");
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {

        const queryString = window.location.search;

        const urlParams = new URLSearchParams(queryString);
        const key = urlParams.get('key')
        if(key != null)
        db.collection('content').doc(key)
        .get()
        .then((doc) => {
          if(doc.exists){
            setFileContent(doc.data().content);
          }else{

            setFileContent('');
          }
        });

  }, [window.location.search])

  // Function related to the right drawer

  const showDrawer = () => {
    setDrawerVisible(true);
  };

  const onClose = () => {
    setDrawerVisible(false);
  };

  const onFormFinish = (values) => {

    let uid = uuidv4();

    let obj = { title: values.bookname, key: uid, children: [] };

    db.collection(currentUser.email)
      .add({
        name: values.bookname,
        description: values.bookdesc ? values.bookdesc : "",
        children: [],
        uid: uid,
      })
      .then(() => {
        var tempArr = [...treeData];
        tempArr.push(obj);
        setTreeData([...tempArr]);
      })
      .then(() => {
        setDrawerVisible(false);
      })
      .catch((e) => {
        console.log("Something happend", e);
      });
  };

  // Function related to the tree structure

  const onSelect = (keys, event) => {


    if (!event.node.isLeaf) {

      setCurrentBook({key: keys[0], isLeaf: false});

      const addFolderDrawer = (e) => {

        var file = prompt("Please Enter the file name");
        if (file != null) {
          const updateFolderData = (data, id) => {
            let tempFile = [...data.children];
            tempFile.push({ title: file, key: uuidv4(), isLeaf: true });

            db.collection(currentUser.email)
              .doc(id)
              .update({
                children: [...tempFile],
              })
              .then(() => {
                window.location.reload();
              });
          };

          db.collection(currentUser.email)
            .where("uid", "==", keys[0])
            .get()
            .then(function (querySnapshot) {
              querySnapshot.forEach(function (doc) {
                updateFolderData(doc.data(), doc.id);
              });
            })
            .catch(function (error) {
              console.log("Error getting documents: ", error);
            });
        }
      };

      const fileBtn = (
        <Button
          style={{ marginTop: "10px", width: "90%" }}
          value={keys}
          icon={<FileAddOutlined />}
          onClick={addFolderDrawer}
        >
          Create File
        </Button>
      );
      ReactDOM.render(fileBtn, document.getElementById("fileBtn"));
    } else {
      history.push('/keys/?key='+keys[0]);
      setCurrentBook({key: event.node.key, isLeaf: true});
      unmountComponentAtNode(document.getElementById("fileBtn"));
      setCurrentFile(event.node.title);

      // let editor = new MediumEditor(".editable", editorOptions);
      // editor.subscribe('editableInput', function (event, editable) {
      //   content = editable;
      // });
    }
  };

  const saveFileContent = () => {

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const key = urlParams.get('key')
    db.collection('content').doc(key).set({
      content: fileContent
    })
    setAlert({type: 'success', message: 'Saved Successfully', show: true});
  }

  const onExpand = (keys, event) => {
    if (currentFolder !== event.node.title) {
      setCurrentFile("");
      setCurrentFolder(event.node.title);
    }
  };

  const downloadPdf = () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const key = urlParams.get('key')
    db.collection('content').doc(key).get().then((doc)=>{
      if (doc.exists) {
          console.log("Document data:", doc.data());
        
      } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
      }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    })
    
  }

  // body for the drawer

  const body = (
    <Form name="basic" layout="vertical" onFinish={onFormFinish}>
      <Form.Item
        label="Book Name"
        name="bookname"
        rules={[{ required: true, message: "Please enter the book name" }]}
      >
        <Input style={{ width: "90%", height: "45px" }} />
      </Form.Item>

      <Form.Item
        label="Book Description"
        name="bookdesc"
        rules={[{ required: false, message: "Enter description for the book" }]}
      >
        <TextArea rows={8} style={{ width: "90%" }} />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );

  // Main App Structure

  return (
    <div className="app__container">
      <Drawer
        width={500}
        placement="right"
        closable={false}
        onClose={onClose}
        visible={drawerVisible}
      >
        {body}
      </Drawer>
      <Layout style={{ height: "100%" }}>
        <Sider style={{ backgroundColor: "#F6F9FC" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-evenly",
              cursor: "pointer"
            }}
            onClick={() => {window.location.href = "http://" + window.location.host + "/profile";}}
          >
            <Avatar
              size={40}
              src={auth.currentUser ? auth.currentUser.photoURL : ""}
              style={{ marginBottom: "10px", marginTop: "10px" }}
            />
            <p
              style={{
                alignItems: "center",
                marginTop: "13px",
                color: "#959698",
                fontWeight: "bolder",
                fontSize: "15px",
              }}
            >
              {auth.currentUser ? auth.currentUser.displayName : "Writer"}
            </p>
          </div>
          <Divider
            className="app__sider__divider"
            style={{ marginBottom: "24px", marginTop: "0px" }}
          />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <p
              style={{
                letterSpacing: "2px",
                color: "#959698",
                fontWeight: "bolder",
                fontSize: "13px",
                marginLeft: "10%",
              }}
            >
              Books
            </p>
            <Tooltip placement="topLeft" title="New Book">
              <Button
                size="small"
                icon={<PlusOutlined />}
                onClick={showDrawer}
                style={{ backgroundColor: "transparent", marginRight: "10%" }}
              ></Button>
            </Tooltip>
          </div>
          <div style={{ width: "100%", align: "center" }}>
            <DirectoryTree
              multiple
              defaultExpandAll
              switcherIcon={<CarryOutOutlined />}
              onSelect={onSelect}
              onExpand={onExpand}
              treeData={treeData}
              className="app__tree"
            />
          </div>
        </Sider>
        <Layout id="main_EDITOR" style={{ backgroundColor: "white" }}>
          <Header style={{ height: "35px", backgroundColor: "white" }}>
            <Breadcrumb
              style={{
                marginTop: "13px",
                marginLeft: "10px",
                marginBottom: "13px",
              }}
            >
              <Breadcrumb.Item>You are editing</Breadcrumb.Item>
              {currentFolder !== "" ? (
                <Breadcrumb.Item>{currentFolder}</Breadcrumb.Item>
              ) : (
                ""
              )}
              {currentFile !== "" ? (
                <Breadcrumb.Item>{currentFile}</Breadcrumb.Item>
              ) : (
                ""
              )}
            </Breadcrumb>
          </Header>
          {currentBook.isLeaf?(<Editor 
            style={{
              width: "100%",
              height: "98vh",
              marginTop: "10px",
              outline: 0,
              paddingTop: "100px",
              paddingLeft: "100px",
              paddingRight: "100px",
              fontSize: "20px",
              overflow: "scroll",
            }}
            text={fileContent}
            onChange={(e) => {setFileContent(e);}}
            options={editorOptions}
          />):''}
          
        </Layout>
        <Sider style={{ backgroundColor: "#F6F9FC", textAlign: "center" }}>
          <div id="fileBtn"></div>
          <div id="saveBtn">
            {currentBook.isLeaf?(<Button
              type="primary"
              style={{ marginTop: "10px", width: "90%" }}
              icon={<SaveOutlined />}
              onClick={saveFileContent}
            >
            Save File
          </Button>): ''}
          </div>
          <div id="showAlert">
          {alert.show?(<Alert
            style={{
              position: "absolute",
              top: "10px",
              right: "500px",
              width: "200px",
            }}
            message={alert.message}
            type={alert.type}
            showIcon
            closable
            afterClose={() => setAlert({type: 'success', message: 'Saved Successfully', show: false})}
          />):''}
          </div>
          {
            currentBook.isLeaf?(<Button style={{ marginTop: "10px", width: "90%" }} onClick={downloadPdf}>Download File</Button>):''
          }
        </Sider>
      </Layout>
    </div>
  );
}

export default App;
