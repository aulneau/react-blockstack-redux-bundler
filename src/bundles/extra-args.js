import * as blockstack from 'blockstack';

export default {
  name: 'extra-args',
  getExtraArgs: (store) => {
    return {
      handleUserSignIn: (state) => {
        const signedIn = blockstack.isUserSignedIn();
        if (signedIn && state.auth && !state.auth.user) {
          return blockstack.loadUserData();
        } else if (blockstack.isSignInPending()) {
          return blockstack.handlePendingSignIn().then((data) => data);
        } else {
          return signedIn;
        }
      },
    };
  },
};
