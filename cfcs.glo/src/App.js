import React, { useState } from 'react';
import './App.css';
import Dashboard from './components/Dashboard';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import FinancialReport from './components/FinancialReport'; 
import FullTransactionDetails from './components/FullTransactionDetails';
import Viewer from './components/Viewer';
import LandingPage from './components/LandingPage'; 
import Login from './components/Login'; 

// Define the six view modes
const VIEW_MODE = {
    LANDING: 'landing', 
    LOGIN: 'login', 
    MAIN_APP: 'main_app',
    SUMMARY_REPORT: 'summary_report',
    FULL_DETAILS: 'full_details',
    VIEWER: 'viewer', 
};

function App() {
  const [transactions, setTransactions] = useState([]); 
  const [viewMode, setViewMode] = useState(VIEW_MODE.LANDING); 
  
  // 💡 NEW STATE: Stores the specific report data sent by the Admin
  const [viewerReportData, setViewerReportData] = useState(null); 
  
  // NOTE: In a real app, this state would handle transaction deletion/editing too.
  const addTransaction = (newTransaction) => {
    const transactionWithId = {
      ...newTransaction,
      id: Date.now(),
      amount: parseFloat(newTransaction.amount)
    };
    setTransactions((prevTransactions) => [...prevTransactions, transactionWithId]);
  };
  
  // Handlers for switching views
  
  // New handler: Landing Page button goes to Login
  const handleGoToLogin = () => setViewMode(VIEW_MODE.LOGIN);
  
  // Handler for successful login, directing based on role
  const handleLoginSuccess = (role) => {
      if (role === 'admin') {
          setViewMode(VIEW_MODE.MAIN_APP); // Admin goes to the Dashboard
      } else if (role === 'viewer') {
          // Viewer logs in: Use whatever is in viewerReportData (or an empty array if null)
          if (viewerReportData === null) {
              setViewerReportData([]); // Initialize if needed
          }
          setViewMode(VIEW_MODE.VIEWER); // Viewer goes directly to the Viewer Page
      }
  };
  
  const handleShowSummary = () => setViewMode(VIEW_MODE.SUMMARY_REPORT);
  const handleShowFullDetails = () => setViewMode(VIEW_MODE.FULL_DETAILS);
  const handleBackToSummary = () => setViewMode(VIEW_MODE.SUMMARY_REPORT); 
  
  // Exits all report views back to Main App for Admins, or back to Login for security
  const handleCloseReport = () => setViewMode(VIEW_MODE.MAIN_APP); 
  const handleCloseViewer = () => setViewMode(VIEW_MODE.LOGIN); // Viewer exits to Login for security

  // 💡 UPDATED HANDLER: Admin explicitly sends the report
  const handleShowViewer = () => {
    // 1. Save a COPY of the current transactions into the viewer-specific state
    setViewerReportData([...transactions]); 
    // 2. Switch to the Viewer mode
    setViewMode(VIEW_MODE.VIEWER); 
  };

  return (
    <div className="App">
      
      {/* Conditional Rendering based on viewMode */}
      {viewMode === VIEW_MODE.LANDING ? (
        // 1. Landing Page (Now points to Login)
        <LandingPage onEnterApp={handleGoToLogin} /> 
      ) : viewMode === VIEW_MODE.LOGIN ? (
        // 2. Login Page (New View)
        <Login onLoginSuccess={handleLoginSuccess} />
      ) : viewMode === VIEW_MODE.VIEWER ? (
        // 3. Viewer View - NOW USES VIEWER REPORT DATA
        <Viewer 
            // 💡 Pass the snapshot data saved by the Admin (or an empty array if no report was sent)
            transactions={viewerReportData || []} 
            onClose={handleCloseViewer} 
        />
      ) : viewMode === VIEW_MODE.FULL_DETAILS ? (
        // 4. Full Details View (Admin-only section)
        <FullTransactionDetails 
          transactions={transactions} 
          onClose={handleCloseReport} 
          onBack={handleBackToSummary}
          // This button now saves the data and switches the view
          onShowViewer={handleShowViewer} 
        />
      ) : viewMode === VIEW_MODE.SUMMARY_REPORT ? (
        // 5. Summary Report View (Admin-only section)
        <FinancialReport 
          transactions={transactions} 
          onClose={handleCloseReport} 
          onShowFullDetails={handleShowFullDetails} 
        />
      ) : (
        // 6. Main App View (Dashboard, Form, List) - Only Admin reaches here
        <>
            <header className="App-header">
                <h1>⛪ Church Financial Control System (CFCS)</h1>
            </header>
            
            <main className="cfcs-container">
                <Dashboard transactions={transactions} /> 
                
                <hr/>
                
                <h2>Add New Record</h2>
                <TransactionForm addTransaction={addTransaction} /> 
                
                <hr/>
                
                <h2>All Transactions</h2>
                <TransactionList 
                    transactions={transactions} 
                    onGenerateReport={handleShowSummary} 
                /> 
            </main>
        </>
      )}
    </div>
  );
}

export default App;