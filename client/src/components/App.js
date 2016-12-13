import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { push } from 'react-router-redux';
import { compose, withHandlers } from 'recompose';
import DevTools from './DevTools';
import userActions from '../actions/auth';

import { Navbar, Nav, NavItem } from 'react-bootstrap';

const _App = ({ user, register, login, logout, children }) =>
  <div>
    <Navbar staticTop inverse>
      <Navbar.Header>
        <Navbar.Brand>
          <Link to={'/'}>Listy</Link>
        </Navbar.Brand>
        <Navbar.Toggle />
      </Navbar.Header>
      <Navbar.Collapse>
        <Nav pullRight>
          {user.isAuthenticated &&
            <NavItem onClick={logout}>logout</NavItem>
          }
          {!user.isAuthenticated &&
            <NavItem onClick={register}>register</NavItem>
          }
          {!user.isAuthenticated &&
            <NavItem onClick={login}>login</NavItem>
          }
        </Nav>
      </Navbar.Collapse>
    </Navbar>

    {!window.devToolsExtension && process.env.NODE_ENV === 'development' &&
      <DevTools />
    }

    {children}
  </div>;

const App = compose(
  connect(
    state => ({
      user: state.auth
    }), {
      push,
      logout: userActions.logout
    }
  ),
  withHandlers({
    register: ({ push }) => () =>
      push('/register'),
    login: ({ push }) => () =>
      push('/login')
  })
)(_App);

export default App;
