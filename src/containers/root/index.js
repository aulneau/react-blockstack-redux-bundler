import React from 'react';
import { Provider } from 'redux-bundler-react';
import App from '@containers/app/index';

const Index = (store) => (
  <Provider store={store}>
    <App />
  </Provider>
);
export default Index;
