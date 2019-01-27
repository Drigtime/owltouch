import { MOVEMENT_TYPE } from "renderer/actions/types.js";

export const changeMoveType = moveType => dispatch => {
  dispatch({
    type: MOVEMENT_TYPE,
    payload: moveType
  });
};
