import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

export default ChildComponent => {
  class RequireAuth extends React.Component {
    render() {
      switch (this.props.auth) {
        case false:
          return <Redirect to="/" />;

        case null:
          return <div>Loading...</div>;
        default:
          //any props that passed to the higher order component will be passed to the childComponent as well.
          return <ChildComponent {...this.props} />;
      }
    }
  }
  const mapStateToProps = state => ({ auth: state.auth });
  return connect(mapStateToProps)(RequireAuth);
};
