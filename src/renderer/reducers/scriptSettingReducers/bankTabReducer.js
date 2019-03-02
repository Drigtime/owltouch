import {
  MAX_PODS,
  AUTO_DELETE,
  TAKE_KAMAS,
  TAKE_KAMAS_QUANT,
  PUT_KAMAS,
  PUT_KAMAS_QUANT,
  TAKE_ITEM,
  PUT_ITEM
} from "renderer/actions/types.js";

const initialState = {
  maxPods: 80,
  autoDelete: [],
  takeKamas: false,
  takeKamasQuant: 0,
  putKamas: false,
  putKamasQuant: 0,
  takeItem: [],
  putItem: []
};

export default function(state = initialState, { type, payload }) {
  switch (type) {
    case MAX_PODS:
      return {
        ...state,
        maxPods: payload
      };
    case AUTO_DELETE:
      return {
        ...state,
        autoDelete: payload
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
    case TAKE_ITEM:
      return {
        ...state,
        takeItem: payload
      };
    case PUT_ITEM:
      return {
        ...state,
        putItem: payload
      };
    default:
      return state;
  }
}