import { SWITCH_WORLD } from "renderer/actions/types.js";

const initialState = {
  world: "amakna"
};

export default function(state = initialState, { type, payload }) {
  switch (type) {
    case SWITCH_WORLD:
      return {
        ...state,
        world: payload
      };
    default:
      return state;
  }
}
