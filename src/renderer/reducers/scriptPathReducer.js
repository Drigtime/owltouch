import { SCRIPT_ACTIONS_AMAKNA, SCRIPT_ACTIONS_INCARNAM } from "renderer/actions/types";

const initialState = {
  scriptActions: {
    amakna: {
      move: [],
      bank: [],
      phenix: []
    },
    incarnam: {
      move: [],
      bank: [],
      phenix: []
    }
  }
};

export default function(state = initialState, { type, payload }) {
  switch (type) {
    case SCRIPT_ACTIONS_AMAKNA:
      return {
        ...state,
        scriptActions: {
          amakna: {
            move: payload.type == "move" ? payload.value : state.scriptActions.amakna.move,
            bank: payload.type == "bank" ? payload.value : state.scriptActions.amakna.bank,
            phenix: payload.type == "phenix" ? payload.value : state.scriptActions.amakna.phenix
          },
          incarnam: state.scriptActions.incarnam
        }
      };
    case SCRIPT_ACTIONS_INCARNAM:
      return {
        ...state,
        scriptActions: {
          amakna: state.scriptActions.amakna,
          incarnam: {
            move: payload.type == "move" ? payload.value : state.scriptActions.incarnam.move,
            bank: payload.type == "bank" ? payload.value : state.scriptActions.incarnam.bank,
            phenix: payload.type == "phenix" ? payload.value : state.scriptActions.incarnam.phenix
          }
        }
      };
    default:
      return state;
  }
}
