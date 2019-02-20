import {
  GATHER_COUNT,
  OPEN_BAG,
  ELEMENT_TO_GATHER
} from "renderer/actions/types.js";

const initialState = {
  openBag: true,
  gatherCount: true,
  elementToGather: []
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
    case ELEMENT_TO_GATHER:
      return {
        ...state,
        elementToGather: payload
      };
    default:
      return state;
  }
}
