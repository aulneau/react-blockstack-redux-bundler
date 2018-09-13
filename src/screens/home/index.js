import React from 'react';
import Profile from '@components/profile';

export default () => (
  <div>
    <h1>Homepage</h1>
    <Profile />
    <a href="/private">
      <button>A private page</button>
    </a>
  </div>
);
