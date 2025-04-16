import React from 'react';
import Select from 'react-select';

const FilterDropdown = ({ options, value, onChange, placeholder }) => {
  return (
    <Select
      isMulti
      options={options}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="filter-dropdown"
      classNamePrefix="filter"
      maxMenuHeight={200}
      menuPlacement="auto"
      isClearable={true}
    />
  );
};

export default FilterDropdown;
