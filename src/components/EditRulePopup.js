import React, { useState, useEffect } from 'react';
import Select from 'react-select';

const DEFAULT_FIELDS = [
  'Rule Type',
  'MD State',
  'Ship to State',
  'Zip Code',
  'Channel',
  'Reg Cat Code'
];

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
  const [errors, setErrors] = useState({});
  
  const additionalFields = ALL_FIELDS.filter(field => !DEFAULT_FIELDS.includes(field))
    .map(field => ({ value: field, label: field }));

  useEffect(() => {
    if (rule) {
      setFormData(rule);
      const activeFields = ALL_FIELDS.filter(field => rule[field] !== undefined);
      setSelectedFields(activeFields);
    }
  }, [rule]);

  const handleFieldChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when field is modified
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleAdditionalFieldsChange = (selected) => {
    const newFields = [
      ...DEFAULT_FIELDS,
      ...(selected || []).map(option => option.value)
    ];
    setSelectedFields(newFields);
  };

  const validateForm = () => {
    const newErrors = {};
    DEFAULT_FIELDS.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = 'This field is required';
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="px-6 py-4 border-b border-borderColor">
          <h2 className="text-2xl font-semibold text-gray-800">
            {isNew ? 'Add New Rule' : 'Edit Rule'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
          <div className="space-y-6">
            {/* Default fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {DEFAULT_FIELDS.map(field => (
                <div key={field} className="space-y-1">
                  <label htmlFor={field} className="form-label">
                    {field}
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    id={field}
                    value={formData[field] || ''}
                    onChange={(e) => handleFieldChange(field, e.target.value)}
                    className={`form-input ${errors[field] ? 'border-red-500 focus:ring-red-200' : ''}`}
                  />
                  {errors[field] && (
                    <p className="text-red-500 text-sm mt-1">{errors[field]}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Additional fields selector */}
            <div className="space-y-1">
              <label className="form-label">Additional Fields</label>
              <Select
                isMulti
                options={additionalFields}
                value={additionalFields.filter(option => 
                  selectedFields.includes(option.value) && !DEFAULT_FIELDS.includes(option.value)
                )}
                onChange={handleAdditionalFieldsChange}
                className="w-full"
                classNamePrefix="select"
                theme={(theme) => ({
                  ...theme,
                  colors: {
                    ...theme.colors,
                    primary: '#2563eb',
                    primary25: '#dbeafe',
                  },
                })}
              />
            </div>

            {/* Dynamic additional fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedFields
                .filter(field => !DEFAULT_FIELDS.includes(field))
                .map(field => (
                  <div key={field} className="space-y-1">
                    <label htmlFor={field} className="form-label">{field}</label>
                    <input
                      type="text"
                      id={field}
                      value={formData[field] || ''}
                      onChange={(e) => handleFieldChange(field, e.target.value)}
                      className="form-input"
                    />
                  </div>
                ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <button
              type="button"
              onClick={onCancel}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              {isNew ? 'Add Rule' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditRulePopup;
