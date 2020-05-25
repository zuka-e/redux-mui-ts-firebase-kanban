import firebase from 'firebase/app';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCHBqvYjzFG8zCVjsExSDHu67feqWs-Px0',
  authDomain: 'redux-hooks-ts-mui.firebaseapp.com',
  databaseURL: 'https://redux-hooks-ts-mui.firebaseio.com',
  projectId: 'redux-hooks-ts-mui',
  storageBucket: 'redux-hooks-ts-mui.appspot.com',
  messagingSenderId: '309035683883',
  appId: '1:309035683883:web:238564e311650ff6ddda6e',
  measurementId: 'G-5HWYHG0QVG',
};

firebase.initializeApp(firebaseConfig);
export const db = firebase.firestore();

export default firebase;
