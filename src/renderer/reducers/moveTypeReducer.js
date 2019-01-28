import { MOVEMENT_TYPE } from "renderer/actions/types.js";

const initialState = {
  type: "move"
};

export default function(state = initialState, { type, payload }) {
  switch (type) {
    case MOVEMENT_TYPE:
      return {
        ...state,
        type: payload
      };
    default:
      return state;
  }
}
