//we share this file bwtween server and browser
import React from "react";
import Home from "./pages/Home";
import UsersList, { loadData } from "./pages/UsersList";

// export default () => {
//   return (
//     <div>
//       <Route exact path="/" component={Home} />
//       <Route path="/users" component={UsersList} />
//     </div>
//   );
// };

export default [
  {
    path: "/",
    component: Home,
    exact: true
  },
  { loadData, path: "/users", component: UsersList }
];
