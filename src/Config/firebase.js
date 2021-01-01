import firebase from "firebase/app";
import "firebase/auth"; // for authentication
import "firebase/storage"; // for storage
import "firebase/database"; // for realtime database
import "firebase/firestore"; // for cloud firestore
const firebaseConfig = {
  apiKey: "AIzaSyCnYrssTTbTSjJZL1lFz0ehSaHikoQSUg0",
  authDomain: "shopping-list-7616b.firebaseapp.com",
  projectId: "shopping-list-7616b",
  storageBucket: "shopping-list-7616b.appspot.com",
  messagingSenderId: "156962899235",
  appId: "1:156962899235:web:0942979d45682b79b2f896",
  measurementId: "G-F13NHHJP2L",
};

firebase.initializeApp(firebaseConfig);
export const storage = firebase.storage();
firebase.firestore();

export default firebase;
