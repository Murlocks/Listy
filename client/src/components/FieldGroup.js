import React from 'react';
import { FormGroup, ControlLabel, FormControl } from 'react-bootstrap';

export default props =>
  <FormGroup controlId={props.id}>
    <ControlLabel>{props.label}</ControlLabel>
    <FormControl {...props} />
  </FormGroup>;
