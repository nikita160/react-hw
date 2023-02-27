import { Avatar } from '@mui/material';
import { FC } from 'react';

type Props = {
  userData: UserData;
  role: string;
};

const UserInfoBage: FC<Props> = ({ userData, role }) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        width: '200px',
      }}
    >
      <Avatar
        alt={userData.login}
        src={userData.avatarUrl}
        sx={{ width: 50, height: 50 }}
      ></Avatar>
      <div style={{ marginLeft: '10px' }}>
        <div>{userData.login}</div>
        <div style={{ color: '#c2c2d6' }}>{role.toLowerCase()}</div>
      </div>
    </div>
  );
};

export default UserInfoBage;
