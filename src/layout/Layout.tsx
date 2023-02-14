import { FC, ReactNode } from 'react';
import styles from './layout.module.css';

type Props = { children: ReactNode };

const Layout: FC<Props> = ({ children }) => {
  return <div className={styles.layout}>{children}</div>;
};

export default Layout;
