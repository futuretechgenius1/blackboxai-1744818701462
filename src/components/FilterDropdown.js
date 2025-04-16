import React from 'react';
import Select from 'react-select';

const FilterDropdown = ({ options, value, onChange, placeholder }) => {
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      borderColor: state.isFocused ? '#2563eb' : '#e5e7eb',
      boxShadow: state.isFocused ? '0 0 0 1px #2563eb' : 'none',
      '&:hover': {
        borderColor: '#2563eb',
      },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected 
        ? '#2563eb'
        : state.isFocused 
          ? '#dbeafe'
          : 'transparent',
      color: state.isSelected ? 'white' : '#1f2937',
      cursor: 'pointer',
      '&:active': {
        backgroundColor: '#2563eb',
      },
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: '#dbeafe',
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: '#2563eb',
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: '#2563eb',
      '&:hover': {
        backgroundColor: '#2563eb',
        color: 'white',
      },
    }),
  };

  return (
    <Select
      isMulti
      options={options}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      styles={customStyles}
      className="w-full"
      classNamePrefix="filter"
      maxMenuHeight={200}
      menuPlacement="auto"
      isClearable={true}
      theme={(theme) => ({
        ...theme,
        colors: {
          ...theme.colors,
          primary: '#2563eb',
          primary25: '#dbeafe',
          primary50: '#bfdbfe',
          primary75: '#93c5fd',
        },
      })}
    />
  );
};

export default FilterDropdown;
