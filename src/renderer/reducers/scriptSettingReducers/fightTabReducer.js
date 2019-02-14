import {
  FIGHT_COUNT,
  AUTO_REGEN,
  MAX_FIGHT_PER_MAP,
  MAX_FIGHT_NUMBER_PER_MAP,
  MIN_REGEN,
  MAX_REGEN,
  REGEN_ITEM,
  REGEN_ITEM_QUANT,
  MIN_MONSTER_LEVEL,
  MAX_MONSTER_LEVEL,
  MIN_MONSTER,
  MAX_MONSTER,
  FORBIDDEN_MONSTER,
  MANDATORY_MONSTER
} from "renderer/actions/types.js";

const initialState = {
  fightCount: true,
  autoRegen: true,
  maxFightPerMap: false,
  maxFightNumberPerMap: 10,
  minRegen: 80,
  maxRegen: 100,
  regenItem: [],
  regenItemQuant: 0,
  minMonsterLevel: 1,
  maxMonsterLevel: 1000,
  minMonster: 1,
  maxMonster: 8,
  forbiddenMonster: [],
  mandatoryMonster: []
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
    case MAX_FIGHT_PER_MAP:
      return {
        ...state,
        maxFightPerMap: payload
      };
    case MAX_FIGHT_NUMBER_PER_MAP:
      return {
        ...state,
        maxFightNumberPerMap: payload
      };
    case MIN_REGEN:
      return {
        ...state,
        minRegen: payload
      };
    case MAX_REGEN:
      return {
        ...state,
        maxRegen: payload
      };
    case REGEN_ITEM:
      return {
        ...state,
        regenItem: payload
      };
    case REGEN_ITEM_QUANT:
      return {
        ...state,
        regenItemQuant: payload
      };
    case MIN_MONSTER_LEVEL:
      return {
        ...state,
        minMonsterLevel: payload
      };
    case MAX_MONSTER_LEVEL:
      return {
        ...state,
        maxMonsterLevel: payload
      };
    case MIN_MONSTER:
      return {
        ...state,
        minMonster: payload
      };
    case MAX_MONSTER:
      return {
        ...state,
        maxMonster: payload
      };
    case FORBIDDEN_MONSTER:
      return {
        ...state,
        forbiddenMonster: payload
      };
    case MANDATORY_MONSTER:
      return {
        ...state,
        mandatoryMonster: payload
      };
    default:
      return state;
  }
}
