import React from 'react';

// Helper function to format currency (Central African CFA Franc - XAF)
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('fr-CM', { 
    style: 'currency', 
    currency: 'XAF',
    minimumFractionDigits: 0, 
    maximumFractionDigits: 0 
  }).format(amount);
};

// Main Viewer Component
const Viewer = ({ transactions, onClose, onBack }) => {

  // Calculate totals
  const totalBalance = transactions.reduce((acc, t) => 
    acc + (t.flow === 'Income' ? t.amount : -t.amount), 
    0
  );

  const totalIncome = transactions
    .filter(t => t.flow === 'Income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.flow === 'Expense')
    .reduce((sum, t) => sum + t.amount, 0);

  // Colors
  const incomeTextColor = '#17a2b8';
  const expenseTextColor = '#dc3545';
  const balanceTextColor = totalBalance >= 0 ? '#28a745' : expenseTextColor;

  // Sort transactions
  const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="viewer-view font-sans">
      <div 
        className="viewer-content-card"
        style={{ 
          maxWidth: '1000px',
          margin: '0 auto',
          backgroundColor: '#ffffff',
          padding: '30px',
          borderRadius: '12px',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.15)',
          border: '1px solid #e0e0e0'
        }}
      >
        {/* Header */}
        <header className="viewer-header" style={{ textAlign: 'center', borderBottom: '3px solid #007bff', paddingBottom: '15px', marginBottom: '20px' }}>
          <h2 style={{ color: '#007bff', fontSize: '1.8em', margin: 0 }}>⛪ Church Financial Record Snapshot</h2>
          <p style={{ color: '#666', fontSize: '1em', marginTop: '5px' }}>
            Snapshot Generated: {new Date().toLocaleDateString('en-US', { 
              year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
            })}
          </p>
        </header>

        {/* Summary Cards */}
        <div className="summary-cards-container" style={{ display: 'flex', justifyContent: 'space-between', gap: '20px', marginBottom: '30px', flexWrap: 'wrap' }}>
          <div className="summary-card" style={{ flex: 1, minWidth: '200px', padding: '15px', borderRadius: '8px', borderLeft: '5px solid #17a2b8', backgroundColor: '#e8f7fa' }}>
            <p style={{ fontSize: '0.9em', color: '#666', margin: 0 }}>Total Income</p>
            <p style={{ fontSize: '1.4em', fontWeight: 'bold', color: incomeTextColor, margin: '5px 0 0' }}>
              {formatCurrency(totalIncome)}
            </p>
          </div>

          <div className="summary-card" style={{ flex: 1, minWidth: '200px', padding: '15px', borderRadius: '8px', borderLeft: '5px solid #dc3545', backgroundColor: '#fdebeb' }}>
            <p style={{ fontSize: '0.9em', color: '#666', margin: 0 }}>Total Expense</p>
            <p style={{ fontSize: '1.4em', fontWeight: 'bold', color: expenseTextColor, margin: '5px 0 0' }}>
              {formatCurrency(totalExpense)}
            </p>
          </div>

          <div className="summary-card" style={{ flex: 1, minWidth: '200px', padding: '15px', borderRadius: '8px', border: '2px solid #28a745', backgroundColor: '#e6ffe6' }}>
            <p style={{ fontSize: '0.9em', color: '#333', margin: 0 }}>Net Balance</p>
            <p style={{ fontSize: '1.6em', fontWeight: 'bolder', color: balanceTextColor, margin: '5px 0 0' }}>
              {formatCurrency(totalBalance)}
            </p>
          </div>
        </div>

        {/* Transaction Table */}
        <h3 style={{ color: '#333', fontSize: '1.4em', borderBottom: '1px solid #ccc', paddingBottom: '5px', marginBottom: '15px', fontWeight: '600' }}>
          Detailed History ({transactions.length} Records)
        </h3>

        {transactions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#ffe0b2', color: '#5d4037', borderRadius: '8px', border: '1px solid #faebcc' }}>
            ⚠️ No transactions were recorded in this report.
          </div>
        ) : (
          <div className="viewer-table-wrapper" style={{ overflowX: 'auto' }}>
            <table className="report-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f0f0f0' }}>
                  <th style={{ padding: '10px', borderBottom: '2px solid #ccc', textAlign: 'left' }}>Date</th>
                  <th style={{ padding: '10px', borderBottom: '2px solid #ccc', textAlign: 'left' }}>Type</th>
                  <th style={{ padding: '10px', borderBottom: '2px solid #ccc', textAlign: 'left' }}>Flow</th>
                  <th style={{ padding: '10px', borderBottom: '2px solid #ccc', textAlign: 'right' }}>Amount (XAF)</th>
                </tr>
              </thead>
              <tbody>
                {sortedTransactions.map((t, index) => (
                  <tr key={t.id || index} style={{ borderBottom: '1px dotted #eee' }}>
                    <td style={{ padding: '10px' }}>{t.date}</td>
                    <td style={{ padding: '10px' }}>{t.type}</td>
                    <td style={{ padding: '10px', fontWeight: 'bold', color: t.flow === 'Income' ? incomeTextColor : expenseTextColor }}>
                      {t.flow}
                    </td>
                    <td style={{ padding: '10px', textAlign: 'right', color: t.flow === 'Income' ? incomeTextColor : expenseTextColor }}>
                      {formatCurrency(t.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* BACK BUTTON */}
        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <button 
            onClick={onBack}
            className="back-btn"
            style={{
              padding: '12px 25px',
              fontSize: '1em',
              fontWeight: '600',
              backgroundColor: '#007bff', 
              color: 'white',
              border: 'none',
              borderRadius: '25px',
              cursor: 'pointer',
              boxShadow: '0 4px 8px rgba(0, 123, 255, 0.4)',
              transition: 'background-color 0.2s, transform 0.2s'
            }}
          >
            🔙 Back to Full Financial Record
          </button>
        </div>

        {/* Footer */}
        <div className="viewer-footer" style={{ textAlign: 'center', paddingTop: '20px', borderTop: '1px solid #eee', marginTop: '30px' }}>
          <button 
            onClick={onClose} 
            className="close-viewer-btn"
            style={{ 
              padding: '10px 20px', 
              backgroundColor: '#6c757d', 
              color: 'white', 
              border: 'none', 
              borderRadius: '5px', 
              cursor: 'pointer' 
            }}
          >
            🔒 Exit Viewer
          </button>
        </div>
      </div>
    </div>
  );
};

export default Viewer;
