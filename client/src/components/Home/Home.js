import React from 'react';
import NewListBox from './NewListBox';
import UserLists from './UserLists';

import { Grid, Row, Col, PageHeader } from 'react-bootstrap';

export default () =>
  <Grid>
    <Col md={10} mdOffset={1} sm={10} smOffset={1}>
      <Row>
        <PageHeader>Home</PageHeader>
      </Row>
      <Row>
        <NewListBox/>
      </Row>
      <UserLists/>
    </Col>
  </Grid>;
