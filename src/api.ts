import { UserData } from './utilities';

export type RequestRepoParams = {
  login: string;
  query: string;
};

export type RequestContributorParams = {
  owner: string;
  repo: string;
};

export type GetDataCallback<P, T> = (param: P) => Promise<T>;

type Api = {
  getUsersList: GetDataCallback<string, UserData[]>;
  getRepoList: GetDataCallback<RequestRepoParams, string[]>;
  getContributors: GetDataCallback<RequestContributorParams, UserData[]>;
};

export const api: Api = {
  getUsersList: (userLogin: string) => {
    if (!userLogin) userLogin = '*';
    return getData<DataObj, UserData[]>(
      'search/users?q=' + userLogin,
      ({ items }) =>
        items.map(({ login, avatar_url }) => ({ login, avatarUrl: avatar_url }))
    );
  },

  getRepoList: ({ login, query }) => {
    if (!login) Promise.reject();
    if (!query) query = '';
    return getData<DataObj, string[]>(
      `search/repositories?q=user:${login} ${query}`,
      ({ items }) => items.map(({ name }) => name)
    );
  },

  getContributors: ({ owner, repo }) => {
    return getData<DataArr, UserData[]>(
      `repos/${owner}/${repo}/contributors`,

      (data) =>
        data
          .filter((item) => item.login !== owner)
          .map((item) => ({ login: item.login, avatarUrl: item.avatar_url }))
    );
  },
};

type DataObj = {
  items: {
    login: string;
    name: string;
    avatar_url: string;
  }[];
};

type DataArr = { login: string; avatar_url: string }[];

const getData = <P, T>(
  route: string,
  formatter: (data: P) => T
): Promise<T> => {
  return fetch('https://api.github.com/' + route)
    .then((res) => {
      if (res.status !== 200) {
        throw new Error();
      } else return res.json();
    })
    .then((data) => formatter(data));
};

///https://api.github.com/search/users?q=niki

///https://api.github.com/search/repositories?q=user:{login}+q
