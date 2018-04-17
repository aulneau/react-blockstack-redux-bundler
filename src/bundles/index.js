import {
  composeBundles,
  createCacheBundle,
} from 'redux-bundler';

import auth from '@bundles/auth';
import extraArgs from '@bundles/extra-args';
import cache from '@common/utils/cache';

export default composeBundles(auth, createCacheBundle(cache.set), extraArgs);
