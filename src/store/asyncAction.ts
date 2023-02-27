import { AnyAction, Dispatch } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import {
  contributorsActionCreatorApi,
  FetchDataActionCreatorApi,
  userActionCreatorApi,
} from './fetchingReducer';

import { RootState } from './store';

const DEBOUNCE_TIMEOUT = 3000;

//Github API URLs:
// https://api.github.com/users/USERNAME
//  https://api.github.com/repos/${owner}/${repo}/contributors

type RequestUserParams = { login: string };
type RequestContributorsParams = { owner: string; repo: string };

export type RequestParams = RequestUserParams | RequestContributorsParams;

type UrlBuilder<T extends RequestParams> = (requestParams: T) => string;

const userUrl: UrlBuilder<RequestUserParams> = ({ login }) =>
  `https://api.github.com/users/${login}`;

const contributorsUrl: UrlBuilder<RequestContributorsParams> = ({
  owner,
  repo,
}) => `https://api.github.com/repos/${owner}/${repo}/contributors`;

type ResponseUserData = { login: string; avatar_url: string };
type ResponseContributorsData = { login: string; avatar_url: string }[];
type ResponseData = ResponseUserData | ResponseContributorsData;

type FormatResult<P extends ResponseData, R extends RequestParams, T> = (
  responseData: P,
  requestParam: R
) => T;

const formatUserResult: FormatResult<
  ResponseUserData,
  RequestUserParams,
  UserData
> = ({ login, avatar_url }) => ({ login, avatarUrl: avatar_url });

const formatContributorsResult: FormatResult<
  ResponseContributorsData,
  RequestContributorsParams,
  UserData[]
> = (data, { owner }) =>
  data
    .filter(({ login }) => login !== owner)
    .map(({ login, avatar_url }) => ({ login, avatarUrl: avatar_url }));

type FetchDataAction = ThunkAction<
  // Promise<void>,
  any,
  RootState,
  unknown,
  AnyAction
>;

let timer: ReturnType<typeof setTimeout> | null = null;

type FetchData<T extends RequestParams> = (requestParams: T) => FetchDataAction;

const fetchDataCreator =
  <P extends ResponseData, R extends RequestParams, T>(
    urlBuilder: UrlBuilder<R>,
    formatter: FormatResult<P, R, T>,
    actionCreatorApi: FetchDataActionCreatorApi<T>
  ): FetchData<R> =>
  (requestParams: R): FetchDataAction =>
  (dispatch: Dispatch) => {
    dispatch(actionCreatorApi.fetchDataStart());
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fetch(urlBuilder(requestParams))
        .then((res) => {
          // if (res.status === 404) return null;
          if (!res.ok) throw new Error();
          return res.json();
        })
        .then((data) => formatter(data, requestParams))
        .then((data) => {
          dispatch(actionCreatorApi.fetchDataSuccess(data));
        })
        .catch((error) => {
          dispatch(actionCreatorApi.fetchDataError(error));
        });
    }, DEBOUNCE_TIMEOUT);
  };

export const fetchUser: FetchData<RequestUserParams> = fetchDataCreator(
  userUrl,
  formatUserResult,
  userActionCreatorApi
);

export const fetchContributors: FetchData<RequestContributorsParams> =
  fetchDataCreator(
    contributorsUrl,
    formatContributorsResult,
    contributorsActionCreatorApi
  );
