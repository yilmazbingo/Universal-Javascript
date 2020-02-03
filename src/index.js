// const Home = require("./client/components/Home").default;

import express from "express";
import React from "react";
import { matchRoutes } from "react-router-config";
import Routes from "./client/Routes";
import "regenerator-runtime/runtime";

import renderer from "./helpers/renderer";
import createStore from "./helpers/createStore";
const app = express();
app.use(express.static("public"));
//since we set public folder as static folder as soon as express sees the src="bundle.js" it will look into the public folder.

app.get("*", (req, res) => {
  //boot up location on the server side.
  const store = createStore();

  //some logic to initialzie and load data into the store
  const promises = matchRoutes(Routes, req.path).map(({ route }) => {
    return route.loadData ? route.loadData(store) : null;
  });
  // console.log(promises);
  Promise.all(promises).then(() => {
    res.send(renderer(req, store));
  });

  //will return an array of components that about to be rendered
});

app.listen(3000, () => {
  console.log("listening on port 300");
});
