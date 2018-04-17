import React from 'react';
import Profile from '@components/profile';
import { Link } from 'react-router-dom';

export default () => (
  <div>
    <h1>Homepage</h1>
    <Profile />
    <Link to="/private">
      <button>A private page</button>
    </Link>
  </div>
);
