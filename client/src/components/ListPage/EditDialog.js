import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers, withState } from 'recompose';
import { click, setCurrentId } from '../../actions/ListPage';
import listActions from '../../actions/list';

import { Modal, FormControl, Button } from 'react-bootstrap';

const _EditDialog = props =>
  <Modal
    show={props.doubleClicked}
    onHide={props.handleClick}
    onEnter={props.initData}
  >
    <Modal.Header closeButton>
      <Modal.Title>Edit Item</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <FormControl
        componentClass='textarea'
        value={props.data}
        onChange={props.handleChange}
      />
    </Modal.Body>
    <Modal.Footer>
      <Button onClick={props.editItem}>CONFIRM</Button>
    </Modal.Footer>
  </Modal>;

const EditDialog = compose(
  connect(
    state => ({
      doubleClicked: state.doubleClicked,
      editing: state.editing,
    }), {
      click: click.bind(null, {
        parentId: null,
        cIndex: null
      }),
      edit: listActions.edit,
      setCurrentId
    }
  ),
  withState('data', 'setData', ''),
  withHandlers({
    handleClick: ({ click }) => () =>
      click(),
    editItem: ({ data, editing, edit, click }) => () => {
      edit({
        ...editing,
        data
      });
      click();
    },
    initData: ({ editing, setData }) => () =>
      setData(editing.data),
    handleChange: ({ setData }) => e =>
      setData(e.target.value)
  })
)(_EditDialog);

export default EditDialog;
