import { CircularProgress } from '@mui/material';
import { FC } from 'react';
import AvatarGroup from './AvatarGroup';
import Message from './Message';
import styles from './ReviewersInfo.module.css';

enum Messages {
  NO_REPO_SELECTED = 'No repo selected',
  INCORRECT_REPO = "Repo doesn't exist",
  NO_REVIEWERS = 'No potential reviewrs',
}

type Props = {
  loading: boolean;
  error: string | null;
  data: UserData[] | null;
};

const ReviewersInfo: FC<Props> = ({ loading, error, data }) => {
  return (
    <div className={styles.container}>
      {loading && <CircularProgress />}

      {data && data.length > 0 && <AvatarGroup users={data} />}
      {data && data.length === 0 && <Message message={Messages.NO_REVIEWERS} />}
      {!data && !loading && !error && (
        <Message message={Messages.NO_REPO_SELECTED} />
      )}
      {error && <Message message={Messages.INCORRECT_REPO} error />}
    </div>
  );
};

export default ReviewersInfo;
