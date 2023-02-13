import { FC, useEffect, useState } from 'react';
import { getRandom, Settings, sleep, UserData } from '../utilities';
import UserInfoCard from './UserInfoCard';
import styles from './ActivityCard.module.css';
import {
  Alert,
  Button,
  CircularProgress,
  LinearProgress,
  Stack,
} from '@mui/material';
import { api } from '../api';

type Props = { settings: Settings };

type LoadingStatus = {
  isLoading: boolean;
  isLoaded: boolean;
  hasError: boolean;
};

enum Messages {
  noReviewrs = 'No reviewers :(',
  singleReviewer = 'Only one contributor able to review this repo',
  numberOfReviewers = 'Number of available reviewers: ',
  errorMessage = 'Something went wrong',
  choosingReviewer = 'Choosing a reviewer...',
  succesMessage = 'Congratulations!',
}

const ActivityCard: FC<Props> = ({ settings }) => {
  const [loadingStatus, setLoadingStatus] = useState<LoadingStatus>({
    isLoading: false,
    isLoaded: false,
    hasError: false,
  });
  const [reviewerList, setReviewerList] = useState<UserData[]>([]);
  const [reviewer, setReviewer] = useState<UserData | null>(null);
  const [isChoosing, setIsChoosing] = useState<boolean>(false);
  const [reviewerSelected, setReviewerSelected] = useState<boolean>(false);

  useEffect(() => {
    setLoadingStatus({ isLoading: true, isLoaded: false, hasError: false });
    api
      .getContributors({ owner: settings.user.login, repo: settings.repo })
      .then((res) =>
        setReviewerList(
          res.filter((item) => !settings.blacklist.includes(item.login))
        )
      )
      .then(() => {
        setLoadingStatus({ isLoading: false, isLoaded: true, hasError: false });
      })
      .catch(() => {
        setLoadingStatus({ isLoading: false, isLoaded: false, hasError: true });
      });
  }, []);

  const onClickHandler = async (event: React.SyntheticEvent) => {
    const randomNum: number = getRandom(reviewerList.length);
    const interval = 200;
    setIsChoosing(true);
    const list: UserData[] = reviewerList.slice(0, randomNum);
    for (let item of list) {
      await sleep(interval);
      setReviewer(item);
    }
    setIsChoosing(false);
    setReviewerSelected(true);
  };

  return (
    <div>
      <div className={styles.repo}>Repository: {settings.repo}</div>
      <Stack alignItems="center" p={2}>
        {loadingStatus.isLoading && <CircularProgress />}
        {loadingStatus.isLoaded && reviewerList.length === 0 && (
          <Alert severity="warning">{Messages.noReviewrs}</Alert>
        )}
        {loadingStatus.isLoaded && reviewerList.length === 1 && (
          <Alert severity="info">{Messages.singleReviewer}</Alert>
        )}
        {loadingStatus.isLoaded && reviewerList.length > 1 && (
          <Alert severity="info">
            {Messages.numberOfReviewers + reviewerList.length}
          </Alert>
        )}
      </Stack>
      <Stack alignItems="center" p={3} height={4}>
        {isChoosing && <div>{Messages.choosingReviewer}</div>}
      </Stack>
      <div className={styles.usersContainer}>
        <UserInfoCard userData={settings.user} role="Owner" />
        {reviewer && <UserInfoCard userData={reviewer} role="Reviewer" />}
      </div>
      <div className={styles.buttonContainer}>
        <Button
          disabled={isChoosing || reviewerList.length < 1}
          variant="contained"
          onClick={onClickHandler}
        >
          Select reviewer
        </Button>
      </div>
    </div>
  );
};

export default ActivityCard;
