import React from 'react';
import PropTypes from 'prop-types';
import { hot } from 'react-hot-loader';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import favicon from 'assets/images/favicon.ico';
import ConnectedRoot from 'components/connectedRoot';
import ErrorBoundary from 'components/errorBoundary';
import getRoots from 'selectors/getRoots';

import styles from './app.css';

const App = (props) => (
  <ErrorBoundary>
    <Helmet>
      <link rel="shortcut icon" href={favicon} />
    </Helmet>
    <div className={styles.wrapper}>
      {props.roots.map((name) => (
        <ConnectedRoot key={name} name={name} />
      ))}
    </div>
  </ErrorBoundary>
);

App.propTypes = {
  roots: PropTypes.arrayOf(PropTypes.string).isRequired,
};

const mapStateToProps = (state) => ({
  roots: getRoots(state),
});

const hotReload = hot(module);
const wrapWithStyles = withStyles(styles);
const withRedux = connect(mapStateToProps);
export default hotReload(wrapWithStyles(withRedux(App)));
