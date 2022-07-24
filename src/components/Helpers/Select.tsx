import * as React from 'react';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';

const ITEM_HEIGHT = 40;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 10.5 + ITEM_PADDING_TOP,
      width: 150,
    },
  },
};

interface Props {
  onChange: (value: string) => void;
  selected: string;
  options: Array<string>;
  label: string;
}

const BasicSelect: React.FC<Props> = ({ onChange, options, label, selected }: Props) => (
  <FormControl fullWidth>
    <InputLabel id="demo-simple-select-label">{label}</InputLabel>
    <Select
      labelId="demo-simple-select-label"
      id="demo-simple-select"
      value={selected}
      // selected={selected}
      label="Category"
      input={<Input />}
      onChange={(event: React.ChangeEvent<any>) => onChange(event.target.value)}
      renderValue={(chosen: any) => chosen}
      MenuProps={MenuProps}
    >
      {options.map((option) => (
        <MenuItem key={option} value={option}>
          <Checkbox checked={selected.indexOf(option) > -1} />
          <ListItemText primary={option} />
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);

export default BasicSelect;
