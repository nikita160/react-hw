import { Avatar } from '@mui/material';
import { FC } from 'react';
import styles from './AvatarGroup.module.css';

const MAX_ITEMS_NUM = 3;

type Props = {
  users: UserData[];
};

const AvatarGroup: FC<Props> = ({ users }) => {
  const diff = users.length - MAX_ITEMS_NUM;
  const group: JSX.Element[] = users
    .slice(0, MAX_ITEMS_NUM)
    .map((item) => (
      <Avatar
        key={item.login}
        src={item.avatarUrl}
        alt={item.login}
        sx={{ width: 22, height: 22 }}
      />
    ));

  return (
    <div>
      <div className={styles.container}>
        <div className={styles.avatarContainer}>{group}</div>
        {diff > 0 && (
          <div className={styles.extraText}>... and {diff} more</div>
        )}
      </div>
      <div style={{ color: '#c2c2d6' }}>reviewers</div>
    </div>
  );
};

export default AvatarGroup;
