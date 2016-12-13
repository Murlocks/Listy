import React from 'react';

import { Modal, Button } from 'react-bootstrap';

export default ({ show, close, confirm, data }) =>
  <Modal show={show} onHide={close} >
    <Modal.Header closeButton>
      <Modal.Title>Delete Confirmation</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <h4>
        This action is irriversable (for now...), really delete list: {data}?
      </h4>
    </Modal.Body>
    <Modal.Footer>
      <Button onClick={confirm}>CONFIRM</Button>
    </Modal.Footer>
  </Modal>;
