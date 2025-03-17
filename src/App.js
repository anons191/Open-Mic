import React, { useState } from 'react';
import './App.css';
import LandingPage from './screens/LandingPage';
import AuthNavigator from './navigation/AuthNavigator';

function App() {
  const [view, setView] = useState('landing'); // 'landing', 'auth', 'main'
  const [user, setUser] = useState(null);

  const handleLoginClick = () => {
    setView('auth');
  };

  const handleAuthenticated = (userData) => {
    setUser(userData);
    setView('main');
  };

  const renderContent = () => {
    switch (view) {
      case 'landing':
        return <LandingPage onLoginClick={handleLoginClick} />;
      case 'auth':
        return <AuthNavigator onAuthenticated={handleAuthenticated} />;
      case 'main':
        return (
          <div className="dashboard-placeholder">
            <h1>Welcome, {user?.name || user?.email}!</h1>
            <p>This is where the main app would go.</p>
            <button onClick={() => {
              setUser(null);
              setView('landing');
            }}>
              Log Out
            </button>
          </div>
        );
      default:
        return <LandingPage onLoginClick={handleLoginClick} />;
    }
  };

  return (
    <div className="App">
      {renderContent()}
    </div>
  );
}

export default App;
