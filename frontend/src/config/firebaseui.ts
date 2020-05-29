import * as firebaseui from 'firebaseui';

import firebase from './firebase';

export const uiConfig = {
  signInSuccessUrl: '/',
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
  ],
  // tosUrl and privacyPolicyUrl accept either url string or a callback function.
  tosUrl: '/#',
  privacyPolicyUrl: function () {
    window.location.assign('/#');
  },
};

const ui = new firebaseui.auth.AuthUI(firebase.auth());

export default ui;
