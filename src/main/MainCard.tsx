import { FC, useEffect, useState } from 'react';
import { getSettings, Settings } from '../utilities';
import ActivityCard from './ActivityCard';
import styles from './MainCard.module.css';

const MainCard: FC = () => {
  const settings: Settings | null = getSettings();
  return (
    <div className={styles.mainCard}>
      {!settings && <div>No user selected, please setup the settings.</div>}
      {settings && <ActivityCard settings={settings} />}
    </div>
  );
};

export default MainCard;
