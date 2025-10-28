import React, { useState } from 'react';

// Define the categories, separating Income and Expense explicitly
const INCOME_TYPES = [
    'Tithes', 
    'Offering', 
    'Yearly Levy', 
    'Project Contribution',
    'Condolence Contribution' 
];

const EXPENSE_TYPES = [
    'Main Pastor Upkeep', 
    'Assistant Pastor Upkeep',
    'Utility Bill (Electricity/Water/fuel)',
    'Rent/Mortgage',
    'Maintenance/Repairs',
    'Administrative Costs',
    'Missionary Support',
    'Helps/Charity',
    'Transport and Logistics',
    'Area/District contribution',
    'Other Contribution',
    'Church Supplies (e.g., Altar wine, etc.)'
];

// Combine for the dropdown, with visual separators
const ALL_TRANSACTION_TYPES = [
    ...INCOME_TYPES.map(t => ({ name: t, flow: 'Income' })),
    { name: '--- EXPENSES ---', flow: 'Separator', disabled: true },
    ...EXPENSE_TYPES.map(t => ({ name: t, flow: 'Expense' })),
];

const TransactionForm = ({ addTransaction }) => {
    const [date, setDate] = useState('');
    const [type, setType] = useState(INCOME_TYPES[0]); 
    const [amount, setAmount] = useState('');
    
    const selectedTypeObject = ALL_TRANSACTION_TYPES.find(t => t.name === type);
    const flow = selectedTypeObject ? selectedTypeObject.flow : 'Income'; 

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!date || !amount) {
            alert('Please fill in both Date and Amount.');
            return;
        }
        
        if (flow === 'Separator') {
            alert('Please select a valid Income or Expense type.');
            return;
        }

        addTransaction({ date, type, amount, flow });
        
        setDate('');
        setAmount('');
        setType(INCOME_TYPES[0]);
    };

    return (
        <form onSubmit={handleSubmit} className="transaction-form-layout">
            <label>
                Date:
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            </label>
            
            <label>
                Type (Flow: {flow}):
                <select value={type} onChange={(e) => setType(e.target.value)}>
                    {ALL_TRANSACTION_TYPES.map((t) => (
                        <option 
                            key={t.name} 
                            value={t.name}
                            disabled={t.disabled} 
                            style={t.disabled ? {fontWeight: 'bold', color: '#888'} : {}}
                        >
                            {t.name}
                        </option>
                    ))}
                </select>
            </label>
            
            <label>
                Amount (XAF):
                <input 
                    type="number" 
                    value={amount} 
                    onChange={(e) => setAmount(e.target.value)} 
                    min="1" 
                    step="1" 
                    required 
                />
            </label>
            
            <button type="submit">Record {flow}</button>
        </form>
    );
};

export default TransactionForm;