import React from 'react';
import { connect } from 'react-redux';
import { compose, withState, withHandlers, lifecycle, defaultProps } from 'recompose';
import userActions, { clearStatus } from '../actions/auth';
import Loadable from './Loadable';

import { Col, Button } from 'react-bootstrap';
import FieldGroup from './FieldGroup';

const _Login = props =>
  <Col xs={8} md={4} mdOffset={4} xsOffset={2}>
    <form>
      <h3>Log in to view to view your lists!</h3>
      { props.statusText ?
        <div className='alert alert-info'>{props.statusText}</div> : ''
      }
      <FieldGroup
        value={props.email}
        label='Email address'
        type='email'
        onChange={props.handleChange('updateUser')}
      />
      <FieldGroup
        value={props.password}
        label='Password'
        type='password'
        onChange={props.handleChange('updatePassword')}
      />
      <Button
        type='submit'
        onClick={props.login}
      >
        Submit
      </Button>
    </form>
  </Col>;

const Login = compose(
  connect(
    state => ({
      isAuthenticating: state.auth.isAuthenticating,
      statusText: state.auth.statusText,
      redirectTo: state.routing.locationBeforeTransitions.query.redirect
    }), {
      clearStatus,
      authenticate: userActions.authenticate,
      login: userActions.login,
    }
  ),
  lifecycle({
    componentWillMount: function () {
      let { clearStatus, authenticate, redirectTo } = this.props;
      clearStatus();
      if (localStorage['token'])
        authenticate(localStorage['token'], redirectTo);
    }
  }),
  Loadable(({ isAuthenticating }) => isAuthenticating),
  defaultProps({ redirectTo: '/' }),
  withState('user', 'updateUser', ''),
  withState('password', 'updatePassword', ''),
  withHandlers({
    handleChange: props => update => e =>
      props[update](e.target.value),
    login: ({ login, user, password, redirectTo }) => e => {
      e.preventDefault();
      login(user, password, redirectTo);
    }
  })
)(_Login);

export default Login;
