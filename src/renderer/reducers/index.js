import { combineReducers } from "redux";
import moveTypeReducer from "renderer/reducers/moveTypeReducer.js";
import moveDirectionReducer from "renderer/reducers/moveDirectionReducer.js";
import addMarkerReducer from "renderer/reducers/addMarkerReducer.js";
import gatherTabReducer from "renderer/reducers/scriptSettingReducers/gatherTabReducer.js";
import fightTabReducer from "renderer/reducers/scriptSettingReducers/fightTabReducer.js";
import bankTabReducer from "renderer/reducers/scriptSettingReducers/bankTabReducer.js";
import informationTabReducer from "renderer/reducers/scriptSettingReducers/informationTabReducer.js";

export default combineReducers({
  moveType: moveTypeReducer,
  moveToggleButtons: moveDirectionReducer,
  gatherTab: gatherTabReducer,
  fightTab: fightTabReducer,
  bankTab: bankTabReducer,
  informationTab: informationTabReducer,
  addMarker: addMarkerReducer
});
