import { FIGHT_COUNT, AUTO_REGEN } from "renderer/actions/types.js";

export const checkFightCountSwitch = checked => dispatch => {
  dispatch({
    type: FIGHT_COUNT,
    payload: checked
  });
};

export const checkAutoRegenSwitch = checked => dispatch => {
  dispatch({
    type: AUTO_REGEN,
    payload: checked
  });
};
