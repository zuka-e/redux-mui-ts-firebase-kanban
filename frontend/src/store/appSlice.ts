import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppThunk } from './store';
import firebase from '../config/firebase';

export type Notification = {
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
};

export const Notification = {
  NotSignedInWarning: {
    type: 'warning',
    message: "You aren't signed in",
  },
  PermissionError: {
    type: 'error',
    message: "You don't have permission",
  },
  SuccessfullyDeleted: {
    type: 'warning',
    message: 'Successfully deleted',
  },
  SuccessfullyUpdated: {
    type: 'success',
    message: 'Successfully updated',
  },
} as const;

interface AppState {
  notification: Notification | null;
  loading: boolean;
  error: any;
}
const initialState: AppState = {
  notification: null,
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
    signOutSuccess(state, action: PayloadAction<Notification>) {
      state.notification = action.payload;
      state.loading = false;
      state.error = null;
    },
    setNotification(state, action: PayloadAction<Notification>) {
      state.notification = action.payload;
    },
    deleteNotification(state) {
      state.notification = null;
    },
  },
});

export const {
  tryingToSignOut,
  signOutFailure,
  signOutSuccess,
  setNotification,
  deleteNotification,
} = appSlice.actions;

export default appSlice;

export const signOut = (): AppThunk => async (dispatch) => {
  try {
    dispatch(tryingToSignOut());
    if (firebase.auth().currentUser) {
      const notification: Notification = {
        type: 'success',
        message: 'Successfully signed out',
      };
      await firebase.auth().signOut();
      dispatch(signOutSuccess(notification));
    } else {
      const notification: Notification = {
        type: 'info',
        message: 'Already signed out',
      };
      dispatch(setNotification(notification));
    }
  } catch (error) {
    dispatch(signOutFailure(error));
  }
};
