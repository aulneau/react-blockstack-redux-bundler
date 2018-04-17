import React from 'react';
import { Provider } from 'redux-bundler-react';
import App from '@containers/app';

const Root = (store) => (
  <Provider store={store}>
    <App />
  </Provider>
);
export default Root;
