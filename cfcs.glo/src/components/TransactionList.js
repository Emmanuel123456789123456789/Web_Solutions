import React from 'react';

// A helper function to format currency (Central African CFA Franc - XAF)
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('fr-CM', { 
    style: 'currency', 
    currency: 'XAF',
    minimumFractionDigits: 0, 
    maximumFractionDigits: 0 
  }).format(amount);
};

// This component is now a simple functional component (not using forwardRef)
const TransactionList = ({ transactions, onGenerateReport }) => {

  if (transactions.length === 0) {
    return (
      <div className="transaction-list">
        <p>No financial records have been entered yet. Start by adding a record above.</p>
      </div>
    );
  }

  return (
    <div className="transaction-list">
      
      {/* The button calls the toggle function passed from App.js */}
      <button 
        onClick={onGenerateReport}
        // Disabled if there are no transactions
        disabled={transactions.length === 0} 
        style={{ 
          marginBottom: '20px', 
          padding: '10px 15px', 
          backgroundColor: '#007bff', /* Blue for view action */
          color: 'white', 
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
      >
        📊 Generate Financial Record
      </button>
      
      {/* The main transaction table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #333' }}>
            <th style={{ padding: '8px' }}>Date</th>
            <th style={{ padding: '8px' }}>Type</th>
            <th style={{ padding: '8px' }}>Flow</th>
            <th style={{ padding: '8px', textAlign: 'right' }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {[...transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).map((t) => (
            <tr key={t.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '8px' }}>{t.date}</td>
              <td style={{ padding: '8px' }}>{t.type}</td>
              <td 
                style={{ 
                  padding: '8px', 
                  color: t.flow === 'Income' ? 'green' : 'red', 
                  fontWeight: 'bold' 
                }}
              >
                {t.flow}
              </td>
              <td style={{ padding: '8px', textAlign: 'right' }}>
                {formatCurrency(t.amount)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionList;