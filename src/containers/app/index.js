import React, { PureComponent } from 'react';
import { connect } from 'redux-bundler-react';
import navHelper from 'internal-nav-helper';
import { createGlobalStyle } from 'styled-components';
import { normalize } from 'polished';
import { hot } from 'react-hot-loader';

const GlobalStyle = createGlobalStyle`
  ${normalize()};
`;

class Index extends PureComponent {
  componentWillMount() {
    this.handleRedirect();
  }
  componentDidMount() {
    this.handleRedirect();

    const loading = document.getElementById('loader');
    if (!loading.classList.contains('hidden')) {
      loading.classList.add('hidden');
    }
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
    return (
      <div onClick={navHelper(doUpdateUrl)}>
        <GlobalStyle />
        {signedInPending ? null : <Page />}
      </div>
    );
  }
}

export default hot(module)(
  connect(
    'doUpdateUrl',
    'selectRoute',
    'selectPathname',
    'selectSignedIn',
    'selectSignedInPending',
    Index,
  ),
);
