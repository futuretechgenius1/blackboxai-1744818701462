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
  const [isWriteAccess, setIsWriteAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load initial data
  useEffect(() => {
    loadRules();
    loadFilterOptions();
  }, []);

  // Load rules from service
  const loadRules = async () => {
    try {
      setIsLoading(true);
      const rulesData = await ruleService.getRules();
      setRules(rulesData);
    } catch (error) {
      console.error('Error loading rules:', error);
    } finally {
      setIsLoading(false);
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
      loadRules();
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center gap-4 flex-wrap">
        {isWriteAccess && (
          <button
            onClick={handleAddRule}
            className="btn btn-primary flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add New Rule
          </button>
        )}
        <button
          onClick={handleExtractData}
          className="btn btn-secondary flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          Extract Data
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {TABLE_FIELDS.map(field => (
          <div key={field} className="space-y-1">
            <label className="form-label">{field}</label>
            <FilterDropdown
              options={filterOptions[field] || []}
              value={filters[field]}
              onChange={(selected) => handleFilterChange(field, selected)}
              placeholder={`Filter ${field}...`}
            />
          </div>
        ))}
      </div>

      <div className="overflow-x-auto rounded-lg border border-borderColor shadow bg-white">
        <table className="min-w-full divide-y divide-borderColor">
          <thead>
            <tr className="bg-gray-50">
              {TABLE_FIELDS.map(field => (
                <th
                  key={field}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {field}
                </th>
              ))}
              {isWriteAccess && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-borderColor">
            {getFilteredRules().map(rule => (
              <tr key={rule.id} className="hover:bg-gray-50 transition-colors">
                {TABLE_FIELDS.map(field => (
                  <td key={field} className="px-6 py-4 whitespace-nowrap text-sm">
                    {rule[field]}
                  </td>
                ))}
                {isWriteAccess && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleEditRule(rule)}
                      className="text-primary hover:text-secondary transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
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
