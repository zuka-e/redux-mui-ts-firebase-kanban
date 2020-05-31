import { User } from 'firebase';

import firebase from '../config/firebase';

// オブザーバーの設定、'currentUser'の利用
export let currentUser: User;
firebase.auth().onAuthStateChanged((user: User | null) => {
  if (user) {
    currentUser = user;
  }
});

export const isSignedIn = () => !!currentUser;

export const isOwnedBy = (userId: string) =>
  isSignedIn() && userId === currentUser.uid;
