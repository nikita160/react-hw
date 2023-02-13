import {
  Autocomplete,
  AutocompleteInputChangeReason,
  CircularProgress,
  TextField,
} from '@mui/material';
import { FC } from 'react';

type Props = {
  id: string;
  label: string;
  options: string[];
  isLoading: boolean;
  onInputChange: (inputValue: string) => void;
  inputValue: string;
  value: string | null;
  onChange: (value: string | null) => void;
  disabled?: boolean;
};

const AsyncInput: FC<Props> = ({
  id,
  label,
  options,
  isLoading,
  onInputChange,
  inputValue,
  onChange,
  value,
  disabled,
}) => {
  const onIinputChangeHandler = (
    event: React.SyntheticEvent,
    inputValue: string,
    reason: AutocompleteInputChangeReason
  ): void => {
    inputValue = inputValue.replace(/\s*/g, '');
    if (value && reason === 'input') {
      onChange(null);
    }
    onInputChange(inputValue);
  };

  const onChangeHandler = (
    event: React.SyntheticEvent,
    value: string | null
  ): void => {
    onChange(value);
  };

  return (
    <Autocomplete
      disabled={disabled}
      id={id}
      options={options}
      loading={isLoading}
      onInputChange={onIinputChangeHandler}
      inputValue={inputValue}
      onChange={onChangeHandler}
      value={value}
      openOnFocus
      blurOnSelect
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {isLoading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
};

export default AsyncInput;
