import React from "react";

//StaticRouter renames the prop from the context to staticContext
//this prop does not exit on the browser. so we pass {} as default value
const NotFoundPage = ({ staticContext = {} }) => {
  console.log("StaticContext", staticContext);
  staticContext.notFound = true;
  return <h1>Ooops, Not Found</h1>;
};

export default { component: NotFoundPage };
