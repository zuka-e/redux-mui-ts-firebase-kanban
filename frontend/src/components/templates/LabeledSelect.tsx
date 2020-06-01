import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
  })
);

interface LabeledSelectProps {
  label: string;
  options: object;
  selectedValue: string;
  handleChange: (e: React.ChangeEvent<{ value: unknown }>) => void;
}
const LabeledSelect: React.FC<LabeledSelectProps> = (props) => {
  const { label, options, selectedValue, handleChange } = props;
  const classes = useStyles();

  const htmlId = 'filter';

  return (
    <FormControl className={classes.formControl}>
      <InputLabel id={htmlId}>{label}</InputLabel>
      <Select
        labelId={htmlId}
        id='filter-select'
        value={selectedValue} // 非選択時表示文字
        onChange={handleChange}
      >
        {Object.values(options).map((option, index) => (
          // value属性の値をイベントで捕捉
          <MenuItem key={index} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default LabeledSelect;
