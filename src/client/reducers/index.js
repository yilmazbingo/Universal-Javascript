import { combineReducers } from "redux";
import authReducer from "./authReducer";
import adminsReducer from "./adminsReducer";
import usersReducer from "./usersReducer";
//this is the state that redux stores
export default combineReducers({
  auth: authReducer,
  admins: adminsReducer,
  users: usersReducer
});

//use this in both stores
