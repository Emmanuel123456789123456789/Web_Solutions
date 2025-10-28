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

// The report component displays a summary and provides navigation buttons
const FinancialReport = ({ transactions, onClose, onShowFullDetails }) => {
    
    // --- 1. Calculate Summary Statistics ---
    const totalIncome = transactions
        .filter(t => t.flow === 'Income')
        .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
        .filter(t => t.flow === 'Expense')
        .reduce((sum, t) => sum + t.amount, 0);

    const netBalance = totalIncome - totalExpense;
    
    // --- 2. Calculate Category Breakdown ---
    const categories = transactions.reduce((acc, t) => {
        const key = `${t.flow}-${t.type}`;
        if (!acc[key]) {
            acc[key] = {
                type: t.type,
                flow: t.flow,
                total: 0,
            };
        }
        acc[key].total += t.amount;
        return acc;
    }, {});

    const sortedCategories = Object.values(categories).sort((a, b) => b.total - a.total);

    if (transactions.length === 0) {
        return (
            <div className="report-view">
                <p>No transactions available to generate a summary report.</p>
                <button onClick={onClose} className="report-close-btn">Close Report</button>
            </div>
        );
    }
    
    // --- 3. Render Report View ---
    return (
        // Use the primary report container class
        <div className="report-view">
            
            {/* Report Header */}
            <div className="report-header">
                <h2>Financial Summary Report</h2>
                <p>Snapshot generated on: {new Date().toLocaleDateString()}</p>
                
                <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '20px', marginTop: '20px' }}>
                    {/* Button to move to the detailed view */}
                    <button 
                        onClick={onShowFullDetails} 
                        className="report-details-btn"
                        style={{ backgroundColor: '#007bff' }} // Blue for 'Details'
                    >
                        View Full Details Table ➡️
                    </button>
                    
                    {/* Button to close the entire report view */}
                    <button onClick={onClose} className="report-close-btn">
                        Close Report
                    </button>
                </div>
            </div>

            {/* Overall Summary Section */}
            <div className="report-section">
                <h3>Overall Financial Position</h3>
                
                {/* Reusing the dashboard styling for the summary figures */}
                <div className="summary-cards-container">
                    
                    <div className="summary-card income-card">
                        <h4>Total Income</h4>
                        <p style={{ color: 'green', fontWeight: 'bold', fontSize: '1.2em' }}>
                            {formatCurrency(totalIncome)}
                        </p>
                    </div>

                    <div className="summary-card expense-card">
                        <h4>Total Expense</h4>
                        <p style={{ color: 'red', fontWeight: 'bold', fontSize: '1.2em' }}>
                            {formatCurrency(totalExpense)}
                        </p>
                    </div>

                    <div className="summary-card balance-card">
                        <h4>Net Balance</h4>
                        <p style={{ color: netBalance >= 0 ? 'blue' : 'red', fontWeight: 'bolder', fontSize: '1.4em' }}>
                            {formatCurrency(netBalance)}
                        </p>
                    </div>
                </div>
            </div>

            {/* Breakdown Section */}
            <div className="report-section">
                <h3>Category Breakdown</h3>
                
                <div className="report-list-container" style={{ maxWidth: '600px', margin: '0 auto' }}>
                    <table className="report-table" style={{ width: '100%', minWidth: 'unset' }}>
                        <thead>
                            <tr>
                                <th>Flow</th>
                                <th>Category</th>
                                <th style={{ textAlign: 'right' }}>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedCategories.map((item, index) => (
                                <tr key={index}>
                                    <td style={{ color: item.flow === 'Income' ? 'green' : 'red', fontWeight: 'bold' }}>
                                        {item.flow}
                                    </td>
                                    <td>{item.type}</td>
                                    <td style={{ textAlign: 'right', fontWeight: 'bold' }}>
                                        {formatCurrency(item.total)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div className="report-footer" style={{ textAlign: 'center', marginTop: '30px' }}>
                 <button onClick={onClose} className="report-close-btn">
                    Close Report
                </button>
            </div>
        </div>
    );
};

export default FinancialReport;
