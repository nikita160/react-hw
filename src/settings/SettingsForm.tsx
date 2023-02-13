import { Autocomplete, Button, Chip, Stack, TextField } from '@mui/material';
import { FC, useReducer, useState } from 'react';
import { api, RequestContributorParams, RequestRepoParams } from '../api';
import { getSettings, setSettings, UserData } from '../utilities';
import AsyncInput from './AsyncInput';
import useFetchData from './useFetchData';

type Props = { closeHandler: () => void };

type State = {
  inputLogin: string;
  userData: UserData | null;
  inputRepo: string;
  repo: string | null;
  blacklist: string[];
};

enum ActionType {
  setInputLogin,
  setUserData,
  setInputRepo,
  setRepo,
  setContributors,
  setBlacklist,
}

type Action =
  | {
      type: ActionType.setInputLogin | ActionType.setInputRepo;
      payload: string;
    }
  | {
      type: ActionType.setUserData;
      payload: UserData | null;
    }
  | {
      type: ActionType.setRepo;
      payload: string | null;
    }
  | {
      type: ActionType.setBlacklist;
      payload: string[];
    };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionType.setInputLogin: {
      return {
        ...state,
        inputLogin: action.payload,
        inputRepo: '',
        repo: null,
        blacklist: [],
      };
    }
    case ActionType.setUserData: {
      return {
        ...state,
        userData: action.payload,
      };
    }

    case ActionType.setInputRepo: {
      return { ...state, inputRepo: action.payload, blacklist: [] };
    }

    case ActionType.setRepo: {
      return { ...state, repo: action.payload };
    }
    case ActionType.setBlacklist: {
      return { ...state, blacklist: action.payload };
    }
  }
  return state;
};

const SettingsForm: FC<Props> = ({ closeHandler }) => {
  const settings = getSettings();

  const [state, dispatch] = useReducer(reducer, {
    inputLogin: settings?.user.login || '',
    userData: settings?.user || null,
    inputRepo: settings?.repo || '',
    repo: settings?.repo || null,

    blacklist: settings?.blacklist || [],
  });

  //В датасете login и avatar_url
  const userSuggestList = useFetchData<string, UserData[]>(
    api.getUsersList,
    state.inputLogin,
    [state.inputLogin]
  );

  const repoSuggestList = useFetchData<RequestRepoParams, string[]>(
    api.getRepoList,
    {
      login: state.userData?.login || '',
      query: state.inputRepo,
    },
    [state.inputRepo, state.userData?.login],
    () => Boolean(state.userData)
  );

  const contributorList = useFetchData<RequestContributorParams, UserData[]>(
    api.getContributors,
    {
      owner: state.userData?.login || '',
      repo: state.repo || '',
    },
    [state.repo, state.userData],
    () => Boolean(state.repo && state.userData)
  );

  const loginInputChangeHandler = (inputValue: string) => {
    dispatch({ type: ActionType.setInputLogin, payload: inputValue });
  };

  const repoInputChangeHandler = (inputValue: string) => {
    dispatch({ type: ActionType.setInputRepo, payload: inputValue });
  };

  const userChangeHandler = (value: string | null) => {
    let userData: UserData | null = null;
    if (userSuggestList.data !== null) {
      userData = userSuggestList.data.find(
        (item) => item.login === value
      ) as UserData;
    }

    dispatch({ type: ActionType.setUserData, payload: userData });
  };

  const repoChangeHandler = (value: string | null) => {
    dispatch({ type: ActionType.setRepo, payload: value });
  };

  const blackListChangeHandler = (
    event: React.SyntheticEvent,
    value: string[]
  ) => {
    dispatch({ type: ActionType.setBlacklist, payload: value });
  };

  const buttonHandler = (event: React.SyntheticEvent): void => {
    event.preventDefault();
    if (state.userData && state.repo) {
      setSettings({
        user: state.userData,
        repo: state.repo,
        blacklist: state.blacklist,
      });
    }
    closeHandler();
  };

  return (
    <form>
      <Stack spacing={2} sx={{ width: 300 }}>
        <AsyncInput
          id="login"
          label="Login"
          options={
            userSuggestList.data
              ? userSuggestList.data.map((item) => item.login)
              : []
          }
          isLoading={userSuggestList.isLoading}
          onInputChange={loginInputChangeHandler}
          inputValue={state.inputLogin}
          onChange={userChangeHandler}
          value={state.userData ? state.userData.login : null}
        />

        <AsyncInput
          id="repo"
          label="Repo"
          options={repoSuggestList.data || []}
          isLoading={repoSuggestList.isLoading}
          onInputChange={repoInputChangeHandler}
          inputValue={state.inputRepo}
          onChange={repoChangeHandler}
          value={state.repo}
          disabled={!state.userData}
        />

        <Autocomplete
          onChange={blackListChangeHandler}
          disabled={!state.repo}
          multiple
          id="blacklist"
          value={state.blacklist}
          options={
            contributorList.data
              ? contributorList.data.map((item) => item.login)
              : []
          }
          filterSelectedOptions
          renderTags={(value: readonly string[], getTagProps) =>
            value.map((option: string, index: number) => (
              <Chip
                variant="outlined"
                label={option}
                {...getTagProps({ index })}
              />
            ))
          }
          renderInput={(params) => (
            <TextField {...params} label="Blacklist" placeholder="Blacklist" />
          )}
        />

        <Button
          onClick={buttonHandler}
          type="submit"
          variant="contained"
          disabled={!state.userData || !state.repo}
        >
          Save
        </Button>
      </Stack>
    </form>
  );
};

export default SettingsForm;
