// import { FIGHT_COUNT, AUTO_REGEN } from "renderer/actions/types.js";

export const handleChanges = (type, state) => dispatch => {
  dispatch({
    type: type,
    payload: state
  });
};
