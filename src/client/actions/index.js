import Axios from "axios";
//all of these actions will be invoked by redux thunk. thunk will wrap those

export const FETCH_USERS = "fetch_users";

//this function invokes action creators
//all action creators are async redux thunk functions
//redux thunk allows us to return functions instead of plain pbjects inside actions

export const fetchUsers = () => async (dispatch, getState, api) => {
  try {
    // const res=await axios.get("full path")
    const res = await api.get("/users");
    dispatch({ type: FETCH_USERS, payload: res });
  } catch (error) {
    console.log(error);
  }
};

//fetching authenticated users in app.js
//app.js has loadData. it is one of the components that will be checked to see whether it is rendered by the matchRoutes

export const FETCH_CURRENT_USER = "fetch_current_user";

export const fetchCurrentUser = () => async (dispatch, getState, api) => {
  try {
    const res = await api.get("/current_user");
    dispatch({ type: FETCH_CURRENT_USER, payload: res });
  } catch (e) {
    console.log(e);
  }
};

export const FETCH_ADMINS = "fetch_admins";

export const fetchAdmins = () => async (dispatch, getState, api) => {
  try {
    const res = await api.get("/admins");
    dispatch({ type: FETCH_ADMINS, payload: res });
  } catch (e) {
    console.log(e);
  }
};
