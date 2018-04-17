# Blockstack starter with React and Redux Bundler

![Built on Blockstack](https://img.shields.io/badge/Built%20on-Blockstack-643B6A.svg)

[![Deploy to now](https://deploy.now.sh/static/button.svg)](https://deploy.now.sh/?repo=https://github.com/aulneau/react-blockstack-redux-bundler)

Live Demo - [react-blockstack.now.sh](https://react-blockstack.now.sh/)

## About this starter

This is a barebones kit that should be able to get you up and running with blockstack auth pretty quickly. [Don't know what blockstack is?](https://blockstack.org)
This starter is using the latest versions of everything it can, React, babel, webpack, etc, with some sensible defaults for bundling. For state management, it's using [redux-bundler](https://reduxbundler.com/) which is an abstraction on top of [redux](https://redux.js.org/) and [reselect](https://github.com/reactjs/reselect). State is persisted locally through [money-clip](https://github.com/HenrikJoreteg/money-clip).
[react-hot-loader](https://github.com/gaearon/react-hot-loader) is also implemented for hot module reloading (HMR) during development. [Prettier](https://prettier.io/) is used for code formatting. Format by using `yarn format`. 

#### Development

Running `yarn && yarn dev` will install dependencies and spin up the development server with HMR. [Don't have yarn?](https://yarnpkg.com/en/docs/install)

#### Production

Running `yarn build` will bundle the application for use in production.

#### Deployment

Deploy easily with [now](https://now.sh) by running `now` or use another service like heroku/digital ocean.

## About the author

[Thomas Osmonson](https://ineffable.co) is an independent designer and developer. He is the founder of [Coins](https://coinsapp.co), a _decentralized_ cryptocurrency portfolio management tool. Coins is also built with the architecture laid out in this starter kit.

###### To Do

* Integrate storage collections
* Comment all the things
* Work on blockstack.js bundle size (it's far too large)

Last updated: 04/17/2018
