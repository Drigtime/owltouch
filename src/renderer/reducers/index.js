import { combineReducers } from "redux";
import moveTypeReducer from "renderer/reducers/moveTypeReducer.js";

export default combineReducers({
  moveType: moveTypeReducer
});
