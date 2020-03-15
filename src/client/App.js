import React from "react";
import Header from "./components/Header";
import { renderRoutes } from "react-router-config";
import { fetchCurrentUser } from "./actions";

//this component is to render components that each component uses in common
//props.route child components that are passed from Routes.js
const App = ({ route }) => {
  return (
    <div>
      <Header />
      {renderRoutes(route.routes)}
    </div>
  );
};

//loadData is called with redux store.store.dispatch
//we are going to call loadData from the server
export default {
  component: App,
  //this function is get called by redux so store is passed in
  //we populated the store with the authenticaion info so Header can use it
  loadData: ({ dispatch }) => dispatch(fetchCurrentUser())
};
