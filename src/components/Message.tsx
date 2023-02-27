import { FC } from 'react';
import styles from './Message.module.css';

type Props = {
  message: string;
  error?: boolean;
};

const Message: FC<Props> = ({ message, error }) => {
  const classes = `${styles.message} ${error ? styles.error : ''}`;
  return <div className={classes}>{message}</div>;
};

export default Message;
