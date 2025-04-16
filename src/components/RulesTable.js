import React, { useState, useEffect } from 'react';
import FilterDropdown from './FilterDropdown';
import EditRulePopup from './EditRulePopup';
import ruleService from '../services/ruleService';

// All available fields for the table
const TABLE_FIELDS = [
  'Rule Type', 'MD State', 'Ship to State', 'Zip Code', 'Channel',
  'Reg Cat Code', 'Drug Schedule', 'Refill #', 'Quantity', 'Days Supply',
  'User Location', 'Dispensing Location', 'Protocol', 'Days Ago',
  'Max Days Supply', 'Max Quantity', 'Max Refill', 'Max Days Allowed to Expiry Date'
];

function RulesTable() {
  const [rules, setRules] = useState([]);
  const [filters, setFilters] = useState({});
  const [filterOptions, setFilterOptions] = useState({});
  const [editingRule, setEditingRule] = useState(null);
  const [isAddingRule, setIsAddingRule] = useState(false);
  const [isWriteAccess, setIsWriteAccess] = useState(false); // Simulated access control

  // Load initial data
  useEffect(() => {
    loadRules();
    loadFilterOptions();
  }, []);

  // Load rules from service
  const loadRules = async () => {
    try {
      const rulesData = await ruleService.getRules();
      setRules(rulesData);
    } catch (error) {
      console.error('Error loading rules:', error);
    }
  };

  // Load filter options for each field
  const loadFilterOptions = async () => {
    try {
      const options = {};
      for (const field of TABLE_FIELDS) {
        options[field] = await ruleService.getFieldOptions(field);
      }
      setFilterOptions(options);
    } catch (error) {
      console.error('Error loading filter options:', error);
    }
  };

  // Handle filter changes
  const handleFilterChange = (field, selectedOptions) => {
    setFilters(prev => ({
      ...prev,
      [field]: selectedOptions
    }));
  };

  // Filter rules based on selected filters
  const getFilteredRules = () => {
    return rules.filter(rule => {
      return Object.entries(filters).every(([field, selectedOptions]) => {
        if (!selectedOptions || selectedOptions.length === 0) return true;
        return selectedOptions.some(option => 
          option.value === rule[field]
        );
      });
    });
  };

  // Handle rule editing
  const handleEditRule = (rule) => {
    if (!isWriteAccess) {
      alert('You do not have write access to edit rules.');
      return;
    }
    setEditingRule(rule);
  };

  // Handle adding new rule
  const handleAddRule = () => {
    if (!isWriteAccess) {
      alert('You do not have write access to add rules.');
      return;
    }
    setIsAddingRule(true);
  };

  // Save rule (new or edited)
  const handleSaveRule = async (ruleData) => {
    try {
      if (isAddingRule) {
        await ruleService.addRule(ruleData);
      } else {
        await ruleService.updateRule(ruleData);
      }
      loadRules(); // Reload rules after save
      setEditingRule(null);
      setIsAddingRule(false);
    } catch (error) {
      console.error('Error saving rule:', error);
      alert('Error saving rule. Please try again.');
    }
  };

  // Extract data as CSV
  const handleExtractData = async () => {
    try {
      const csvContent = await ruleService.extractRules();
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'regulatory-rules.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error extracting data:', error);
      alert('Error extracting data. Please try again.');
    }
  };

  return (
    <div className="rules-table-container">
      <div className="table-actions">
        {isWriteAccess && (
          <button onClick={handleAddRule} className="add-rule-button">
            Add New Rule
          </button>
        )}
        <button onClick={handleExtractData} className="extract-data-button">
          Extract Data
        </button>
      </div>

      <div className="filters-container">
        {TABLE_FIELDS.map(field => (
          <div key={field} className="filter-field">
            <label>{field}</label>
            <FilterDropdown
              options={filterOptions[field] || []}
              value={filters[field]}
              onChange={(selected) => handleFilterChange(field, selected)}
              placeholder={`Filter ${field}...`}
            />
          </div>
        ))}
      </div>

      <div className="table-wrapper">
        <table className="rules-table">
          <thead>
            <tr>
              {TABLE_FIELDS.map(field => (
                <th key={field}>{field}</th>
              ))}
              {isWriteAccess && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {getFilteredRules().map(rule => (
              <tr key={rule.id}>
                {TABLE_FIELDS.map(field => (
                  <td key={field}>{rule[field]}</td>
                ))}
                {isWriteAccess && (
                  <td>
                    <button
                      onClick={() => handleEditRule(rule)}
                      className="edit-button"
                    >
                      Edit
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(editingRule || isAddingRule) && (
        <EditRulePopup
          rule={editingRule}
          isNew={isAddingRule}
          onSave={handleSaveRule}
          onCancel={() => {
            setEditingRule(null);
            setIsAddingRule(false);
          }}
        />
      )}
    </div>
  );
}

export default RulesTable;
