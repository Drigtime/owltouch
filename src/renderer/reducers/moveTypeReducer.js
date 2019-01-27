import { MOVEMENT_TYPE } from "renderer/actions/types.js";

const initialState = {
  moveType: "top"
};

export default function(state = initialState, { type, payload }) {
  switch (type) {
    case MOVEMENT_TYPE:
      return {
        ...state,
        moveType: payload
      };
    default:
      return state;
  }
}
