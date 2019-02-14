import { combineReducers } from "redux";
import moveTypeReducer from "renderer/reducers/moveTypeReducer.js";
import moveDirectionReducer from "renderer/reducers/moveDirectionReducer.js";
import gatherTabReducer from "renderer/reducers/scriptSettingReducers/gatherTabReducer.js";
import fightTabReducer from "renderer/reducers/scriptSettingReducers/fightTabReducer.js";
import bankTabReducer from "renderer/reducers/scriptSettingReducers/bankTabReducer.js";

export default combineReducers({
  moveType: moveTypeReducer,
  moveToggleButtons: moveDirectionReducer,
  gatherTab: gatherTabReducer,
  fightTab: fightTabReducer,
  bankTab: bankTabReducer
});
