import { FIGHT_COUNT, AUTO_REGEN } from "renderer/actions/types.js";

const initialState = {
  fightCount: true,
  autoRegen: true
};

export default function(state = initialState, { type, payload }) {
  switch (type) {
    case FIGHT_COUNT:
      return {
        ...state,
        fightCount: payload
      };
    case AUTO_REGEN:
      return {
        ...state,
        autoRegen: payload
      };
    default:
      return state;
  }
}
