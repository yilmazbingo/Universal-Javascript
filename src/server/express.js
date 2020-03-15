// const Home = require("./client/components/Home").default;

import express from "express";
import React from "react";
import { matchRoutes } from "react-router-config";
import Routes from "../client/Routes";
import "regenerator-runtime/runtime";
import proxy from "express-http-proxy";
// import webpack from "webpack";
// import config from "../../webpack.client";
// const compiler = webpack(config);
// import webpackDevMiddleware from "webpack-dev-middleware"(compiler,config.devServer);
import renderer from "../helpers/renderer";
import createStore from "../helpers/createStore";
const app = express();

app.use(
  "/api",
  proxy("http://react-ssr-api.herokuapp.com/", {
    proxyReqOptDecorator(opts) {
      opts.headers["x-forwarded-host"] = "localhost:3000";
      console.log("OPTIONS IN PROXY", opts);
      return opts;
    }
  })
);
app.use(express.static("public"));
//since we set public folder as static folder as soon as express sees the src="bundle.js" it will look into the public folder.

app.get("*", (req, res) => {
  //boot up location on the server side.
  //req includes the COOKIE
  const store = createStore(req);

  //some logic to initialzie and load data into the store
  // const promises = matchRoutes(Routes, req.path).map(({ route }) => {
  //   return route.loadData ? route.loadData(store) : null;
  // });
  // console.log("promises", promises);

  const promises = matchRoutes(Routes, req.path)
    .map(({ route }) => {
      return route.loadData ? route.loadData(store) : null;
    }) // route.loadData(store) returns promise. now we wrap this with a promise
    .map(promise => {
      if (promise) {
        return new Promise((resolve, reject) => {
          promise.then(resolve).catch(resolve);
        });
      }
    });
  // if any of promise is rejected we should still forcing our app to render

  Promise.all(promises)
    .then(() => {
      const context = {};
      const content = renderer(req, store, context);
      //now we inspect the context object
      //this is how redirect works on the server
      if (context.url) {
        return res.redirect(301, context.url);
      }
      if (context.notFound) {
        res.status(404);
      }
      res.set("Cache-Control", "public,max-age=600, s-maxage=1200");
      res.send(content);
    })
    .catch(() => res.send("something went wrong"));

  //will return an array of components that about to be rendered
});

app.listen(3000, () => {
  console.log("listening on port 300");
});
