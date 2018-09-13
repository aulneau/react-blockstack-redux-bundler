import { createRouteBundle } from 'redux-bundler';
import Loadable from 'react-loadable';

const HomePage = Loadable({
  loader: () => import(/* webpackChunkName: 'HomePage' */ '@screens/home'),
  loading: () => null,
  delay: 500,
});
const SignInPage = Loadable({
  loader: () => import(/* webpackChunkName: 'SignInPage' */ '@screens/sign-in'),
  loading: () => null,
  delay: 500,
});
const PrivatePage = Loadable({
  loader: () =>
    import(/* webpackChunkName: 'PrivatePage' */ '@screens/private'),
  loading: () => null,
  delay: 500,
});

HomePage.preload();
SignInPage.preload();
PrivatePage.preload();

export default createRouteBundle({
  '/': HomePage,
  '/private': PrivatePage,
  '/sign-in': SignInPage,
});
