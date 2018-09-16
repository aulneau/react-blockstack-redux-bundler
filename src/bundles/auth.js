import { IS_ELECTRON } from '@common';

const SIGN_IN_SUCCESS = 'auth/SIGN_IN_SUCCESS';
const SIGN_IN_ERROR = 'auth/SIGN_IN_ERROR';
const SIGN_OUT = 'auth/SIGN_OUT';
import { createSelector } from 'redux-bundler';

const initialState = {
  signedIn: false,
  user: null,
};

export default {
  name: 'auth',
  getReducer: () => {
    return (state = initialState, action) => {
      switch (action.type) {
        case SIGN_IN_SUCCESS:
          return {
            ...state,
            signedIn: true,
            signedInPending: false,
            user: {
              profile: action.user.profile,
              username: action.user.username,
            },
          };
        case SIGN_IN_ERROR:
          return {
            ...state,
            signedIn: false,
            user: null,
            error: action.error,
          };
        case SIGN_OUT:
          return {
            ...state,
            signedIn: false,
            user: null,
          };
        default:
          return state;
      }
    };
  },
  doHandleSignIn: () => async ({ getState, dispatch, handleUserSignIn }) => {
    if (IS_ELECTRON) {
      const electron = window.require('electron');
      const blockstack = await import(/* webpackChunkName: "blockstack.18.0.4" */ 'blockstack');
    } else {
      const user = await handleUserSignIn(getState());
      dispatch({
        type: SIGN_IN_SUCCESS,
        user,
      });
    }
  },
  doSignIn: () => async ({ dispatch }) => {
    const blockstack = await import(/* webpackChunkName: "blockstack.18.0.4" */ 'blockstack');
    if (IS_ELECTRON) {
      const electron = window.require('electron');
      const transitPrivateKey = blockstack.generateAndStoreTransitKey();
      const redirectURI = 'http://localhost:9877/callback';
      const manifestURI = 'http://localhost:9877/manifest.json';
      const scopes = blockstack.DEFAULT_SCOPE;
      const appDomain = 'http://localhost:9877';
      const authRequest = blockstack.makeAuthRequest(
        transitPrivateKey,
        redirectURI,
        manifestURI,
        scopes,
        appDomain,
      );
      let newWindow = window.open(
        `https://browser.blockstack.org/auth?authRequest=${authRequest}`,
      );
      electron.ipcRenderer.on('authResponse', async (event, authResponse) => {
        console.log(authResponse);
        const user = await blockstack.handlePendingSignIn(
          'https://core.blockstack.org/v1/names/',
          authResponse,
        );
        dispatch({
          type: SIGN_IN_SUCCESS,
          user,
        });
        newWindow.close();
      });
    } else {
      blockstack.redirectToSignIn();
    }
  },
  doSignOut: () => async ({ dispatch }) => {
    const blockstack = await import(/* webpackChunkName: "blockstack.18.0.4" */ 'blockstack');
    blockstack.signUserOut();
    dispatch({
      type: SIGN_OUT,
    });
  },
  doSignInSuccess: (user) => ({
    type: SIGN_IN_SUCCESS,
    user,
  }),
  doSignInError: (error) => ({
    type: SIGN_IN_ERROR,
    error,
  }),
  selectUser: (state) => state.auth.user,
  selectSignedIn: (state) => state.auth.signedIn,
  selectSignedInPending: createSelector(
    'selectQueryObject',
    (query) => query && query.authResponse,
  ),
  reactHandleUserSignIn: createSelector(
    'selectQueryObject',
    'selectSignedIn',
    (query, signedIn) => {
      if (!signedIn && localStorage && localStorage.getItem('blockstack')) {
        return {
          actionCreator: 'doHandleSignIn',
        };
      }
      if (!query || !query.authResponse) {
        return null;
      }

      if (query.authResponse && !signedIn) {
        return {
          actionCreator: 'doHandleSignIn',
        };
      } else if (query.authResponse && signedIn) {
        return {
          actionCreator: 'doUpdateQuery',
          args: [''],
        };
      }
    },
  ),
  persistActions: [SIGN_IN_SUCCESS, SIGN_OUT],
};
