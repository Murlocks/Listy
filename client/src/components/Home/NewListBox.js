import React from 'react';
import { connect } from 'react-redux';
import { compose, withState, withHandlers } from 'recompose';
import listActions from '../../actions/list';

import { FormGroup, InputGroup, FormControl, Button } from 'react-bootstrap';

const _NewListBox = ({ handleChange, handleSubmit }) =>
  <form>
    <FormGroup>
      <InputGroup>
        <InputGroup.Addon>◉</InputGroup.Addon>
        <FormControl
          type='text'
          placeholder='Enter heading...'
          onChange={handleChange}
        />
        <InputGroup.Button>
          <Button
            type="submit"
            onClick={handleSubmit}
          >
            Create List!
          </Button>
        </InputGroup.Button>
      </InputGroup>
    </FormGroup>
  </form>;

const NewListBox = compose(
  connect(
    state => ({
      user: state.auth.user
    }), {
      addList: listActions.new
    }
  ),
  withState('data', 'setData', ''),
  withHandlers({
    handleSubmit: ({ addList, data }) => e => {
      e.preventDefault();
      addList(data);
    },
    handleChange: ({ setData }) => e =>
      setData(e.target.value)
  })
)(_NewListBox);

export default NewListBox;
