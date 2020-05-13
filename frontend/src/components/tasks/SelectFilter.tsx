import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import { TodoFilter } from './TaskList';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
  })
);

interface FilterProps {
  filterQuery: string;
  handleChange: (e: React.ChangeEvent<{ value: unknown }>) => void;
}
const SelectFilter: React.FC<FilterProps> = (props) => {
  const { filterQuery, handleChange } = props;
  const classes = useStyles();

  return (
    <FormControl className={classes.formControl}>
      <InputLabel id='card-filter'>Filter</InputLabel>
      <Select
        labelId='card-filter' // 'label'のid名と揃える
        id='filter-select'
        value={filterQuery} // 非選択時表示文字
        onChange={handleChange}
      >
        {Object.values(TodoFilter).map((value) => (
          // value属性の値をイベントで捕捉
          <MenuItem key={value} value={value}>
            {value}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectFilter;
