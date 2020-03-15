import React from "react";
import ReactDOM from "react-dom";
import "regenerator-runtime/runtime";

import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import Routes from "./Routes";
import { renderRoutes } from "react-router-config";
import reducers from "./reducers";
import axios from "axios";
import { ServerStyleSheet, StyleSheetManager } from "styled-components";

//this request automatically will be proxied
const axiosInstance = axios.create({
  baseURL: "/api"
});

//we are passing axiosInstance to all action creators
const store = createStore(
  reducers,
  window.INITIAL_STATE,
  applyMiddleware(thunk.withExtraArgument(axiosInstance))
);

// const sheet = new ServerStyleSheet();
// ReactDOM.hydrate(
//   sheet.collectStyles(
//     <Provider store={store}>
//       <BrowserRouter>
//         <div>{renderRoutes(Routes)}</div>
//       </BrowserRouter>
//     </Provider>,
//     document.getElementById("root")
//   )
// );

const sheet = new ServerStyleSheet();
ReactDOM.hydrate(
  <Provider store={store}>
    <BrowserRouter>
      <div>{renderRoutes(Routes)}</div>
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);
