import { MOVEMENT_DIRECTION, BUILDING_PLACEMENT, FORMAT_TOOL } from "renderer/actions/types.js";

const initialState = {
  moveDirection: [],
  buildingPlacement: null,
  formatTools: null,
};

export default function(state = initialState, { type, payload }) {
  switch (type) {
    case MOVEMENT_DIRECTION:
      return {
        ...state,
        moveDirection: payload,
        buildingPlacement: null,
        formatTools: null
      };
    case BUILDING_PLACEMENT:
      return {
        ...state,
        buildingPlacement: payload,
        moveDirection: [],
        formatTools: null
      };
    case FORMAT_TOOL:
      return {
        ...state,
        formatTools: payload,
        buildingPlacement: null,
        moveDirection: [],
      };
    default:
      return state;
  }
}
