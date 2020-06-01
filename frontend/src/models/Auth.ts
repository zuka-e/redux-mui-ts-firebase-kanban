import { User } from 'firebase';

import firebase from '../config/firebase';

// オブザーバーの設定、'currentUser'の利用
export let currentUser: User | null;
firebase.auth().onAuthStateChanged((user: User | null) => {
  if (user) {
    currentUser = user;
  } else currentUser = null;
});

export const isSignedIn = () => !!currentUser;

export const isOwnedBy = (userId: string) => userId === currentUser?.uid;
