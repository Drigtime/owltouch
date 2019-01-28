import { GATHER_COUNT, OPEN_BAG } from "renderer/actions/types.js";

export const checkGatherCountSwitch = checked => dispatch => {
  dispatch({
    type: GATHER_COUNT,
    payload: checked
  });
};

export const checkOpenBagSwitch = checked => dispatch => {
  dispatch({
    type: OPEN_BAG,
    payload: checked
  });
};
