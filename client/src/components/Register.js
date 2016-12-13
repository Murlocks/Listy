import React from 'react';
import { connect } from 'react-redux';
import { compose, withState, withHandlers, lifecycle, defaultProps } from 'recompose';
import userActions, { clearStatus, registerUserFailure } from '../actions/auth';
import Loadable from './Loadable';

import { Col, FormGroup, FormControl, Button } from 'react-bootstrap';
import FieldGroup from './FieldGroup';

const _Register = props =>
  <Col xs={8} md={4} mdOffset={4} xsOffset={2}>
    <form>
      <h3>Register below to start using Listy!</h3>
      { props.statusText ?
        <div className='alert alert-info'>{props.statusText}</div> : ''
      }
      <FieldGroup
        value={props.email}
        label='Email address'
        type='user'
        onChange={props.handleChange('updateUser')}
      />
      <FormGroup
        validationState={props.validate()}
      >
        <FieldGroup
          value={props.password}
          label='Password'
          type='password'
          onChange={props.handleChange('updatePassword')}
        />
        <FieldGroup
          value={props.passwordVer}
          label='Password Verification'
          type='password'
          onChange={props.handleChange('updatePasswordVer')}
        />
        <FormControl.Feedback />
      </FormGroup>
      <Button
        type='submit'
        onClick={props.register}
      >
        Submit
      </Button>
    </form>
  </Col>;

const getValidationState = (password, passwordVer) => {
  if (!password || !passwordVer)
    return null;
  return password === passwordVer ? 'success' : 'error';
};

const Register = compose(
  connect(
    state => ({
      isAuthenticating: state.auth.isAuthenticating,
      statusText: state.auth.statusText
    }), {
      clearStatus,
      authenticate: userActions.authenticate,
      register: userActions.register,
      failValidation: registerUserFailure.bind(null, {
        response: {
          status: 412,
          statusText: 'Password validation does not match'
        }
      })
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
  withState('passwordVer', 'updatePasswordVer', ''),
  withHandlers({
    handleChange: props => update => e =>
      props[update](e.target.value),
    register: (props) => e => {
      let { user, password, passwordVer, redirectTo } = props;
      let { failValidation, register } = props;
      e.preventDefault();
      if (getValidationState(password, passwordVer) === 'success')
        register(user, password, redirectTo);
      else failValidation();
    },
    validate: ({ password, passwordVer }) => () =>
      getValidationState(password, passwordVer)
  })
)(_Register);

export default Register;
