import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';
import { compose } from 'redux';
import { renderComponent, branch, lifecycle  } from 'recompose';
import { identity } from 'ramda';

import list from '../../actions/list';
import ListItem from '../ListItem/ListItem';
import ListSearch from './ListSearch';
import DeleteItemIcon from './DeleteItemIcon';
import Loadable from '../Loadable';
import EditDialog from './EditDialog';

import { Grid, Col } from 'react-bootstrap';

const _ListPage = ({ list }) =>
  <Grid>
    <Col md={8} sm={8}>
      <EditDialog/>
      <ListSearch/>
      <ListItem
        root rootId={list._id}
        list={list}
      />
      <DeleteItemIcon
        style={{
          display: 'block',
          position: 'fixed',
          bottom: '50px',
          right: '50px'
        }}
      />
    </Col>
  </Grid>;

const NotFound = () =>
  <Col md={8} mdOffset={2} sm={8} smOffset={2}>
    <h3>List not found!</h3>
  </Col>;

const ListPage = compose(
  DragDropContext(HTML5Backend),
  connect(
    state => ({
      isFetching: state.isFetching,
      list: state.list
    }), {
      fetch: list.fetch,
    }
  ),
  lifecycle({
    componentWillMount: function() {
      this.props.fetch(this.props.params.id);
    }
  }),
  Loadable(({ isFetching, list }) => isFetching && _.isEmpty(list)),
  branch(
    ({ isFetching, list }) => !isFetching && _.isEmpty(list),
    renderComponent(NotFound),
    identity
  ),
)(_ListPage);

export default ListPage;
