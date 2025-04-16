import { v4 as uuidv4 } from 'uuid';

// Mock data for initial development
const mockRules = [
  {
    id: uuidv4(),
    'Rule Type': 'Standard',
    'MD State': 'NY',
    'Ship to State': 'CA',
    'Zip Code': '90210',
    'Channel': 'Retail',
    'Reg Cat Code': 'RC001',
    'Drug Schedule': 'II',
    'Refill #': '0',
    'Quantity': '30',
    'Days Supply': '30',
    'User Location': 'Store',
    'Dispensing Location': 'Pharmacy',
    'Protocol': 'Standard',
    'Days Ago': '0',
    'Max Days Supply': '30',
    'Max Quantity': '30',
    'Max Refill': '0',
    'Max Days Allowed to Expiry Date': '365'
  }
];

// In-memory storage
let rules = [...mockRules];

const ruleService = {
  // Get all rules
  getRules: () => {
    return Promise.resolve(rules);
  },

  // Add a new rule
  addRule: (rule) => {
    const newRule = {
      id: uuidv4(),
      ...rule
    };
    rules = [...rules, newRule];
    return Promise.resolve(newRule);
  },

  // Update an existing rule
  updateRule: (rule) => {
    rules = rules.map(r => r.id === rule.id ? { ...rule } : r);
    return Promise.resolve(rule);
  },

  // Delete a rule
  deleteRule: (id) => {
    rules = rules.filter(r => r.id !== id);
    return Promise.resolve(id);
  },

  // Extract rules (e.g., as CSV)
  extractRules: () => {
    const headers = Object.keys(rules[0] || {});
    const csvContent = [
      headers.join(','),
      ...rules.map(rule => 
        headers.map(header => 
          JSON.stringify(rule[header] || '')
        ).join(',')
      )
    ].join('\n');
    
    return Promise.resolve(csvContent);
  },

  // Get unique values for each field (for filters)
  getFieldOptions: (fieldName) => {
    const uniqueValues = [...new Set(rules.map(rule => rule[fieldName]))];
    return Promise.resolve(
      uniqueValues
        .filter(Boolean)
        .map(value => ({
          value,
          label: value.toString()
        }))
    );
  }
};

export default ruleService;
