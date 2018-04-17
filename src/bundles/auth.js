const SIGN_IN_SUCCESS = 'auth/SIGN_IN_SUCCESS';
const SIGN_IN_ERROR = 'auth/SIGN_IN_ERROR';
const SIGN_OUT = 'auth/SIGN_OUT';
import { createSelector } from 'redux-bundler';

import { redirectToSignIn, signUserOut } from 'blockstack';

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
    const user = await handleUserSignIn(getState());
    dispatch({
      type: SIGN_IN_SUCCESS,
      user,
    });
  },
  doSignIn: () => () => {
    redirectToSignIn();
  },
  doSignOut: () => ({ dispatch }) => {
    signUserOut();
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
