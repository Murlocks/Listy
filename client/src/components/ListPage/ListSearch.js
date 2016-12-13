import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers, lifecycle } from 'recompose';
import { setSearchFilter } from '../../actions/ListPage';

import FieldGroup from '../FieldGroup';

const _ListSearch = ({ handleChange }) =>
  <form>
    <FieldGroup
      type='text'
      label='Search List'
      placeholder='Keywords...'
      onChange={handleChange}
    />
  </form>;

const ListSearch = compose(
  connect(
    state => ({
      filterText: state.filterText
    }), {
      setSearchFilter
    }
  ),
  withHandlers({
    handleChange: ({ setSearchFilter }) => e =>
      setSearchFilter( e.target.value)
  }),
  lifecycle({
    componentWillUnmount: function() {
      this.props.setSearchFilter('');
    }
  })
)(_ListSearch);

export default ListSearch;
