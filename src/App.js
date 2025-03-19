import React, { useState } from 'react';
import './App.css';
import LandingPage from './screens/LandingPage';
import AuthNavigator from './navigation/AuthNavigator';
import ProfileScreen from './screens/profile/ProfileScreen';
import MapScreen from './screens/events/MapScreen';
import EventListScreen from './screens/events/EventListScreen';
import styled from 'styled-components';

function App() {
  const [view, setView] = useState('landing'); // 'landing', 'auth', 'main'
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'events', 'map'

  const handleLoginClick = () => {
    setView('auth');
  };

  const handleAuthenticated = (userData) => {
    setUser(userData);
    setView('main');
  };

  const renderMainContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileScreen />;
      case 'events':
        return <EventListScreen />;
      case 'map':
        return <MapScreen />;
      default:
        return <ProfileScreen />;
    }
  };

  const renderContent = () => {
    switch (view) {
      case 'landing':
        return <LandingPage onLoginClick={handleLoginClick} />;
      case 'auth':
        return <AuthNavigator onAuthenticated={handleAuthenticated} />;
      case 'main':
        return (
          <MainContainer>
            <AppHeader>
              <Logo>OpenMic</Logo>
              <HeaderNav>
                <NavItem 
                  active={activeTab === 'profile'} 
                  onClick={() => setActiveTab('profile')}
                >
                  Profile
                </NavItem>
                <NavItem 
                  active={activeTab === 'events'} 
                  onClick={() => setActiveTab('events')}
                >
                  Events
                </NavItem>
                <NavItem 
                  active={activeTab === 'map'} 
                  onClick={() => setActiveTab('map')}
                >
                  Map
                </NavItem>
              </HeaderNav>
              <LogoutButton onClick={() => {
                setUser(null);
                setView('landing');
              }}>
                Log Out
              </LogoutButton>
            </AppHeader>
            <ContentContainer>
              {renderMainContent()}
            </ContentContainer>
          </MainContainer>
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

// Styled Components
const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const AppHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
`;

const Logo = styled.div`
  font-size: 1.8rem;
  font-weight: bold;
  color: #FF5722;
`;

const HeaderNav = styled.nav`
  display: flex;
  align-items: center;
  
  @media (max-width: 768px) {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: white;
    box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
    padding: 0.5rem;
    justify-content: space-around;
  }
`;

const NavItem = styled.a`
  margin: 0 1rem;
  padding: 0.5rem;
  color: ${props => props.active ? '#FF5722' : '#333'};
  font-weight: ${props => props.active ? 'bold' : 'normal'};
  cursor: pointer;
  border-bottom: ${props => props.active ? '2px solid #FF5722' : '2px solid transparent'};
  
  &:hover {
    color: #FF5722;
  }
  
  @media (max-width: 768px) {
    margin: 0;
    text-align: center;
    border-bottom: none;
  }
`;

const LogoutButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: transparent;
  color: #757575;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  
  &:hover {
    background-color: #f5f5f5;
  }
  
  @media (max-width: 768px) {
    font-size: 0.8rem;
    padding: 0.3rem 0.8rem;
  }
`;

const ContentContainer = styled.main`
  flex: 1;
  background-color: #f9f9f9;
  padding-bottom: 60px; /* Space for mobile nav */
  
  @media (max-width: 768px) {
    padding-bottom: 80px;
  }
`;

const PlaceholderContent = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 20px;
  text-align: center;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-top: 30px;
`;

export default App;
