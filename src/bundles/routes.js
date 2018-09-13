import { createRouteBundle } from 'redux-bundler';

import HomePage from '@screens/home';
import SignInPage from '@screens/sign-in';
import PrivatePage from '@screens/private';

export default createRouteBundle({
  '/': HomePage,
  '/private': PrivatePage,
  '/sign-in': SignInPage,
});
