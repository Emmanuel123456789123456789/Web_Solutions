import React, { useRef } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';

// Helper function to format currency (Central African CFA Franc - XAF)
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('fr-CM', { 
    style: 'currency', 
    currency: 'XAF',
    minimumFractionDigits: 0, 
    maximumFractionDigits: 0 
  }).format(amount);
};

const FullTransactionDetails = ({ transactions, onClose, onBack, onShowViewer }) => {
  const printRef = useRef();

  // === Calculate Totals ===
  const totalIncome = transactions
    .filter(t => t.flow === 'Income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.flow === 'Expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalAmount = totalIncome + totalExpense;
  const netBalance = totalIncome - totalExpense;

  // === Prepare Charts Data ===
  const pieData = [
    { name: 'Income', value: totalIncome },
    { name: 'Expense', value: totalExpense }
  ];
  const COLORS = ['#17a2b8', '#dc3545'];

  const sortedByDate = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));
  let cumulativeBalance = 0;
  const lineData = sortedByDate.map(t => {
    cumulativeBalance += t.flow === 'Income' ? t.amount : -t.amount;
    return { date: t.date, balance: cumulativeBalance };
  });

  // === Automated Financial Statement ===
  const statementDate = new Date().toLocaleDateString();
  const balanceStatus = netBalance >= 0 ? "a surplus" : "a deficit";
  const summaryText = `
    As of ${statementDate}, the financial report reflects total income of ${formatCurrency(totalIncome)}
    and total expenses amounting to ${formatCurrency(totalExpense)}. 
    The resulting financial position indicates ${balanceStatus} of ${formatCurrency(Math.abs(netBalance))}.
    This summary provides an overview of the organization’s financial activities during the reviewed period.
  `;

  // === Print Handler ===
  const handlePrint = () => {
    const printContents = printRef.current.innerHTML;
    const printWindow = window.open('', '', 'height=900,width=700');

    printWindow.document.write(`
      <html>
        <head>
          <title>Financial Transaction Report</title>
          <style>
            @page { size: A4 portrait; margin: 20mm; }
            body { font-family: Arial, sans-serif; margin: 0; padding: 0; color: #000; background: #fff; }
            h2, h3, p { text-align: center; margin: 5px 0; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 12px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; font-weight: bold; }
            tr:nth-child(even) { background-color: #fafafa; }
            tr:hover { background-color: #f1f1f1; }
            .summary-table { margin-top: 20px; width: 100%; border-collapse: collapse; }
            .summary-table td { border: none; padding: 6px 8px; font-size: 13px; }
            .summary-table tr.total-row td { font-weight: bold; border-top: 2px solid #333; }
            .financial-statement { margin-top: 30px; border-top: 2px solid #444; padding-top: 10px; font-size: 13px; line-height: 1.6; text-align: justify; }
            .signature-section { margin-top: 30px; text-align: right; font-size: 13px; }
            @media print { button { display: none; } body { margin: 0; } }
          </style>
        </head>
        <body>
          <h2>Financial Report - Printable Copy</h2>
          <p>Generated on: ${statementDate}</p>
          ${printContents}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

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
        <p>Report Date: {statementDate}</p>

        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '20px', marginTop: '20px' }}>
          <button onClick={onBack} className="report-details-btn" style={{ backgroundColor: '#5c636a' }}>
            🔙 View Summary Report
          </button>
          <button onClick={onShowViewer} className="report-details-btn" style={{ backgroundColor: '#28a745' }}>
            Send Records to Viewer ➡️
          </button>
          <button onClick={handlePrint} className="report-details-btn" style={{ backgroundColor: '#007bff' }}>
            🖨️ Print Report
          </button>
          <button onClick={onClose} className="close-details-btn">Close All</button>
        </div>
      </div>

      {/* MAIN TABLE VIEW */}
      <div className="full-details-table-wrapper" ref={printRef}>
        <table className="report-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Flow</th>
              <th style={{ textAlign: 'right' }}>Amount (XAF)</th>
              <th style={{ textAlign: 'right' }}>Percentage (%)</th>
            </tr>
          </thead>
          <tbody>
            {[...transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).map((t) => {
              const percent = totalAmount ? ((t.amount / totalAmount) * 100).toFixed(2) : 0;
              return (
                <tr key={t.id}>
                  <td>{t.date}</td>
                  <td>{t.type}</td>
                  <td style={{ color: t.flow === 'Income' ? 'green' : 'red', fontWeight: 'bold' }}>{t.flow}</td>
                  <td style={{ textAlign: 'right' }}>{formatCurrency(t.amount)}</td>
                  <td style={{ textAlign: 'right' }}>{percent}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* TOTALS SECTION */}
        <table className="summary-table">
          <tbody>
            <tr>
              <td>Total Income:</td>
              <td style={{ color: 'green', fontWeight: 'bold' }}>{formatCurrency(totalIncome)}</td>
            </tr>
            <tr>
              <td>Total Expense:</td>
              <td style={{ color: 'red', fontWeight: 'bold' }}>{formatCurrency(totalExpense)}</td>
            </tr>
            <tr className="total-row">
              <td>Net Balance:</td>
              <td style={{ color: netBalance >= 0 ? 'green' : 'red', fontWeight: 'bold' }}>{formatCurrency(netBalance)}</td>
            </tr>
          </tbody>
        </table>

        {/* INCOME VS EXPENSE PIE CHART */}
        <div style={{ width: '100%', height: 300, marginTop: 40 }}>
          <h3>Income vs Expense</h3>
          <ResponsiveContainer>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* NET BALANCE TREND LINE CHART */}
        <div style={{ width: '100%', height: 300, marginTop: 40 }}>
          <h3>Net Balance Trend</h3>
          <ResponsiveContainer>
            <LineChart data={lineData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Legend />
              <Line type="monotone" dataKey="balance" stroke="#28a745" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* AUTOMATED FINANCIAL STATEMENT */}
        <div className="financial-statement">
          <p><strong>Financial Statement Summary:</strong></p>
          <p>{summaryText}</p>
        </div>

        {/* SIGNATURE SECTION */}
        <div className="signature-section">
          <p><strong>Prepared by:</strong> Finance Department</p>
          <p><strong>Authorized by:</strong> ________________________</p>
          <p>Date: {statementDate}</p>
        </div>
      </div>

      <div className="full-details-footer">
        <button onClick={onClose} className="close-details-btn">Close All</button>
      </div>
    </div>
  );
};

export default FullTransactionDetails;
