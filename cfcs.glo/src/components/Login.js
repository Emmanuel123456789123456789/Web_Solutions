import React, { useState } from 'react';

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  // 💡 NEW STATE: To control the visibility of the password
  const [showPassword, setShowPassword] = useState(false); 

  // Define the valid credentials
  const ADMIN_CREDS = { username: 'Kate', password: 'Admin123', role: 'admin' };
  const VIEWER_CREDS = { username: 'church', password: 'Viewer123', role: 'viewer' };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(''); // Clear previous error

    if (username === ADMIN_CREDS.username && password === ADMIN_CREDS.password) {
      onLoginSuccess('admin');
    } else if (username === VIEWER_CREDS.username && password === VIEWER_CREDS.password) {
      onLoginSuccess('viewer');
    } else {
      setError('Invalid username or password. Please try again.');
    }
  };

  // 💡 NEW HANDLER: Toggles the showPassword state
  const togglePasswordVisibility = () => {
    setShowPassword(prevState => !prevState);
  };

  return (
    <div className="login-container">
      <h2 className="login-title">CFCS Login</h2>
      <p className="login-subtitle">Access your financial system securely.</p>
      
      <form onSubmit={handleSubmit} className="login-form">
        
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        
        {/* 💡 PASSWORD INPUT WITH TOGGLE FEATURE */}
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <div className="password-input-container"> {/* Container for input and button */}
            <input
              // 💡 Changes input type based on showPassword state
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {/* 💡 Show/Hide Button */}
            <button 
              type="button" 
              onClick={togglePasswordVisibility} 
              className="password-toggle-btn"
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
        </div>
        
        {error && <p className="login-error">{error}</p>}
        
        <button type="submit" className="login-btn">
          Login
        </button>
      </form>

      <p className="login-hint">
        **Admin Demo:** (User: kate, Pass: Admin123) | **Viewer Demo:** (User: church, Pass: Viewer123)
      </p>
    </div>
  );
};

export default Login;