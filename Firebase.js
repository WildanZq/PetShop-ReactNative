import * as firebase from 'firebase';
import firestore from 'firebase/firestore'

const config = {
  apiKey: "AIzaSyBLDy6tgHdR6r-WcwVYe4oqO6ivQw15buI",
  authDomain: "coba-af1a4.firebaseapp.com",
  databaseURL: "https://coba-af1a4.firebaseio.com",
  projectId: "coba-af1a4",
  storageBucket: "coba-af1a4.appspot.com",
  messagingSenderId: "915425011317"
};
firebase.initializeApp(config);

firebase.firestore();

export default firebase;
