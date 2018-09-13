import React, { PureComponent } from 'react';
import { connect } from 'redux-bundler-react';
import navHelper from 'internal-nav-helper';
import { hot } from 'react-hot-loader';

class App extends PureComponent {
  componentWillMount() {
    this.handleRedirect();
  }
  componentDidMount() {
    this.handleRedirect();
  }
  componentDidUpdate() {
    this.handleRedirect();
  }

  /**
   * Redirect to sign in if not signed in
   */
  handleRedirect = () => {
    if (this.props.pathname === '/sign-in' && this.props.signedIn) {
      this.props.doUpdateUrl('/');
    }
    if (
      this.props.pathname !== '/sign-in' &&
      !this.props.signedIn &&
      !this.props.signedInPending
    ) {
      this.props.doUpdateUrl('/sign-in');
    }
  };

  render() {
    const { doUpdateUrl, route, signedInPending } = this.props;

    const Page = route;
    return !signedInPending ? (
      <div onClick={navHelper(doUpdateUrl)}>
        <Page />
      </div>
    ) : null;
  }
}

export default hot(module)(
  connect(
    'doUpdateUrl',
    'selectRoute',
    'selectPathname',
    'selectSignedIn',
    'selectSignedInPending',
    App,
  ),
);
