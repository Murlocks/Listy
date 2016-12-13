import React from 'react';
import { renderComponent, branch  } from 'recompose';
import { identity } from 'ramda';

import { Col } from 'react-bootstrap';

const Loading = () =>
  <Col md={8} mdOffset={2} sm={8} smOffset={2}>
    <h3>Loading...</h3>
  </Col>;

export default isLoading =>
  branch(
    props => isLoading(props),
    renderComponent(Loading),
    identity
  );
