import React, { useState } from 'react';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

const AuthNavigator = ({ onAuthenticated }) => {
  const [currentScreen, setCurrentScreen] = useState('login');

  const handleLogin = (userData) => {
    // In a real app, you would store the user data in state management (Redux)
    // and possibly save auth tokens in secure storage
    if (onAuthenticated) {
      onAuthenticated(userData);
    }
  };

  const handleRegister = (userData) => {
    // In a real app, you would handle the registration completion
    if (onAuthenticated) {
      onAuthenticated(userData);
    }
  };

  const navigateToRegister = () => {
    setCurrentScreen('register');
  };

  const navigateToLogin = () => {
    setCurrentScreen('login');
  };

  return (
    <>
      {currentScreen === 'login' ? (
        <LoginScreen 
          onLogin={handleLogin} 
          onRegisterClick={navigateToRegister} 
        />
      ) : (
        <RegisterScreen 
          onRegister={handleRegister} 
          onLoginClick={navigateToLogin} 
        />
      )}
    </>
  );
};

export default AuthNavigator;
