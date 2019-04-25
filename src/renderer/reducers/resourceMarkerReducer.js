import { RESOURCE_MARKER } from "renderer/actions/types.js";

const initialState = {
  markers: {}
};

export default function(state = initialState, { type, payload }) {
  // eslint-disable-next-line no-console
  console.log(payload);
  switch (type) {
    case RESOURCE_MARKER:
      return {
        ...state,
        markers: payload
      };
    default:
      return state;
  }
}
