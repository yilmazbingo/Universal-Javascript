import React, { Component } from "react";
import { connect } from "react-redux";
import { Helmet } from "react-helmet";
import { fetchUsers } from "../actions";

class UsersList extends Component {
  //life cycles methods are invoked on the client side durint hydration process
  componendDidMount() {
    this.props.fetchUsers();
  }

  //normal class methods
  renderUsers() {
    return this.props.users.map(user => {
      return <li key={user.id}>{user.name}</li>;
    });
  }

  head() {
    return (
      <Helmet>
        <title>{`${this.props.users.length} users loaded`}</title>
        <meta property="og:title" content="Users app" />
      </Helmet>
    );
  }
  render() {
    return (
      <div>
        {this.head()}
        HERE IS A LIST OF USERS:
        <ul>{this.renderUsers()}</ul>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { users: state.users };
}

const loadData = store => {
  // console.log("store", store);

  return store.dispatch(fetchUsers());
};

export default {
  loadData,
  component: connect(mapStateToProps, { fetchUsers })(UsersList)
};
