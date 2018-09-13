import React from 'react';
import ReactDOM from 'react-dom';
import root from '@containers/root';
import getStore from './bundles';
import cache from '@common/utils/cache';

const mountNode = document.getElementById('root');

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js');
  });
}

const render = () => {
  cache.getAll().then((initialData) => {
    if (initialData && process.env.NODE_ENV === 'development') {
      console.log('starting with locally cache data:', initialData);
    }
    ReactDOM.render(root(getStore(initialData)), mountNode);
  });
};

render();

if (module.hot) {
  module.hot.accept('./containers/root', () => {
    ReactDOM.unmountComponentAtNode(mountNode);
    render();
  });
}
