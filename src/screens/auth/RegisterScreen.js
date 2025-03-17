import React, { useState } from 'react';
import styled from 'styled-components';
import { colors } from '../../theme/colors';

const RegisterScreen = ({ onRegister, onLoginClick }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    
    // Simulating API call
    setTimeout(() => {
      // For demo purposes, just accept any signup
      setIsLoading(false);
      if (onRegister) onRegister({ name, email });
    }, 1000);
  };

  return (
    <Container>
      <FormCard>
        <Logo>OpenMic</Logo>
        <Title>Create Your Account</Title>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              required
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              required
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              required
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              required
            />
          </FormGroup>
          
          <SubmitButton type="submit" disabled={isLoading}>
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </SubmitButton>
        </Form>
        
        <Divider>
          <DividerText>OR</DividerText>
        </Divider>
        
        <SocialLogin>
          <SocialButton type="button">
            Sign up with Google
          </SocialButton>
        </SocialLogin>
        
        <LoginPrompt>
          Already have an account?{' '}
          <LoginLink onClick={onLoginClick}>
            Log in
          </LoginLink>
        </LoginPrompt>
      </FormCard>
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  background-color: #f5f5f5;
`;

const FormCard = styled.div`
  width: 100%;
  max-width: 400px;
  padding: 30px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Logo = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: ${colors.primary || '#FF5722'};
  text-align: center;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 24px;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const FormGroup = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  
  &:focus {
    outline: none;
    border-color: ${colors.primary || '#FF5722'};
    box-shadow: 0 0 0 2px rgba(255, 87, 34, 0.2);
  }
`;

const SubmitButton = styled.button`
  padding: 12px;
  background-color: ${colors.primary || '#FF5722'};
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 10px;
  
  &:hover {
    background-color: #E64A19;
  }
  
  &:disabled {
    background-color: #ffccbc;
    cursor: not-allowed;
  }
`;

const Divider = styled.div`
  position: relative;
  margin: 24px 0;
  text-align: center;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background-color: #e0e0e0;
  }
`;

const DividerText = styled.span`
  position: relative;
  padding: 0 10px;
  background-color: white;
  color: #757575;
  font-size: 14px;
`;

const SocialLogin = styled.div`
  margin-bottom: 24px;
`;

const SocialButton = styled.button`
  width: 100%;
  padding: 12px;
  background-color: white;
  color: #333;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

const LoginPrompt = styled.div`
  text-align: center;
  font-size: 14px;
  color: #757575;
`;

const LoginLink = styled.a`
  color: ${colors.primary || '#FF5722'};
  text-decoration: none;
  cursor: pointer;
  
  &:hover {
    text-decoration: underline;
  }
`;

const ErrorMessage = styled.div`
  margin-bottom: 16px;
  padding: 10px;
  background-color: #FFEBEE;
  color: #D32F2F;
  border-radius: 4px;
  font-size: 14px;
`;

export default RegisterScreen;
