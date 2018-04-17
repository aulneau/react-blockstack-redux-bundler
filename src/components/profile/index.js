import React from 'react';
import { connect } from 'redux-bundler-react';

const Profile = ({ user, doSignOut, doSignIn }) => {
  if (user) {
    return (
      <>
        {user.profile.image &&
          user.profile.image.length && (
            <img src={user.profile.image[0].contentUrl} />
          )}
        <div>
          Welcome {user.username || 'Nameless User'}, you are logged in with
          blockstack!
        </div>
        <div style={{ paddingTop: '25px' }}>
          <button onClick={() => doSignOut()}>Sign out</button>
        </div>
      </>
    );
  }
  return (
    <>
      <div>Welcome! You are not signed in, please sign in below.</div>
      <div style={{ paddingTop: '25px' }}>
        <button onClick={() => doSignIn()}>Sign in with Blockstack</button>
      </div>
    </>
  );
};

export default connect('selectUser', 'doSignOut', 'doSignIn', Profile);
