import firebase from 'firebase/app';
import '@firebase/auth';
import '@firebase/firestore';
import 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyAvLLi1-MRHmPYqEKTtOb7fvfsD9JeZCN4",
  authDomain: "todo-7e79c.firebaseapp.com",
  databaseURL: "https://todo-7e79c.firebaseio.com",
  projectId: "todo-7e79c",
  storageBucket: "todo-7e79c.appspot.com",
  messagingSenderId: "1026324083394",
  appId: "1:1026324083394:web:3b3d89452693e521",
  measurementId: "G-SJDG2007DN"
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();

export const auth = firebase.auth();
export const db = firebase.app().firestore();

const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });
export const signInWithGoogle = () => auth.signInWithPopup(provider);

export default firebase;
