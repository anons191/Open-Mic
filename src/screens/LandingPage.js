import React, { useState } from 'react';
import styled from 'styled-components';
import { authService } from '../services/api';

const LandingPage = ({ onLoginClick }) => {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('guest');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      console.log('Attempting login with:', { email, password });
      const response = await authService.login(email, password);
      console.log('Login successful', response);
      // Redirect to the main app
      onLoginClick();
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const userData = { name, email, password, role };
      const response = await authService.register(userData);
      console.log('Registration successful', response);
      // Redirect to the main app
      onLoginClick();
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const toggleLoginForm = () => {
    setShowLoginForm(!showLoginForm);
    setShowRegisterForm(false);
    setError(null);
  };

  const toggleRegisterForm = () => {
    setShowRegisterForm(!showRegisterForm);
    setShowLoginForm(false);
    setError(null);
  };

  return (
    <Container>
      <Header>
        <Logo>OpenMic</Logo>
        <LoginButton onClick={toggleLoginForm}>Login</LoginButton>
      </Header>
      
      <HeroSection>
        <HeroContent>
          <HeroTitle>Find Comedy Open Mics Near You</HeroTitle>
          <HeroSubtitle>Discover events, book slots, and connect with the comedy community</HeroSubtitle>
          <CTAButton onClick={toggleRegisterForm}>Get Started</CTAButton>
        </HeroContent>
        <HeroImage src="/microphone.webp" alt="Microphone on stage" />
      </HeroSection>

      {showLoginForm && (
        <FormOverlay>
          <FormContainer>
            <FormTitle>Login</FormTitle>
            {error && <ErrorMessage>{error}</ErrorMessage>}
            <Form onSubmit={handleLoginSubmit}>
              <FormField>
                <FormLabel>Email</FormLabel>
                <FormInput 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </FormField>
              <FormField>
                <FormLabel>Password</FormLabel>
                <FormInput 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </FormField>
              <FormSubmitButton type="submit" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </FormSubmitButton>
              <FormSwitchText>
                Don't have an account? 
                <FormSwitchLink onClick={toggleRegisterForm}>Sign up</FormSwitchLink>
              </FormSwitchText>
            </Form>
            <FormCloseButton onClick={toggleLoginForm}>×</FormCloseButton>
          </FormContainer>
        </FormOverlay>
      )}

      {showRegisterForm && (
        <FormOverlay>
          <FormContainer>
            <FormTitle>Create Account</FormTitle>
            {error && <ErrorMessage>{error}</ErrorMessage>}
            <Form onSubmit={handleRegisterSubmit}>
              <FormField>
                <FormLabel>Name</FormLabel>
                <FormInput 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </FormField>
              <FormField>
                <FormLabel>Email</FormLabel>
                <FormInput 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </FormField>
              <FormField>
                <FormLabel>Password</FormLabel>
                <FormInput 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </FormField>
              <FormField>
                <FormLabel>I am a:</FormLabel>
                <RoleRadioGroup>
                  <RoleRadioItem>
                    <RoleRadioInput 
                      type="radio" 
                      id="guest" 
                      name="role" 
                      value="guest"
                      checked={role === 'guest'}
                      onChange={() => setRole('guest')}
                    />
                    <RoleRadioLabel htmlFor="guest">Guest</RoleRadioLabel>
                  </RoleRadioItem>
                  <RoleRadioItem>
                    <RoleRadioInput 
                      type="radio" 
                      id="comedian" 
                      name="role" 
                      value="comedian"
                      checked={role === 'comedian'}
                      onChange={() => setRole('comedian')}
                    />
                    <RoleRadioLabel htmlFor="comedian">Comedian</RoleRadioLabel>
                  </RoleRadioItem>
                  <RoleRadioItem>
                    <RoleRadioInput 
                      type="radio" 
                      id="host" 
                      name="role" 
                      value="host"
                      checked={role === 'host'}
                      onChange={() => setRole('host')}
                    />
                    <RoleRadioLabel htmlFor="host">Host</RoleRadioLabel>
                  </RoleRadioItem>
                </RoleRadioGroup>
                <RoleDescription>
                  {role === 'guest' && 'Discover and attend comedy events'}
                  {role === 'comedian' && 'Find open mics and sign up for performance slots'}
                  {role === 'host' && 'Organize and host comedy events at various venues'}
                </RoleDescription>
              </FormField>
              <FormSubmitButton type="submit" disabled={loading}>
                {loading ? 'Signing up...' : 'Sign Up'}
              </FormSubmitButton>
              <FormSwitchText>
                Already have an account? 
                <FormSwitchLink onClick={toggleLoginForm}>Login</FormSwitchLink>
              </FormSwitchText>
            </Form>
            <FormCloseButton onClick={toggleRegisterForm}>×</FormCloseButton>
          </FormContainer>
        </FormOverlay>
      )}
      
      <FeaturesSection>
        <SectionTitle>Why Use OpenMic?</SectionTitle>
        <FeatureCards>
          <FeatureCard>
            <FeatureIcon>🗺️</FeatureIcon>
            <FeatureTitle>Find Events Nearby</FeatureTitle>
            <FeatureDescription>Use geolocation to discover comedy events happening near you</FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>📅</FeatureIcon>
            <FeatureTitle>Book Performance Slots</FeatureTitle>
            <FeatureDescription>Reserve your spot at open mics directly through the app</FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>🔔</FeatureIcon>
            <FeatureTitle>Get Notifications</FeatureTitle>
            <FeatureDescription>Receive alerts about upcoming events and your performance times</FeatureDescription>
          </FeatureCard>
        </FeatureCards>
      </FeaturesSection>
      
      <Footer>
        <FooterText>© 2025 OpenMic Comedy App</FooterText>
        <FooterLinks>
          <FooterLink>Privacy Policy</FooterLink>
          <FooterLink>Terms of Service</FooterLink>
          <FooterLink>Contact Us</FooterLink>
        </FooterLinks>
      </Footer>
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  max-width: 100%;
  overflow-x: hidden;
  font-family: 'Roboto', sans-serif;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Logo = styled.div`
  font-size: 1.8rem;
  font-weight: bold;
  color: #FF5722;
`;

const LoginButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #FF5722;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  
  &:hover {
    background-color: #E64A19;
  }
`;

const HeroSection = styled.section`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4rem 2rem;
  background-color: #F5F5F5;
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const HeroContent = styled.div`
  max-width: 50%;
  
  @media (max-width: 768px) {
    max-width: 100%;
    margin-bottom: 2rem;
  }
`;

const HeroTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #212121;
`;

const HeroSubtitle = styled.p`
  font-size: 1.2rem;
  margin-bottom: 2rem;
  color: #757575;
`;

const CTAButton = styled.button`
  padding: 0.8rem 1.5rem;
  background-color: #FF5722;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  
  &:hover {
    background-color: #E64A19;
  }
`;

const HeroImage = styled.img`
  max-width: 40%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  
  @media (max-width: 768px) {
    max-width: 80%;
  }
`;

const FeaturesSection = styled.section`
  padding: 4rem 2rem;
  background-color: white;
  text-align: center;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 3rem;
  color: #212121;
`;

const FeatureCards = styled.div`
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 2rem;
`;

const FeatureCard = styled.div`
  flex: 1;
  min-width: 250px;
  max-width: 300px;
  padding: 2rem;
  background-color: #F5F5F5;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-10px);
  }
`;

const FeatureIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const FeatureTitle = styled.h3`
  font-size: 1.3rem;
  margin-bottom: 1rem;
  color: #212121;
`;

const FeatureDescription = styled.p`
  color: #757575;
  line-height: 1.5;
`;

const Footer = styled.footer`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem;
  background-color: #212121;
  color: white;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const FooterText = styled.div`
  font-size: 0.9rem;
`;

const FooterLinks = styled.div`
  display: flex;
  gap: 1.5rem;
`;

const FooterLink = styled.a`
  color: #BDBDBD;
  cursor: pointer;
  font-size: 0.9rem;
  
  &:hover {
    color: #FF5722;
  }
`;

// Form Styles
const FormOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
`;

const FormContainer = styled.div`
  position: relative;
  width: 90%;
  max-width: 400px;
  background-color: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
`;

const FormTitle = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: #212121;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
`;

const FormLabel = styled.label`
  font-size: 0.9rem;
  color: #757575;
  font-weight: 500;
`;

const FormInput = styled.input`
  padding: 0.8rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #FF5722;
  }
`;

// New radio button role selection
const RoleRadioGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 10px;
`;

const RoleRadioItem = styled.div`
  display: flex;
  align-items: center;
`;

const RoleRadioInput = styled.input`
  margin-right: 10px;
  cursor: pointer;
  accent-color: #FF5722;
  width: 18px;
  height: 18px;
`;

const RoleRadioLabel = styled.label`
  font-size: 16px;
  cursor: pointer;
`;

const RoleDescription = styled.div`
  font-size: 14px;
  color: #757575;
  margin-top: 5px;
  min-height: 40px;
  padding: 8px;
  background-color: #f9f9f9;
  border-radius: 4px;
`;

const FormSubmitButton = styled.button`
  padding: 0.8rem;
  background-color: #FF5722;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  margin-top: 0.5rem;
  
  &:hover {
    background-color: #E64A19;
  }
  
  &:disabled {
    background-color: #BDBDBD;
    cursor: not-allowed;
  }
`;

const FormSwitchText = styled.div`
  text-align: center;
  margin-top: 1rem;
  font-size: 0.9rem;
  color: #757575;
`;

const FormSwitchLink = styled.span`
  color: #FF5722;
  cursor: pointer;
  margin-left: 0.5rem;
  font-weight: 500;
  
  &:hover {
    text-decoration: underline;
  }
`;

const FormCloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background-color: #f5f5f5;
  border: none;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  
  &:hover {
    background-color: #e0e0e0;
  }
`;

const ErrorMessage = styled.div`
  padding: 0.8rem;
  background-color: #ffebee;
  color: #c62828;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
`;

export default LandingPage;