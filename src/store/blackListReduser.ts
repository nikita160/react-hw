import { Reducer } from 'redux';
import { getSettings } from '../utilities';

enum ActionType {
  SET_BLACKLIST = 'SET_BLACKLIST',
}

type State = {
  value: string[];
};
type Action = {
  type: ActionType;
  payload: string[];
};

export const setBlackList = (value: string[]): Action => ({
  type: ActionType.SET_BLACKLIST,
  payload: value,
});

const initialState: State = { value: getSettings()?.blackList || [] };

export const blackList: Reducer<State, Action> = (
  state: State = initialState,
  action: Action
) => {
  switch (action.type) {
    case ActionType.SET_BLACKLIST:
      return { ...state, value: action.payload };

    default:
      return state;
  }
};
