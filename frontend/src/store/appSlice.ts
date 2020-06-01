import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Color } from '@material-ui/lab';

import { AppThunk } from './store';
import firebase from '../config/firebase';

export type Message = {
  type: Color;
  text: string;
};

export const NotSignedInWarning: Message = {
  type: 'warning',
  text: "You aren't signed in",
};

export const PermissionError: Message = {
  type: 'error',
  text: "You don't have permission",
};

interface AppState {
  message: Message | null;
  loading: boolean;
  error: any;
}
const initialState: AppState = {
  message: null,
  loading: false,
  error: null,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    tryingToSignOut(state) {
      state.loading = true;
      state.error = null;
    },
    signOutFailure(state, action: PayloadAction<any>) {
      state.loading = false;
      state.error = action.payload;
    },
    signOutSuccess(state, action: PayloadAction<Message>) {
      state.message = action.payload;
      state.loading = false;
      state.error = null;
    },
    setMessage(state, action: PayloadAction<Message>) {
      state.message = action.payload;
    },
    deleteMessage(state) {
      state.message = null;
    },
  },
});

export const {
  tryingToSignOut,
  signOutFailure,
  signOutSuccess,
  setMessage,
  deleteMessage,
} = appSlice.actions;

export default appSlice;

export const signOut = (): AppThunk => async (dispatch) => {
  try {
    dispatch(tryingToSignOut());
    if (firebase.auth().currentUser) {
      const message = {
        type: 'success',
        text: 'Successfully signed out',
      } as Message;
      await firebase.auth().signOut();
      dispatch(signOutSuccess(message));
    } else {
      const message = {
        type: 'info',
        text: 'Already signed out',
      } as Message;
      dispatch(setMessage(message));
    }
  } catch (error) {
    dispatch(signOutFailure(error));
  }
};
