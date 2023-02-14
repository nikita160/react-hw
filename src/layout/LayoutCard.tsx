import { FormControlLabel, FormGroup, Switch } from '@mui/material';
import { FC, ReactNode, useState } from 'react';
import MainCard from '../main/MainCard';
import SettingsForm from '../settings/SettingsForm';
import { getSettings, Settings } from '../utilities';
import styles from './LayoutCard.module.css';

const LayoutCard: FC = () => {
  const [visibleSettingsForm, setVisibleSettingsForm] = useState(true);
  const switchHandler = (): void => {
    setVisibleSettingsForm((prev) => !prev);
  };

  return (
    <div className={styles.layoutCard}>
      <FormGroup>
        <FormControlLabel
          control={
            <Switch checked={visibleSettingsForm} onChange={switchHandler} />
          }
          label="Settings"
        />
      </FormGroup>

      {visibleSettingsForm && <SettingsForm closeHandler={switchHandler} />}
      {!visibleSettingsForm && <MainCard />}
    </div>
  );
};

export default LayoutCard;
