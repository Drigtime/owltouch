import {
  SCRIPT_NAME,
  SCRIPT_AREA,
  SCRIPT_TYPE,
  SCRIPT_AUTHOR_NAME
} from "renderer/actions/types.js";

const initialState = {
    scriptName: "",
    scriptType: "",
    scriptArea: "",
    scriptAuthorName: ""
};

export default function(state = initialState, { type, payload }) {
  switch (type) {
    case SCRIPT_NAME:
      return {
        ...state,
        scriptName: payload
      };
    case SCRIPT_AREA:
      return {
        ...state,
        scriptType: payload
      };
    case SCRIPT_TYPE:
      return {
        ...state,
        scriptArea: payload
      };
    case SCRIPT_AUTHOR_NAME:
      return {
        ...state,
        scriptAuthorName: payload
      };
    default:
      return state;
  }
}
