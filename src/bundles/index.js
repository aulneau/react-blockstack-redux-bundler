import { composeBundles, createCacheBundle } from 'redux-bundler';
import routes from '@bundles/routes';
import auth from '@bundles/auth';
import extraArgs from '@bundles/extra-args';
import cache from '@common/utils/cache';

export default composeBundles(
  routes,
  auth,
  createCacheBundle(cache.set),
  extraArgs,
);
