import React, { useState, useEffect } from 'react';
import Select from 'react-select';

// Default fields that should be shown initially
const DEFAULT_FIELDS = [
  'Rule Type',
  'MD State',
  'Ship to State',
  'Zip Code',
  'Channel',
  'Reg Cat Code'
];

// All available fields
const ALL_FIELDS = [
  'Rule Type',
  'MD State',
  'Ship to State',
  'Zip Code',
  'Channel',
  'Reg Cat Code',
  'Drug Schedule',
  'Refill #',
  'Quantity',
  'Days Supply',
  'User Location',
  'Dispensing Location',
  'Protocol',
  'Days Ago',
  'Max Days Supply',
  'Max Quantity',
  'Max Refill',
  'Max Days Allowed to Expiry Date'
];

const EditRulePopup = ({ rule, onSave, onCancel, isNew = false }) => {
  const [formData, setFormData] = useState({});
  const [selectedFields, setSelectedFields] = useState(DEFAULT_FIELDS);
  
  // Additional fields that can be selected (excluding default fields)
  const additionalFields = ALL_FIELDS.filter(field => !DEFAULT_FIELDS.includes(field));

  useEffect(() => {
    if (rule) {
      setFormData(rule);
    }
  }, [rule]);

  const handleFieldChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAdditionalFieldsChange = (selected) => {
    const newFields = [
      ...DEFAULT_FIELDS,
      ...(selected || []).map(option => option.value)
    ];
    setSelectedFields(newFields);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="edit-rule-popup">
      <div className="popup-content">
        <h2>{isNew ? 'Add New Rule' : 'Edit Rule'}</h2>
        <form onSubmit={handleSubmit}>
          {/* Default fields */}
          {DEFAULT_FIELDS.map(field => (
            <div key={field} className="form-group">
              <label htmlFor={field}>{field}</label>
              <input
                type="text"
                id={field}
                value={formData[field] || ''}
                onChange={(e) => handleFieldChange(field, e.target.value)}
              />
            </div>
          ))}

          {/* Additional fields selector */}
          <div className="form-group">
            <label>Additional Fields</label>
            <Select
              isMulti
              options={additionalFields.map(field => ({
                value: field,
                label: field
              }))}
              onChange={handleAdditionalFieldsChange}
              className="additional-fields-select"
            />
          </div>

          {/* Dynamically added fields */}
          {selectedFields
            .filter(field => !DEFAULT_FIELDS.includes(field))
            .map(field => (
              <div key={field} className="form-group">
                <label htmlFor={field}>{field}</label>
                <input
                  type="text"
                  id={field}
                  value={formData[field] || ''}
                  onChange={(e) => handleFieldChange(field, e.target.value)}
                />
              </div>
            ))}

          <div className="button-group">
            <button type="submit" className="save-button">
              {isNew ? 'Add Rule' : 'Save Changes'}
            </button>
            <button type="button" className="cancel-button" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditRulePopup;
