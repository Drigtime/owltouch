import {
  MAX_PODS,
  TAKE_KAMAS,
  TAKE_KAMAS_QUANT,
  PUT_KAMAS,
  PUT_KAMAS_QUANT
} from "renderer/actions/types.js";

const initialState = {
  maxPods: 80,
  takeKamas: false,
  takeKamasQuant: 0,
  putKamas: false,
  putKamasQuant: 0
};

export default function(state = initialState, { type, payload }) {
  switch (type) {
    case MAX_PODS:
      return {
        ...state,
        maxPods: payload
      };
    case TAKE_KAMAS:
      return {
        ...state,
        takeKamas: payload
      };
    case TAKE_KAMAS_QUANT:
      return {
        ...state,
        takeKamasQuant: payload
      };
    case PUT_KAMAS:
      return {
        ...state,
        putKamas: payload
      };
    case PUT_KAMAS_QUANT:
      return {
        ...state,
        putKamasQuant: payload
      };
    default:
      return state;
  }
}
