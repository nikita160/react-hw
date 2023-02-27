import { Autocomplete, Button, Chip, Stack, TextField } from '@mui/material';

import { FC, useState } from 'react';

import { useAppDispatch, useAppSelector } from '../hooks/hooks';
import { fetchContributors, fetchUser } from '../store/asyncAction';
import { contributorsActionCreatorApi } from '../store/fetchingReducer';
import { setBlackList } from '../store/blackListReduser';
import { getSettings, setSettings } from '../utilities';
import Input from './Input';

const SettingsForm: FC = () => {
  const user = useAppSelector((state) => state.userFetching.data);
  const contributors = useAppSelector(
    (state) => state.contributorsFetching.data
  );
  const blackList = useAppSelector((state) => state.blackList.value);

  const dispatch = useAppDispatch();

  const [login, setLogin] = useState<string>(getSettings()?.user.login || '');
  const [repo, setRepo] = useState<string>(getSettings()?.repo || '');

  const [wasChanged, setWasChanged] = useState(false);

  const commonChangeHangler = () => {
    dispatch(setBlackList([]));
    dispatch(contributorsActionCreatorApi.clearState());
    setWasChanged(true);
  };

  const loginChangeHandler = (value: string) => {
    commonChangeHangler();
    setLogin(value);
    setRepo('');
    dispatch(fetchUser({ login: value }));
  };

  const repoChangeHandler = (value: string) => {
    commonChangeHangler();
    setRepo(value);
    if (user?.login)
      dispatch(
        fetchContributors({
          owner: user.login,
          repo: value,
        })
      );
  };

  const blackListChangeHandler = (
    event: React.SyntheticEvent,
    value: string[]
  ) => {
    dispatch(setBlackList(value));
    setWasChanged(true);
  };

  const buttonHandler = async (event: React.SyntheticEvent) => {
    event.preventDefault();

    if (user && repo && contributors) {
      setSettings({
        user,
        repo,
        blackList,
      });
    }
    setWasChanged(false);
  };

  return (
    <form>
      <Stack spacing={2}>
        <Input
          id="login"
          label="Login"
          onChange={loginChangeHandler}
          value={login}
        />

        <Input
          id="repo"
          label="Repo"
          onChange={repoChangeHandler}
          disabled={!user}
          value={repo}
        />

        <Autocomplete
          onChange={blackListChangeHandler}
          disabled={!contributors}
          multiple
          id="blacklist"
          value={blackList}
          options={contributors ? contributors.map((item) => item.login) : []}
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
            <TextField {...params} label="Black List" placeholder="Blacklist" />
          )}
        />

        <Button
          onClick={buttonHandler}
          type="submit"
          variant="contained"
          disabled={!user || !contributors || !wasChanged}
        >
          Save settings
        </Button>
      </Stack>
    </form>
  );
};

export default SettingsForm;
