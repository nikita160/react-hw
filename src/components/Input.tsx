import { TextField } from '@mui/material';
import { FC } from 'react';

type Props = {
  onChange: (value: string) => void;
  id: string;
  label: string;
  disabled?: boolean;
  value: string;
};

const Input: FC<Props> = ({
  onChange: onChange,

  id,
  label,
  disabled,
  value,
}) => {
  const handler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const currentValue = event.target.value.replace(/\s*/g, '');
    if (currentValue === value) return;
    onChange(currentValue);
  };

  return (
    <TextField
      autoComplete="off"
      required
      id={id}
      label={label}
      onChange={handler}
      disabled={disabled}
      value={value}
    />
  );
};

export default Input;
