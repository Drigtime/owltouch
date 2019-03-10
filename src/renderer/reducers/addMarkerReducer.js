import { SCRIPT_ACTIONS } from "renderer/actions/types";

const initialState = {
  scriptActions: []
};

export default function(state = initialState, { type, payload }) {
  switch (type) {
    case SCRIPT_ACTIONS:
      return {
        ...state,
        scriptActions: payload
      };
    default:
      return state;
  }
}
