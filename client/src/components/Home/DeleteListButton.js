import React from 'react';
import { connect } from 'react-redux';
import { compose, withState, withHandlers } from 'recompose';
import listActions from '../../actions/list';
import DeleteConfirmation from '../DeleteConfirmation';

const _DeleteListButton = props =>
  <span
    style={props.style}
    onClick={props.openModal}
  >
    { 'X' }
    <DeleteConfirmation
      show={props.showModal}
      close={props.closeModal}
      confirm={props.confirmModal}
      data={props.list.data}
    />
  </span>;

const DeleteListButton = compose(
  connect(
    null, {
      deleteList: listActions.delete
    }
  ),
  withState('showModal', 'toggleModal', false),
  withHandlers({
    openModal: ({ toggleModal }) => e => {
      toggleModal(true),
      e.stopPropagation();
    },
    closeModal: ({ toggleModal }) => () =>
      toggleModal(false),
    confirmModal: ({ deleteList, list }) => () =>
      deleteList(list._id),
  })
)(_DeleteListButton);

export default DeleteListButton;
