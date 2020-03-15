//we share this file bwtween server and browser
import React from "react";
import Home from "./pages/Home";
import UsersList from "./pages/UsersList";
import App from "./App";
import NotFoundPage from "./pages/NotFoundPage";
import AdminsListPage from "./pages/AdminsListPage";

//we are nesting routes

//this is not a react component anymore. so we use {renderRoutes} from react-router-config
//renderRoutes turn this javascript structure into the react components
//the purpose of this setup is making sure that we can figure out what set of components are about to be rendered.
//array of routes are nested inside the App component
//we do not tie "path" to the App, bc we will always display on the screen.
export default [
  {
    ...App,
    routes: [
      {
        path: "/",
        ...Home,
        exact: true
      },
      { ...UsersList, path: "/users" },
      { ...AdminsListPage, path: "/admins" },
      { ...NotFoundPage }
    ]
  }
];
