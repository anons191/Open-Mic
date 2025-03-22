import React, { useState, useEffect } from 'react';
import './App.css';
import LandingPage from './screens/LandingPage';
import AuthNavigator from './navigation/AuthNavigator';
import ProfileScreen from './screens/profile/ProfileScreen';
import MapScreen from './screens/events/MapScreen';
import EventListScreen from './screens/events/EventListScreen';
import EventCreationScreen from './screens/events/EventCreationScreen';
import styled from 'styled-components';
import { authService } from './services/api';

function App() {
  const [view, setView] = useState('landing'); // 'landing', 'auth', 'main'
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'events', 'map', 'venues'
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        setLoading(true);
        const currentUser = authService.getCurrentUser();
        
        if (currentUser) {
          // Verify token is still valid by getting user profile
          try {
            const response = await authService.getUserProfile();
            setUser(currentUser);
            
            // Set initial active tab based on user role
            if (currentUser.role === 'host') {
              setActiveTab('venues');
            } else {
              setActiveTab('events');
            }
            
            setView('main');
          } catch (err) {
            // Token expired or invalid, logout
            console.error('User session expired', err);
            authService.logout();
          }
        }
      } catch (err) {
        console.error('Error checking login status', err);
      } finally {
        setLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  const handleLoginClick = () => {
    setView('auth');
  };

  const handleAuthenticated = (userData) => {
    setUser(userData);
    
    // Set initial active tab based on user role
    if (userData.role === 'host') {
      setActiveTab('venues');
    } else {
      setActiveTab('events');
    }
    
    setView('main');
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setView('landing');
  };

  const renderMainContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileScreen user={user} />;
      case 'events':
        return <EventListScreen userRole={user?.role} />;
      case 'map':
        return <MapScreen userRole={user?.role} />;
      case 'venues':
        return <EventCreationScreen user={user} />;
      default:
        return <ProfileScreen user={user} />;
    }
  };

  const renderContent = () => {
    if (loading) {
      return <LoadingScreen>Loading...</LoadingScreen>;
    }
    
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
                {user?.role === 'host' && (
                  <NavItem 
                    active={activeTab === 'venues'} 
                    onClick={() => setActiveTab('venues')}
                  >
                    Create Event
                  </NavItem>
                )}
              </HeaderNav>
              <UserInfo>
                <UserRole>{user?.role === 'host' ? 'Host' : user?.role === 'comedian' ? 'Comedian' : 'Guest'}</UserRole>
                <LogoutButton onClick={handleLogout}>
                  Log Out
                </LogoutButton>
              </UserInfo>
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
const LoadingScreen = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 1.2rem;
  color: #757575;
`;

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
    font-size: 0.8rem;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  
  @media (max-width: 768px) {
    gap: 0.5rem;
  }
`;

const UserRole = styled.div`
  font-size: 0.9rem;
  color: #757575;
  background-color: #f5f5f5;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  
  @media (max-width: 768px) {
    display: none;
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

export default App;