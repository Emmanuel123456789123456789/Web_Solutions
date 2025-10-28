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

// Now accepts onShowViewer prop
const FullTransactionDetails = ({ transactions, onClose, onBack, onShowViewer }) => {
    
  if (transactions.length === 0) {
    return (
        <div className="full-screen-details-view">
            <p>No transactions available for the detailed report.</p>
            <button onClick={onClose} className="close-details-btn">Close View</button>
        </div>
    );
  }

  return (
    <div className="full-screen-details-view">
      <div className="full-details-header">
        <h2>Full Transaction Details Snapshot</h2>
        <p>Report Date: {new Date().toLocaleDateString()}</p>
        
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '20px', marginTop: '20px' }}>
            {/* Button to go back to Summary */}
            <button 
                onClick={onBack} 
                className="report-details-btn"
                style={{ backgroundColor: '#5c636a' }} // Grey for 'Back'
            >
                🔙 View Summary Report
            </button>

            {/* ✅ This button is correctly linked to the onShowViewer prop */}
            <button 
                onClick={onShowViewer} 
                className="report-details-btn"
                style={{ backgroundColor: '#28a745' }} // Green for 'Final Send'
            >
                Send Records to Viewer ➡️
            </button>
            
            {/* Close button at the top (Exits to Main App) */}
            <button onClick={onClose} className="close-details-btn">
                Close All
            </button>
        </div>
      </div>

      <div className="full-details-table-wrapper">
        <table className="report-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Flow</th>
              <th style={{ textAlign: 'right' }}>Amount (XAF)</th>
            </tr>
          </thead>
          <tbody>
            {[...transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).map((t) => (
              <tr key={t.id}>
                <td>{t.date}</td>
                <td>{t.type}</td>
                <td style={{ color: t.flow === 'Income' ? 'green' : 'red', fontWeight: 'bold' }}>
                  {t.flow}
                </td>
                <td style={{ textAlign: 'right' }}>
                  {formatCurrency(t.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="full-details-footer">
          <button onClick={onClose} className="close-details-btn">Close All</button>
      </div>
    </div>
  );
};

export default FullTransactionDetails;