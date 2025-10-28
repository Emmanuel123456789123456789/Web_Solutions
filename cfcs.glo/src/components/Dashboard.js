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

const Dashboard = ({ transactions }) => { 
  const totalIncome = transactions
    .filter(t => t.flow === 'Income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.flow === 'Expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const currentBalance = totalIncome - totalExpense;

  const incomeByCategory = transactions
    .filter(t => t.flow === 'Income')
    .reduce((acc, t) => {
      acc[t.type] = (acc[t.type] || 0) + t.amount;
      return acc;
    }, {});
    
  const balanceStyle = {
    color: currentBalance >= 0 ? 'green' : 'red',
    fontWeight: 'bold',
    fontSize: '1.2em'
  };

  return (
    <div className="dashboard">
      <h3>Financial Overview</h3>

      {/* Responsive Summary Card Container */}
      <div className="summary-cards-container">
        <div className="summary-card income-card">
          <h4>Total Income (Contributions)</h4>
          <p style={{ color: 'green', fontWeight: 'bold' }}>{formatCurrency(totalIncome)}</p>
        </div>

        <div className="summary-card expense-card">
          <h4>Total Expenses (Upkeep, Projects, etc.)</h4>
          <p style={{ color: 'red', fontWeight: 'bold' }}>{formatCurrency(totalExpense)}</p>
        </div>

        <div className="summary-card balance-card">
          <h4>Current Balance (Cash on Hand)</h4>
          <p style={balanceStyle}>{formatCurrency(currentBalance)}</p>
        </div>
      </div>
      
      <h4>Income Breakdown by Source:</h4>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {Object.entries(incomeByCategory).map(([type, amount]) => (
          <li key={type} style={{textAlign: 'left', maxWidth: '400px', margin: '5px auto'}}>
            **{type}:** {formatCurrency(amount)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;