import { Reducer } from 'redux';
import { getSettings } from '../utilities';

enum ActionType {
  FETCH_START = 'FETCH_START',
  FETCH_SUCCESS = 'FETCH_SUCCESS',
  FETCH_ERROR = 'FETCH_ERROR',
  CLEAR_STATE = 'CLEAR_STATE',
}

enum ActionFetchName {
  USER = 'USER',
  CONTRIBUTORS = 'CONTRIBUTORS',
}

export type State<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

type FetchDataStartAction = {
  type: ActionType.FETCH_START;
  name: ActionFetchName;
};

type FetchDataSuccessAction<T> = {
  type: ActionType.FETCH_SUCCESS;
  payload: T;
  name: ActionFetchName;
};

type FetchDataErrorAction = {
  type: ActionType.FETCH_ERROR;
  payload: string;
  name: ActionFetchName;
};

type ClearStateAction = {
  type: ActionType.CLEAR_STATE;
  name: ActionFetchName;
};

export type FetchDataAction<T> =
  | FetchDataStartAction
  | FetchDataSuccessAction<T>
  | FetchDataErrorAction
  | ClearStateAction;

const createDataFetching = <T>(
  initialState: State<T>,
  actionName: ActionFetchName
): Reducer<State<T>, FetchDataAction<T>> => {
  return (state = initialState, action: FetchDataAction<T>): State<T> => {
    const { name } = action;

    if (name !== actionName) return state;

    switch (action.type) {
      case ActionType.FETCH_START: {
        return { data: null, loading: true, error: null };
      }
      case ActionType.FETCH_SUCCESS: {
        return { data: action.payload, loading: false, error: null };
      }
      case ActionType.FETCH_ERROR: {
        return { data: null, loading: false, error: action.payload };
      }
      case ActionType.CLEAR_STATE: {
        return { data: null, loading: false, error: null };
      }
      default:
        return state;
    }
  };
};

const initialContributorsState: State<UserData[]> = {
  data: null,
  loading: false,
  error: null,
};

const initialUserState: State<UserData> = {
  data: getSettings()?.user || null,
  loading: false,
  error: null,
};

export const userFetching: Reducer<
  State<UserData>,
  FetchDataAction<UserData>
> = createDataFetching(initialUserState, ActionFetchName.USER);

export const contributorsFetching: Reducer<
  State<UserData[]>,
  FetchDataAction<UserData[]>
> = createDataFetching(initialContributorsState, ActionFetchName.CONTRIBUTORS);

export type FetchDataActionCreatorApi<T> = {
  fetchDataStart: () => FetchDataStartAction;
  fetchDataSuccess: (data: T) => FetchDataSuccessAction<T>;
  fetchDataError: (error: string) => FetchDataErrorAction;
  clearState: () => ClearStateAction;
};

const fetchDataActionCreatorGenerator = <T>(
  name: ActionFetchName
): FetchDataActionCreatorApi<T> => ({
  fetchDataStart: () => ({
    type: ActionType.FETCH_START,
    name,
  }),
  fetchDataSuccess: (data: T) => ({
    type: ActionType.FETCH_SUCCESS,
    payload: data,
    name,
  }),
  fetchDataError: (error: string) => ({
    type: ActionType.FETCH_ERROR,
    payload: error,
    name,
  }),
  clearState: () => ({
    type: ActionType.CLEAR_STATE,
    name,
  }),
});

export const userActionCreatorApi: FetchDataActionCreatorApi<UserData> =
  fetchDataActionCreatorGenerator(ActionFetchName.USER);

export const contributorsActionCreatorApi: FetchDataActionCreatorApi<
  UserData[]
> = fetchDataActionCreatorGenerator(ActionFetchName.CONTRIBUTORS);
