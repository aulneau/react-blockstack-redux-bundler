import React from 'react';
import { connect } from 'redux-bundler-react';

const SignIn = ({ doSignIn }) => (
  <div>
    <h1>Sign In!</h1>
    <div>
      <button onClick={() => doSignIn()}>Sign In</button>
    </div>
  </div>
);
export default connect('doSignIn', SignIn);
