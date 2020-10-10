#### How to run the project

- Fork or clone the repository
- Open the root folder i.e. bookit
- Run `npm install`
- Now Create a web Firebase project by visiting the firebase website.
- Copy the firebase configs from there.
- Create a file under `src` name it `firebaseConfig.js`

- insert below lines of code into that file and replace the CONSTANTS with your actual ones which you have copied

```
import firebase from 'firebase/app';
import '@firebase/auth';
import '@firebase/firestore';


const firebaseConfig = {
    apiKey: API_KEY,
    authDomain: AUTH_DOMAIN,
    databaseURL: DATABASE_URL,
    projectId: PROJECT_ID,
    storageBucket: STORAGE_BUCKET,
    messagingSenderId: MESSAGING_SENDER_ID,
    appId: APP_ID
  };

  firebase.initializeApp(firebaseConfig);

  export const auth = firebase.auth();
  export const db = firebase.app().firestore();

  const provider = new firebase.auth.GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  export const signInWithGoogle = () => auth.signInWithPopup(provider);
  
  export default firebase;

  ```

  - Run `npm start` in the terminal