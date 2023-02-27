import {
  Autocomplete,
  Button,
  Chip,
  Stack,
  TextField,
  TextFieldProps,
} from '@mui/material';

import { FC, useEffect, useRef, useState } from 'react';

import { useAppDispatch, useAppSelector } from '../hooks/hooks';
import { fetchContributors, fetchUser } from '../store/asyncAction';
import { contributorsActionCreatorApi } from '../store/fetchingReducer';
import { setBlackList } from '../store/blackListReduser';
import { getSettings, setSettings } from '../utilities';

type Props = { closeHandler: () => void };

const SettingsForm: FC<Props> = ({ closeHandler }) => {
  const user = useAppSelector((state) => state.userFetching.data);
  const contributors = useAppSelector(
    (state) => state.contributorsFetching.data
  );
  const blackList = useAppSelector((state) => state.blackList.value);

  const dispatch = useAppDispatch();

  const loginRef = useRef<TextFieldProps>({ value: '' });
  const repoRef = useRef<TextFieldProps>({ value: '' });

  const [disabledButton, setDisabledButton] = useState(true);

  const commonChangeHangler = () => {
    dispatch(setBlackList([]));
    dispatch(contributorsActionCreatorApi.clearState());
  };

  const loginChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    commonChangeHangler();
    repoRef.current.value = '';
    dispatch(fetchUser({ login: event.target.value }));
  };

  const repoChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    commonChangeHangler();
    const repo: string = repoRef.current.value as string;
    if (user?.login)
      dispatch(
        fetchContributors({
          owner: user.login,
          repo,
        })
      );
  };

  const blackListChangeHandler = (
    event: React.SyntheticEvent,
    value: string[]
  ) => {
    dispatch(setBlackList(value));
    setDisabledButton(false);
  };

  const buttonHandler = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    const repo: string = repoRef.current.value as string;
    if (user && repo && contributors) {
      setSettings({
        user,
        repo,
        blackList,
      });
    }
    closeHandler();
  };

  return (
    <form>
      <Stack spacing={2}>
        <TextField
          autoComplete="off"
          required
          id="login"
          label="Login"
          onChange={loginChangeHandler}
          defaultValue={getSettings()?.user.login || ''}
          inputRef={loginRef}
        />

        <TextField
          autoComplete="off"
          required
          id="repo"
          label="Repo"
          onChange={repoChangeHandler}
          defaultValue={getSettings()?.repo || ''}
          disabled={!user}
          inputRef={repoRef}
        />

        <Autocomplete
          onChange={blackListChangeHandler}
          disabled={!contributors}
          multiple
          id="blacklist"
          value={blackList}
          defaultValue={getSettings()?.blackList || []}
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
          disabled={!user || !contributors || disabledButton}
        >
          Save settings
        </Button>
      </Stack>
    </form>
  );
};

export default SettingsForm;
