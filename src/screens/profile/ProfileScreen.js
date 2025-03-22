import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { colors } from '../../theme/colors';
import { authService, eventService } from '../../services/api';

const ProfileScreen = ({ user }) => {
  const [profile, setProfile] = useState(null);
  const [userEvents, setUserEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        
        // Get user profile
        const profileResponse = await authService.getUserProfile();
        setProfile(profileResponse.data);
        
        // Get user events (we'll implement this API endpoint later)
        // For now, we'll fetch all events and filter client-side
        const eventsResponse = await eventService.getEvents();
        
        // For demonstration, we're just showing all events
        // In a real implementation, we'd filter for events the user has registered for
        setUserEvents(eventsResponse.data);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching profile data:', err);
        setError('Failed to load profile data');
        setLoading(false);
      }
    };
    
    fetchProfileData();
  }, []);
  
  if (loading) {
    return (
      <LoadingContainer>
        <LoadingText>Loading profile...</LoadingText>
      </LoadingContainer>
    );
  }
  
  if (error) {
    return (
      <ErrorContainer>
        <ErrorText>{error}</ErrorText>
      </ErrorContainer>
    );
  }

  const isGuest = profile?.role === 'guest' || user?.role === 'guest';
  const isComedian = profile?.role === 'comedian' || user?.role === 'comedian';
  const isVenueOwner = profile?.role === 'venue_owner' || user?.role === 'venue_owner';
  
  return (
    <Container>
      <ProfileHeader>
        <ProfileImage src="/images/default-avatar.png" alt="Profile" />
        <ProfileInfo>
          <ProfileName>{profile?.name || user?.name || 'User'}</ProfileName>
          <ProfileDetail>
            <ProfileLabel>Email:</ProfileLabel>
            <ProfileValue>{profile?.email || user?.email || 'email@example.com'}</ProfileValue>
          </ProfileDetail>
          <ProfileDetail>
            <ProfileLabel>Role:</ProfileLabel>
            <ProfileValue>
              {isGuest && 'Comedy Fan'}
              {isComedian && 'Comedian'}
              {isVenueOwner && 'Venue Owner'}
            </ProfileValue>
          </ProfileDetail>
          <ProfileBio>{profile?.bio || (isComedian ? 'No bio yet. Tell us about yourself as a comedian!' : 'No bio yet.')}</ProfileBio>
        </ProfileInfo>
      </ProfileHeader>

      <ProfileContent>
        <Section>
          {isGuest && <SectionTitle>Shows You're Attending</SectionTitle>}
          {isComedian && <SectionTitle>Your Upcoming Performances</SectionTitle>}
          {isVenueOwner && <SectionTitle>Your Venue Events</SectionTitle>}
          
          {userEvents.length > 0 ? (
            <EventsList>
              {userEvents.map(event => (
                <EventCard key={event._id}>
                  <EventImage src={event.image || "/images/venue1.png"} alt={event.name} />
                  <EventInfo>
                    <EventName>{event.name}</EventName>
                    <EventVenue>at {event.venue?.name}</EventVenue>
                    <EventDetail>
                      <EventLabel>Date:</EventLabel>
                      <EventValue>{new Date(event.date).toLocaleDateString()}</EventValue>
                    </EventDetail>
                    <EventDetail>
                      <EventLabel>Time:</EventLabel>
                      <EventValue>{event.startTime} - {event.endTime}</EventValue>
                    </EventDetail>
                    <EventActions>
                      <EventButton primary>View Details</EventButton>
                      {isGuest && <EventButton>Cancel RSVP</EventButton>}
                      {isComedian && <EventButton>Cancel Performance</EventButton>}
                    </EventActions>
                  </EventInfo>
                </EventCard>
              ))}
            </EventsList>
          ) : (
            <EmptyState>
              {isGuest && 'You haven\'t registered for any shows yet.'}
              {isComedian && 'You haven\'t signed up for any performances yet.'}
              {isVenueOwner && 'You don\'t have any events scheduled yet.'}
              <EmptyStateAction>Find Open Mics</EmptyStateAction>
            </EmptyState>
          )}
        </Section>

        <Section>
          <SectionTitle>Edit Profile</SectionTitle>
          <ProfileForm>
            <FormField>
              <FormLabel>Bio</FormLabel>
              <FormTextArea 
                placeholder={isComedian 
                  ? "Tell us about yourself as a comedian..." 
                  : "Tell us about yourself..."}
                value={profile?.bio || ''}
                readOnly
              />
            </FormField>
            
            {isComedian && (
              <FormField>
                <FormLabel>Comedy Style</FormLabel>
                <FormSelect readOnly>
                  <option>Observational</option>
                  <option>Dark</option>
                  <option>Absurdist</option>
                  <option>One-liner</option>
                  <option>Improv</option>
                  <option>Other</option>
                </FormSelect>
              </FormField>
            )}
            
            <FormButton disabled>Update Profile</FormButton>
            <FormNote>
              * Profile editing will be enabled in a future update
            </FormNote>
          </ProfileForm>
        </Section>
      </ProfileContent>
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
`;

const LoadingText = styled.div`
  font-size: 18px;
  color: #757575;
`;

const ErrorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
`;

const ErrorText = styled.div`
  font-size: 18px;
  color: #D32F2F;
  background-color: #FFEBEE;
  padding: 16px;
  border-radius: 8px;
  text-align: center;
`;

const ProfileHeader = styled.div`
  display: flex;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ProfileImage = styled.img`
  width: 150px;
  height: 150px;
  object-fit: cover;
  
  @media (max-width: 768px) {
    width: 100%;
    height: 200px;
  }
`;

const ProfileInfo = styled.div`
  flex: 1;
  padding: 20px;
`;

const ProfileName = styled.h2`
  margin: 0 0 16px 0;
  color: #212121;
  font-size: 24px;
`;

const ProfileDetail = styled.div`
  display: flex;
  margin-bottom: 8px;
`;

const ProfileLabel = styled.div`
  font-weight: 600;
  width: 80px;
  color: #757575;
`;

const ProfileValue = styled.div`
  flex: 1;
`;

const ProfileBio = styled.p`
  margin-top: 16px;
  line-height: 1.5;
  color: #424242;
`;

const ProfileContent = styled.div`
  display: flex;
  gap: 20px;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Section = styled.div`
  flex: 1;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;
`;

const SectionTitle = styled.h3`
  margin: 0 0 20px 0;
  color: #212121;
  font-size: 18px;
  font-weight: 600;
`;

const EventsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const EventCard = styled.div`
  display: flex;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e0e0e0;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const EventImage = styled.img`
  width: 120px;
  height: 100%;
  object-fit: cover;
  
  @media (max-width: 768px) {
    width: 100%;
    height: 100px;
  }
`;

const EventInfo = styled.div`
  flex: 1;
  padding: 12px;
`;

const EventName = styled.h4`
  margin: 0 0 4px 0;
  font-size: 16px;
  color: ${colors.primary};
`;

const EventVenue = styled.div`
  margin-bottom: 8px;
  font-size: 14px;
  color: #757575;
`;

const EventDetail = styled.div`
  display: flex;
  margin-bottom: 4px;
  font-size: 14px;
`;

const EventLabel = styled.div`
  font-weight: 600;
  width: 50px;
  color: #757575;
`;

const EventValue = styled.div`
  flex: 1;
`;

const EventActions = styled.div`
  margin-top: 8px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;

const EventButton = styled.button`
  padding: 6px 12px;
  background-color: ${props => props.primary ? colors.primary : 'white'};
  color: ${props => props.primary ? 'white' : colors.primary};
  border: 1px solid ${colors.primary};
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.primary ? '#E64A19' : '#FBE9E7'};
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 30px;
  color: #757575;
  border: 1px dashed #e0e0e0;
  border-radius: 8px;
`;

const EmptyStateAction = styled.button`
  display: block;
  margin: 16px auto 0;
  padding: 8px 16px;
  background-color: ${colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  
  &:hover {
    background-color: #E64A19;
  }
`;

const ProfileForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FormLabel = styled.label`
  font-weight: 600;
  color: #757575;
`;

const FormTextArea = styled.textarea`
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  min-height: 100px;
  resize: vertical;
  font-family: inherit;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: ${colors.primary};
  }
  
  &:read-only {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }
`;

const FormSelect = styled.select`
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-family: inherit;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: ${colors.primary};
  }
  
  &:read-only {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }
`;

const FormButton = styled.button`
  padding: 12px;
  background-color: ${colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  
  &:hover {
    background-color: #E64A19;
  }
  
  &:disabled {
    background-color: #BDBDBD;
    cursor: not-allowed;
  }
`;

const FormNote = styled.div`
  font-size: 12px;
  color: #757575;
  font-style: italic;
`;

export default ProfileScreen;