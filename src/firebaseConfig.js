import firebase from 'firebase/app';
import '@firebase/auth';
import '@firebase/firestore';
import 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyCuLCITyz_Lcls05znU8-JYEsZh9gZeOaQ",
  authDomain: "bookit-8abd4.firebaseapp.com",
  databaseURL: "https://bookit-8abd4.firebaseio.com",
  projectId: "bookit-8abd4",
  storageBucket: "bookit-8abd4.appspot.com",
  messagingSenderId: "52238525209",
  appId: "1:52238525209:web:facab65e0b980fc14ddb88",
  measurementId: "G-5Y4EVCSFRW"
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();

export const auth = firebase.auth();
export const db = firebase.app().firestore();

const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });
export const signInWithGoogle = () => auth.signInWithPopup(provider);

export default firebase;
