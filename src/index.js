// const Home = require("./client/components/Home").default;

import express from "express";
import renderer from "./helpers/renderer";
const app = express();
app.use(express.static("public"));
//since we set public folder as static folder as soon as express sees the src="bundle.js" it will look into the public folder.

app.get("/", (req, res) => {
  //boot up location on the server side.

  res.send(renderer);
});

app.listen(3000, () => {
  console.log("listening on port 300");
});
