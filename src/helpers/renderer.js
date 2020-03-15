import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import { Provider } from "react-redux";
import Routes from "../client/Routes";
import { renderRoutes } from "react-router-config";
import serialize from "serialize-javascript";
import { Helmet } from "react-helmet";
import { ServerStyleSheet, StyleSheetManager } from "styled-components";

//this function will be shipped to the browser
export default (req, store, context) => {
  const sheet = new ServerStyleSheet();

  try {
    const content = renderToString(
      sheet.collectStyles(
        <Provider store={store}>
          <StaticRouter location={req.path} context={context}>
            <div>{renderRoutes(Routes)}</div>
          </StaticRouter>
        </Provider>
      )
    );
    const styleTags = sheet.getStyleTags();
    //we use this instance to extract the tags
    //this returns an object that represents all the tags we just loaded up inside helmet library.
    const helmet = Helmet.renderStatic();
    return `
    <html> 
    <head>
    ${helmet.title.toString()}
    ${helmet.meta.toString()}
    ${styleTags}
    </head>
    <body>
    <div  id="root">${content}</div>
    <script>window.INITIAL_STATE=${serialize(store.getState())}</script>
    <script src="main-bundle.js"> </script>
    </body></html> `;
  } catch (e) {
    console.log("style-component server-site", e);
  } finally {
    sheet.seal();
  }
};
