import { FC, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/hooks';
import { fetchContributors } from '../store/asyncAction';
import { getSettings } from '../utilities';
import ActivityCard from './ActivityCard';
import SelectionInfo from './SelectionInfo';

const MainCard: FC = () => {
  const userState = useAppSelector((state) => state.userFetching);
  const contributorsState = useAppSelector(
    (state) => state.contributorsFetching
  );

  const dispatch = useAppDispatch();

  const blackList = useAppSelector((state) => state.blackList.value);

  const reviewers: UserData[] | null =
    contributorsState.data &&
    contributorsState.data.filter(
      (user) => !blackList.find((item) => item === user.login)
    );

  useEffect(() => {
    const login = getSettings()?.user.login;
    const repo = getSettings()?.repo;
    if (login && repo) {
      dispatch(
        fetchContributors({
          owner: login,
          repo,
        })
      );
    }
  }, []);

  return (
    <>
      <div style={{ marginTop: '2em' }}>
        <SelectionInfo
          userData={userState.data}
          userError={userState.error}
          userLoading={userState.loading}
          reviewersData={reviewers}
          reviewersError={contributorsState.error}
          reviewersLoading={contributorsState.loading}
        />
      </div>
      <ActivityCard reviewers={reviewers} />
    </>
  );
};

export default MainCard;
