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

// --- Helper function to generate WhatsApp formatted text (for sharing) ---
// Now accepts viewerUrl as the 6th argument
const generateWhatsAppText = (transactions, totalIncome, totalExpense, totalBalance, formatCurrency, viewerUrl) => {
    // Generates a current timestamp for the report
    const generatedAt = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
    });
    
    // Using simple line breaks and asterisks for basic formatting
    let text = `*-- ⛪ Church Financial Record Snapshot --*\n`; 
    text += `\n`;
    text += `Date Generated: ${generatedAt}\n`;
    text += `\n`;
    text += `*--- Summary ---*\n`;
    text += `💰 Total Income: ${formatCurrency(totalIncome)}\n`;
    text += `💸 Total Expense: ${formatCurrency(totalExpense)}\n`;
    text += `*📊 NET BALANCE: ${formatCurrency(totalBalance)}*\n`;
    
    if (transactions.length > 0) {
        text += `\n*--- Detailed History (${transactions.length} Records) ---*\n`;
        text += `\n`;
        // Simple text table headers
        text += `Date | Flow | Amount | Type\n`;
        text += `-------------------------------------------------\n`;
        
        // Sort in memory for the text output
        const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));

        sortedTransactions.forEach(t => {
            const date = t.date; // YYYY-MM-DD
            const flow = t.flow.slice(0, 4); // 'Inco' or 'Expe'
            // Remove currency symbol and spaces for cleaner mobile formatting
            const amount = formatCurrency(t.amount).replace(/XAF|\s/g, '').trim(); 
            const type = t.type; 

            // Format line: Date | Flow | Amount | Type
            text += `${date} | ${flow} | ${amount} | ${type}\n`;
        });
    } else {
        text += `\n(No transactions recorded.)`;
    }
    
    text += `\n\n_Data provided by CFCS_`;
    
    // --- NEW: Add the shareable link at the end of the message ---
    text += `\n\n*View this live record:*\n${viewerUrl}`; 

    // URI encoding is essential for special characters and line breaks in the URL
    return encodeURIComponent(text);
};

// The Viewer component receives the 'transactions' array and 'onClose' handler via props.
const Viewer = ({ transactions, onClose }) => {
    
    // Calculate the overall net balance
    const totalBalance = transactions.reduce((acc, t) => 
        acc + (t.flow === 'Income' ? t.amount : -t.amount), 
        0
    );

    // Calculate summary statistics
    const totalIncome = transactions
        .filter(t => t.flow === 'Income')
        .reduce((sum, t) => sum + t.amount, 0);

    // Calculate summary statistics
    const totalExpense = transactions
        .filter(t => t.flow === 'Expense')
        .reduce((sum, t) => sum + t.amount, 0);

    // Conditional styling for text colors
    const incomeTextColor = '#17a2b8'; 
    const expenseTextColor = '#dc3545'; 
    const balanceTextColor = totalBalance >= 0 ? '#28a745' : expenseTextColor; 
    
    // Sort transactions by date (most recent first) for display
    const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));

    // --- WhatsApp Sharing Handler ---
    const handleShareOnWhatsApp = () => {
        // Get the current page URL to share
        const viewerUrl = window.location.href; 
        
        const encodedText = generateWhatsAppText(
            transactions, 
            totalIncome, 
            totalExpense, 
            totalBalance, 
            formatCurrency,
            viewerUrl // Pass the current URL
        );
        
        // Use the standard API link for better mobile app detection
        const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedText}`;
        window.open(whatsappUrl, '_blank');
    };
    
    return (
        <div className="viewer-view font-sans">
            <div 
                className="viewer-content-card"
                style={{ 
                    maxWidth: '1000px', 
                    margin: '0 auto', 
                    backgroundColor: '#ffffff', 
                    padding: '30px', 
                    borderRadius: '12px', // Report Card style
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.15)', 
                    border: '1px solid #e0e0e0'
                }}
            >
                
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
                    
                    <div className="summary-card income-card" style={{ flex: 1, minWidth: '200px', padding: '15px', borderRadius: '8px', borderLeft: '5px solid #17a2b8', backgroundColor: '#e8f7fa' }}>
                        <p style={{ fontSize: '0.9em', color: '#666', margin: 0 }}>Total Income</p>
                        <p style={{ fontSize: '1.4em', fontWeight: 'bold', color: incomeTextColor, margin: '5px 0 0' }}>
                            {formatCurrency(totalIncome)}
                        </p>
                    </div>

                    <div className="summary-card expense-card" style={{ flex: 1, minWidth: '200px', padding: '15px', borderRadius: '8px', borderLeft: '5px solid #dc3545', backgroundColor: '#fdebeb' }}>
                        <p style={{ fontSize: '0.9em', color: '#666', margin: 0 }}>Total Expense</p>
                        <p style={{ fontSize: '1.4em', fontWeight: 'bold', color: expenseTextColor, margin: '5px 0 0' }}>
                            {formatCurrency(totalExpense)}
                        </p>
                    </div>

                    <div className="summary-card balance-card" style={{ flex: 1, minWidth: '200px', padding: '15px', borderRadius: '8px', border: '2px solid #28a745', backgroundColor: '#e6ffe6' }}>
                        <p style={{ fontSize: '0.9em', color: '#333', margin: 0 }}>Net Balance</p>
                        <p style={{ fontSize: '1.6em', fontWeight: 'bolder', color: balanceTextColor, margin: '5px 0 0' }}>
                            {formatCurrency(totalBalance)}
                        </p>
                    </div>
                </div>

                {/* Transaction List */}
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
                                        <td style={{ padding: '10px' }}>
                                            <span style={{ color: t.flow === 'Income' ? incomeTextColor : expenseTextColor, fontWeight: 'bold' }}>
                                                {t.flow}
                                            </span>
                                        </td>
                                        <td style={{ padding: '10px', textAlign: 'right', color: t.flow === 'Income' ? incomeTextColor : expenseTextColor, fontWeight: '500' }}>
                                            {formatCurrency(t.amount)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                
                {/* --- WhatsApp Share Button --- */}
                <div style={{ textAlign: 'center', marginTop: '30px' }}>
                    <button 
                        onClick={handleShareOnWhatsApp} 
                        className="share-whatsapp-btn"
                        style={{
                            padding: '12px 25px',
                            fontSize: '1em',
                            fontWeight: '600',
                            backgroundColor: '#25D366', 
                            color: 'white',
                            border: 'none',
                            borderRadius: '25px',
                            cursor: 'pointer',
                            boxShadow: '0 4px 8px rgba(37, 211, 102, 0.4)',
                            transition: 'background-color 0.2s, transform 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto'
                        }}
                    >
                        📲 Share Financial Record via WhatsApp
                    </button>
                </div>

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
                        🔒 Exit Read-Only Viewer (Go to Login)
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Viewer;
