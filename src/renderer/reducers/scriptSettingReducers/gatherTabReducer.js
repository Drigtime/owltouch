import { GATHER_COUNT, OPEN_BAG } from "renderer/actions/types.js";

const initialState = {
  openBag: true,
  gatherCount: true
};

export default function(state = initialState, { type, payload }) {
  switch (type) {
    case OPEN_BAG:
      return {
        ...state,
        openBag: payload
      };
    case GATHER_COUNT:
      return {
        ...state,
        gatherCount: payload
      };
    default:
      return state;
  }
}
