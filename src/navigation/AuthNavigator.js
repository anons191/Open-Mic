import React, { useState } from 'react';
import styled from 'styled-components';
import { authService } from '../services/api';
import { colors } from '../theme/colors';

const AuthNavigator = ({ onAuthenticated }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('guest');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        // Login
        const response = await authService.login(email, password);
        onAuthenticated(response.user);
      } else {
        // Register
        const userData = { name, email, password, role };
        const response = await authService.register(userData);
        onAuthenticated(response.user);
      }
    } catch (err) {
      console.error('Authentication error:', err);
      setError(err.message || (isLogin ? 'Login failed' : 'Registration failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Card>
        <CardHeader>
          <CardTitle>{isLogin ? 'Login' : 'Create Account'}</CardTitle>
          <CardSubtitle>
            {isLogin 
              ? 'Sign in to find and book comedy events' 
              : 'Join our community of comedy fans and performers'}
          </CardSubtitle>
        </CardHeader>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <Form onSubmit={handleSubmit}>
          {!isLogin && (
            <FormGroup>
              <Label>Name</Label>
              <Input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required
                placeholder="Your full name"
              />
            </FormGroup>
          )}

          <FormGroup>
            <Label>Email</Label>
            <Input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required
              placeholder="Your email address"
            />
          </FormGroup>

          <FormGroup>
            <Label>Password</Label>
            <Input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required
              placeholder="Your password"
              minLength={6}
            />
          </FormGroup>

          {!isLogin && (
            <FormGroup>
              <Label>I am a:</Label>
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
                    id="venue_owner" 
                    name="role" 
                    value="venue_owner"
                    checked={role === 'venue_owner'}
                    onChange={() => setRole('venue_owner')}
                  />
                  <RoleRadioLabel htmlFor="venue_owner">Venue Owner</RoleRadioLabel>
                </RoleRadioItem>
              </RoleRadioGroup>
              
              <RoleDescription>
                {role === 'guest' && 'Discover and attend comedy events'}
                {role === 'comedian' && 'Find open mics and sign up for performance slots'}
                {role === 'venue_owner' && 'Manage your venues and create comedy events'}
              </RoleDescription>
            </FormGroup>
          )}

          <SubmitButton type="submit" disabled={loading}>
            {loading 
              ? (isLogin ? 'Logging in...' : 'Creating account...') 
              : (isLogin ? 'Login' : 'Create Account')}
          </SubmitButton>
        </Form>
        
        <ToggleText>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <ToggleLink onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Sign up now' : 'Login'}
          </ToggleLink>
        </ToggleText>
      </Card>
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

const Card = styled.div`
  width: 100%;
  max-width: 450px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 30px;
`;

const CardHeader = styled.div`
  text-align: center;
  margin-bottom: 30px;
`;

const CardTitle = styled.h2`
  font-size: 24px;
  color: #212121;
  margin: 0 0 8px 0;
`;

const CardSubtitle = styled.p`
  font-size: 16px;
  color: #757575;
  margin: 0;
`;

const Form = styled.form`
  margin-bottom: 20px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #424242;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 16px;
  
  &:focus {
    outline: none;
    border-color: ${colors.primary};
  }
`;

const RoleRadioGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 15px;
`;

const RoleRadioItem = styled.div`
  display: flex;
  align-items: center;
`;

const RoleRadioInput = styled.input`
  margin-right: 10px;
  cursor: pointer;
  accent-color: ${colors.primary};
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

const SubmitButton = styled.button`
  width: 100%;
  padding: 12px;
  background-color: ${colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #E64A19;
  }
  
  &:disabled {
    background-color: #BDBDBD;
    cursor: not-allowed;
  }
`;

const ToggleText = styled.div`
  text-align: center;
  font-size: 14px;
  color: #757575;
`;

const ToggleLink = styled.span`
  color: ${colors.primary};
  cursor: pointer;
  font-weight: 500;
  
  &:hover {
    text-decoration: underline;
  }
`;

const ErrorMessage = styled.div`
  padding: 10px;
  margin-bottom: 20px;
  background-color: #FFEBEE;
  color: #D32F2F;
  border-radius: 4px;
  font-size: 14px;
`;

export default AuthNavigator;