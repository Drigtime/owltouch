import { SCRIPT_ACTIONS } from "renderer/actions/types";

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
    case SCRIPT_ACTIONS:
      return {
        ...state,
        scriptActions: {
          amakna: {
            move:
              payload.type == "move"
                ? payload.value
                : state.scriptActions.amakna.move,
            bank:
              payload.type == "bank"
                ? payload.value
                : state.scriptActions.amakna.bank,
            phenix:
              payload.type == "phenix"
                ? payload.value
                : state.scriptActions.amakna.phenix
          }
          // incarnam: Object.entries(state.scriptActions.incarnam))
        }
        // {
        //   ...state,
        //   scriptActions: {
        //     amakna: {
        //       [payload.type]: payload.value
        //     }
        //   }
      };
    default:
      return state;
  }
}
