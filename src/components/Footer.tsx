import { FC } from 'react';
import styles from './Footer.module.css';

const Footer: FC = () => {
  return (
    <footer className={styles.footer}>
      &copy;&nbsp;{new Date().getFullYear()} Nikita Maslennikov
    </footer>
  );
};

export default Footer;
