import { Button, LinearProgress } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { getRandom, sleep } from '../utilities';
import styles from './ActivityCard.module.css';
import Message from './Message';
import UserInfoBage from './UserInfoBage';

enum Messages {
  NO_DATA = 'Please input correct login and repo to choose your reviewer',
  NO_REVIEWERS = 'No avilable reviewrs :(',
  ONLY_REVIEWER = 'Only one reviewer is available',
  PUSH_BUTTON = '\u2191 Push the red button above to choose reviewer \u2191',
  SUCCESS = 'Congratulations! You reviewer is:',
  IN_PROGRESS = `Choosing reviewer....`,
}

const TIME_INTERVAL = 200;

type Props = {
  reviewers: UserData[] | null;
};

const ActivityCard: FC<Props> = ({ reviewers }) => {
  const [reviewer, setReviewer] = useState<UserData | null>(null);
  const [inProgress, setInProgress] = useState(false);

  useEffect(() => {
    setReviewer(null);
  }, [reviewers]);

  const onClickHandler = async (event: React.SyntheticEvent) => {
    if (reviewers) {
      const randomNum: number = getRandom(reviewers.length);
      setInProgress(true);
      const list: UserData[] = reviewers.slice(0, randomNum);
      for (let item of list) {
        await sleep(TIME_INTERVAL);
        setReviewer(item);
      }
      setInProgress(false);
    }
  };

  return (
    <>
      <Button
        onClick={onClickHandler}
        sx={{ width: '100%' }}
        variant="contained"
        color="error"
        disabled={!reviewers || reviewers.length <= 1 || inProgress}
      >
        Choose reviewer
      </Button>
      <div className={styles.messageContainer}>
        {reviewer && !inProgress && <Message message={Messages.SUCCESS} />}
        {!reviewer && !inProgress && reviewers && reviewers.length > 1 && (
          <Message message={Messages.PUSH_BUTTON} />
        )}
        {reviewers && reviewers.length === 0 && (
          <Message message={Messages.NO_REVIEWERS} />
        )}

        {inProgress && <Message message={Messages.IN_PROGRESS} />}
        {reviewers?.length === 1 && (
          <Message message={Messages.ONLY_REVIEWER} />
        )}
      </div>
      <div className={styles.resultContainer}>
        {reviewer && <UserInfoBage userData={reviewer} role="contributor" />}
        {reviewers?.length === 1 && (
          <UserInfoBage userData={reviewers[0]} role="contributor" />
        )}
      </div>
      <div className={styles.progressBarContainer}>
        {inProgress && <LinearProgress style={{ width: '100%' }} />}
      </div>
    </>
  );
};

export default ActivityCard;
