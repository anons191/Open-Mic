import React from 'react';
import styled from 'styled-components';

const LandingPage = ({ onLoginClick }) => {
  return (
    <Container>
      <Header>
        <Logo>OpenMic</Logo>
        <LoginButton onClick={onLoginClick}>Login</LoginButton>
      </Header>
      
      <HeroSection>
        <HeroContent>
          <HeroTitle>Find Comedy Open Mics Near You</HeroTitle>
          <HeroSubtitle>Discover events, book slots, and connect with the comedy community</HeroSubtitle>
          <CTAButton onClick={onLoginClick}>Get Started</CTAButton>
        </HeroContent>
        <HeroImage src="/microphone.webp" alt="Microphone on stage" />
      </HeroSection>
      
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

export default LandingPage;
