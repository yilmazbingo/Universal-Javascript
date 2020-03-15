import { FETCH_CURRENT_USER } from "../actions";

//export default cannot be used with "const"
//state=null is usually used for authentication
export default function(state = null, action) {
  switch (action.type) {
    case FETCH_CURRENT_USER:
      return action.payload.data || false;
    default:
      return state;
  }
}
//if the user is not authenticated action.payload.data will be undefined
