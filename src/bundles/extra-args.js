export default {
  name: 'extra-args',
  getExtraArgs: (store) => {
    return {
      handleUserSignIn: async (state) => {
        const blockstack = await import(/* webpackChunkName: "blockstack.18.1.0" */ 'blockstack');
        const signedIn = blockstack.isUserSignedIn();
        if (signedIn && state.auth && !state.auth.user) {
          return blockstack.loadUserData();
        } else if (blockstack.isSignInPending()) {
          return blockstack.handlePendingSignIn().then((data) => data);
        } else {
          return state.auth.user;
        }
      },
    };
  },
};
