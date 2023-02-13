import { Octokit } from 'octokit';
import { UserData } from './utilities';

const octokit = new Octokit({
  auth: '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',
});

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
      '/search/users',
      { q: userLogin },
      ({ items }) =>
        items.map(({ login, avatar_url }) => ({ login, avatarUrl: avatar_url }))
    );
  },

  getRepoList: ({ login, query }) => {
    if (!login) Promise.reject();
    if (!query) query = '';
    return getData<DataObj, string[]>(
      '/search/repositories',
      { q: `user:${login} ${query}` },
      ({ items }) => items.map(({ name }) => name)
    );
  },

  getContributors: ({ owner, repo }) => {
    return getData<DataArr, UserData[]>(
      '/repos/{owner}/{repo}/contributors',
      {
        owner,
        repo,
      },
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

type RequestUserOptions = {
  q: string;
};

type RequestRepoOptions = {
  q: string;
};

type RequestContributorOptions = {
  owner: string;
  repo: string;
};

type RequestOptions =
  | RequestUserOptions
  | RequestRepoOptions
  | RequestContributorOptions;

const getData = <P, T>(
  route: string,
  options: RequestOptions,
  formater: (data: P) => T
) => {
  return octokit.request(`GET ${route}`, options).then((res) => {
    if (res.status !== 200) {
      throw new Error();
    } else {
      return formater(res.data);
    }
  });
};
