import { Avatar, Box, Stack } from '@mui/material';
import { FC } from 'react';
import { UserData } from '../utilities';

type Props = {
  userData: UserData;
  role: string;
};

const UserInfoCard: FC<Props> = ({ userData, role }) => {
  return (
    <Box>
      <Stack
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={2}
      >
        <div>{role}</div>
        <Avatar
          alt={userData.login}
          src={userData.avatarUrl}
          sx={{ width: 80, height: 80 }}
        />
        <div>{userData.login}</div>
      </Stack>
    </Box>
  );
};

export default UserInfoCard;
