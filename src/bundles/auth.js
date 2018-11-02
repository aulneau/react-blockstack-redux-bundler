import { createSelector } from 'redux-bundler';
import produce from 'immer';
import cache from '@common/utils/cache';

const SIGN_IN_SUCCESS = 'auth/SIGN_IN_SUCCESS';
const SIGN_IN_ERROR = 'auth/SIGN_IN_ERROR';
const SIGN_OUT = 'auth/SIGN_OUT';

const initialState = {
  signedIn: false,
  user: {},
};

export default {
  name: 'auth',
  getReducer: () => {
    return (state = initialState, { type, payload }) =>
      produce(state, (draft) => {
        switch (type) {
          case SIGN_IN_SUCCESS:
            draft.signedIn = true;
            draft.signedInPending = false;
            draft.user.profile = payload.profile;
            draft.user.username = payload.username;
            break;
          case SIGN_IN_ERROR:
            draft.signedIn = false;
            draft.user = null;
            draft.error = payload;
            break;
          case SIGN_OUT:
            draft.user = {};
            draft.signedIn = false;
            break;
        }
      });
  },
  doHandleSignIn: () => async ({ getState, dispatch, handleUserSignIn }) => {
    const user = await handleUserSignIn(getState());
    dispatch({
      type: SIGN_IN_SUCCESS,
      payload: user,
    });
  },
  doSignIn: () => async () => {
    const blockstack = await import(/* webpackChunkName: "blockstack.18.1.0" */ 'blockstack');
    blockstack.redirectToSignIn();
  },
  doSignOut: () => async ({ dispatch }) => {
    const blockstack = await import(/* webpackChunkName: "blockstack.18.1.0" */ 'blockstack');
    blockstack.signUserOut();
    cache.clear();
    dispatch({
      type: SIGN_OUT,
    });
  },
  doSignInSuccess: (user) => ({
    type: SIGN_IN_SUCCESS,
    payload: user,
  }),
  doSignInError: (error) => ({
    type: SIGN_IN_ERROR,
    payload: error,
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
