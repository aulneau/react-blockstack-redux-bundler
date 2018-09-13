import { getConfiguredCache } from 'money-clip';

export default getConfiguredCache({
  maxAge: 1000 * 60 * 60 * 24, // 1 day
  version: 1,
  name: 'blockstack-app-cache', // CHANGE THIS
});
