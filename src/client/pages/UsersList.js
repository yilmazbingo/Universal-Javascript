import React, { Component } from "react";
import { connect } from "react-redux";

import { fetchUsers } from "../actions";

class UsersList extends Component {
  componendDidMount() {
    this.props.fetchUsers();
  }

  renderUsers() {
    return this.props.users.map(user => {
      return <li key={user.id}>{user.name}</li>;
    });
  }
  render() {
    return (
      <div>
        HERE IS A LIST OF USERS:
        <ul>{this.renderUsers()}</ul>
      </div>
    );
  }
}

// const mapStateToProps = state => {
//   return { users: state.users };
// };

function mapStateToProps(state) {
  return { users: state.users };
}

const loadData = store => {
  return store.dispatch(fetchUsers());
};

export { loadData };
export default connect(mapStateToProps, { fetchUsers })(UsersList);
