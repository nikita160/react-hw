import { FormControlLabel, FormGroup, Stack, Switch } from '@mui/material';
import { FC, useState } from 'react';
import SettingsForm from '../components/SettingsForm';
import Footer from './Footer';
import Header from './Header';
import styles from './LayoutCard.module.css';
import MainCard from './MainCard';

const LayoutCard: FC = () => {
  const [visibleSettingsForm, setVisibleSettingsForm] = useState(true);
  const switchHandler = (): void => {
    setVisibleSettingsForm((prev) => !prev);
  };

  return (
    <div className={styles.layoutCard}>
      <Header />
      <Stack spacing={1}>
        <FormGroup>
          <FormControlLabel
            control={
              <Switch checked={visibleSettingsForm} onChange={switchHandler} />
            }
            label="Settings"
          />
        </FormGroup>

        {visibleSettingsForm && <SettingsForm closeHandler={switchHandler} />}

        <MainCard />
      </Stack>
      <Footer />
    </div>
  );
};

export default LayoutCard;
