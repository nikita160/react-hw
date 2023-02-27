import { LinearProgress } from '@mui/material';
import { FC } from 'react';
import UserInfoBage from './UserInfoBage';
import styles from './SelectionInfo.module.css';
import Message from './Message';
import ReviewersInfo from './ReviewersInfo';

enum Messages {
  NO_USER_SELECTED = 'No user selected',
  INCORRECT_USER = 'Incorrect user login',
}

type Props = {
  userLoading: boolean;
  userError: string | null;
  userData: UserData | null;
  reviewersLoading: boolean;
  reviewersError: string | null;
  reviewersData: UserData[] | null;
};

const SelectionInfo: FC<Props> = ({
  userLoading,
  userError,
  userData,
  reviewersLoading,
  reviewersData,
  reviewersError,
}) => {
  return (
    <div className={styles.container}>
      {!userLoading && !userError && !userData && (
        <Message message={Messages.NO_USER_SELECTED} />
      )}
      {userLoading && <LinearProgress style={{ width: '100%' }} />}
      {!userLoading && userData && (
        <UserInfoBage userData={userData} role="owner" />
      )}
      {!userLoading && userError && (
        <Message message={Messages.INCORRECT_USER} error={true} />
      )}
      {userData && (
        <ReviewersInfo
          data={reviewersData}
          loading={reviewersLoading}
          error={reviewersError}
        />
      )}
    </div>
  );
};

export default SelectionInfo;
