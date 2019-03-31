import { combineReducers } from "redux";
import moveDirectionReducer from "renderer/reducers/moveDirectionReducer.js";
import moveTypeReducer from "renderer/reducers/moveTypeReducer.js";
import scriptPathReducer from "renderer/reducers/scriptPathReducer.js";
import bankTabReducer from "renderer/reducers/scriptSettingReducers/bankTabReducer.js";
import fightTabReducer from "renderer/reducers/scriptSettingReducers/fightTabReducer.js";
import gatherTabReducer from "renderer/reducers/scriptSettingReducers/gatherTabReducer.js";
import informationTabReducer from "renderer/reducers/scriptSettingReducers/informationTabReducer.js";
import worldSwitchReducer from "renderer/reducers/worldSwitchReducer.js";

export default combineReducers({
  bankTab: bankTabReducer,
  fightTab: fightTabReducer,
  gatherTab: gatherTabReducer,
  informationTab: informationTabReducer,
  moveType: moveTypeReducer,
  moveToggleButtons: moveDirectionReducer,
  scriptPath: scriptPathReducer,
  worldSwitch: worldSwitchReducer
});
