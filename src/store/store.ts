import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { blackList } from './blackListReduser';
import { contributorsFetching, userFetching } from './fetchingReducer';

const reducer = combineReducers({
  userFetching,
  contributorsFetching,
  blackList,
});

export const store = createStore(reducer, applyMiddleware(thunk));

export type RootState = ReturnType<typeof store.getState>;
