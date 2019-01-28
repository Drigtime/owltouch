import { MOVEMENT_DIRECTION, BUILDING_PLACEMENT, FORMAT_TOOL } from "renderer/actions/types.js";

export const changeMoveDirection = moveDirection => dispatch => {
  dispatch({
    type: MOVEMENT_DIRECTION,
    payload: moveDirection
  });
};

export const changeBuildingPlacement = buildingPlacement => dispatch => {
  dispatch({
    type: BUILDING_PLACEMENT,
    payload: buildingPlacement
  });
};

export const changeFormatTools = formatTools => dispatch => {
  dispatch({
    type: FORMAT_TOOL,
    payload: formatTools
  });
};
