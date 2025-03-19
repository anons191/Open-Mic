import React, { useState } from 'react';
import styled from 'styled-components';
import { colors } from '../../theme/colors';
import moment from 'moment';

// Mock data - in a real app, this would come from Redux/API
const mockUser = {
  id: '123',
  name: 'Alex Johnson',
  username: 'alexjcomedy',
  bio: 'Stand-up comedian, writer, and podcast host. 5 years on the mic and still bombing occasionally.',
  location: 'New York, NY',
  profileImage: '/images/profile-placeholder.png',
  joinDate: '2023-03-15'
};

const mockEvents = [
  {
    id: '1',
    name: 'Comedy Cellar Open Mic',
    venue: 'Comedy Cellar',
    address: '117 MacDougal St, New York, NY',
    date: '2025-03-25T19:30:00',
    attendingAs: 'comedian',
    signupTime: '6:00 PM',
    performanceTime: '7:45 PM (estimated)',
    image: '/images/venue1.png'
  },
  {
    id: '2',
    name: 'Laugh Factory Weekly Open Mic',
    venue: 'Laugh Factory',
    address: '8001 Sunset Blvd, Los Angeles, CA',
    date: '2025-04-05T20:00:00',
    attendingAs: 'guest',
    image: '/images/venue2.png'
  },
  {
    id: '3',
    name: 'The Stand Comedy Showcase',
    venue: 'The Stand NYC',
    address: '116 E 16th St, New York, NY',
    date: '2025-04-12T21:00:00',
    attendingAs: 'comedian',
    signupTime: '7:30 PM',
    performanceTime: '9:15 PM (estimated)',
    image: '/images/venue3.png'
  }
];

const ProfileScreen = () => {
  const [user] = useState(mockUser);
  const [events] = useState(mockEvents);
  const [activeTab, setActiveTab] = useState('upcoming'); // upcoming, past, saved
  
  const filteredEvents = () => {
    const now = moment();
    
    switch (activeTab) {
      case 'upcoming':
        return events.filter(event => moment(event.date).isAfter(now));
      case 'past':
        return events.filter(event => moment(event.date).isBefore(now));
      case 'saved':
        // In a real app, this would filter for bookmarked/saved events
        return [];
      default:
        return events;
    }
  };
  
  return (
    <Container>
      <ProfileHeader>
        <ProfileImageContainer>
          <ProfileImage src={user.profileImage} alt={user.name} />
        </ProfileImageContainer>
        <ProfileInfo>
          <ProfileName>{user.name}</ProfileName>
          <ProfileUsername>@{user.username}</ProfileUsername>
          <ProfileLocation>{user.location}</ProfileLocation>
          <ProfileJoinDate>Joined {moment(user.joinDate).format('MMMM YYYY')}</ProfileJoinDate>
        </ProfileInfo>
        <EditProfileButton>Edit Profile</EditProfileButton>
      </ProfileHeader>
      
      <ProfileBio>
        <BioTitle>About</BioTitle>
        <BioText>{user.bio}</BioText>
      </ProfileBio>
      
      <EventsSection>
        <TabsContainer>
          <Tab 
            active={activeTab === 'upcoming'} 
            onClick={() => setActiveTab('upcoming')}
          >
            Upcoming Events
          </Tab>
          <Tab 
            active={activeTab === 'past'} 
            onClick={() => setActiveTab('past')}
          >
            Past Events
          </Tab>
          <Tab 
            active={activeTab === 'saved'} 
            onClick={() => setActiveTab('saved')}
          >
            Saved Events
          </Tab>
        </TabsContainer>
        
        <EventsList>
          {filteredEvents().length > 0 ? (
            filteredEvents().map(event => (
              <EventCard key={event.id}>
                <EventImageContainer>
                  <EventImage src={event.image} alt={event.name} />
                  <AttendanceType type={event.attendingAs}>
                    {event.attendingAs === 'comedian' ? 'Performing' : 'Attending'}
                  </AttendanceType>
                </EventImageContainer>
                <EventDetails>
                  <EventName>{event.name}</EventName>
                  <EventVenue>{event.venue}</EventVenue>
                  <EventAddress>{event.address}</EventAddress>
                  <EventDate>
                    {moment(event.date).format('dddd, MMMM D, YYYY • h:mm A')}
                  </EventDate>
                  
                  {event.attendingAs === 'comedian' && (
                    <PerformanceDetails>
                      <DetailItem>
                        <DetailLabel>Sign-up Time:</DetailLabel>
                        <DetailValue>{event.signupTime}</DetailValue>
                      </DetailItem>
                      <DetailItem>
                        <DetailLabel>Performance Time:</DetailLabel>
                        <DetailValue>{event.performanceTime}</DetailValue>
                      </DetailItem>
                    </PerformanceDetails>
                  )}
                  
                  <EventActions>
                    <ActionButton primary>View Details</ActionButton>
                    {event.attendingAs === 'comedian' ? (
                      <ActionButton>Edit Set</ActionButton>
                    ) : (
                      <ActionButton>RSVP</ActionButton>
                    )}
                  </EventActions>
                </EventDetails>
              </EventCard>
            ))
          ) : (
            <NoEventsMessage>
              {activeTab === 'upcoming' && "You don't have any upcoming events."}
              {activeTab === 'past' && "You don't have any past events."}
              {activeTab === 'saved' && "You don't have any saved events."}
            </NoEventsMessage>
          )}
        </EventsList>
      </EventsSection>
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const ProfileImageContainer = styled.div`
  margin-right: 30px;
  
  @media (max-width: 768px) {
    margin-right: 0;
    margin-bottom: 20px;
  }
`;

const ProfileImage = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid ${colors.primary || '#FF5722'};
`;

const ProfileInfo = styled.div`
  flex: 1;
`;

const ProfileName = styled.h1`
  font-size: 24px;
  margin: 0 0 5px 0;
`;

const ProfileUsername = styled.div`
  font-size: 16px;
  color: #757575;
  margin-bottom: 5px;
`;

const ProfileLocation = styled.div`
  font-size: 14px;
  margin-bottom: 5px;
`;

const ProfileJoinDate = styled.div`
  font-size: 14px;
  color: #757575;
`;

const EditProfileButton = styled.button`
  padding: 10px 20px;
  background-color: white;
  color: ${colors.primary || '#FF5722'};
  border: 1px solid ${colors.primary || '#FF5722'};
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${colors.primaryLight || '#FFCCBC'};
  }
  
  @media (max-width: 768px) {
    margin-top: 20px;
  }
`;

const ProfileBio = styled.div`
  margin-bottom: 30px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
`;

const BioTitle = styled.h2`
  font-size: 18px;
  margin: 0 0 10px 0;
`;

const BioText = styled.p`
  font-size: 16px;
  line-height: 1.5;
  margin: 0;
`;

const EventsSection = styled.div`
  margin-top: 40px;
`;

const TabsContainer = styled.div`
  display: flex;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    overflow-x: auto;
    white-space: nowrap;
    -webkit-overflow-scrolling: touch;
  }
`;

const Tab = styled.div`
  padding: 12px 20px;
  cursor: pointer;
  font-weight: ${props => props.active ? '600' : '400'};
  color: ${props => props.active ? colors.primary || '#FF5722' : '#757575'};
  border-bottom: ${props => props.active ? `2px solid ${colors.primary || '#FF5722'}` : '2px solid transparent'};
  
  &:hover {
    color: ${colors.primary || '#FF5722'};
  }
`;

const EventsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const EventCard = styled.div`
  display: flex;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const EventImageContainer = styled.div`
  position: relative;
  width: 200px;
  
  @media (max-width: 768px) {
    width: 100%;
    height: 150px;
  }
`;

const EventImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const AttendanceType = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  background-color: ${props => props.type === 'comedian' ? '#FF5722' : '#4CAF50'};
  color: white;
`;

const EventDetails = styled.div`
  flex: 1;
  padding: 20px;
`;

const EventName = styled.h3`
  font-size: 18px;
  margin: 0 0 5px 0;
`;

const EventVenue = styled.div`
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 5px;
`;

const EventAddress = styled.div`
  font-size: 14px;
  color: #757575;
  margin-bottom: 5px;
`;

const EventDate = styled.div`
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 15px;
`;

const PerformanceDetails = styled.div`
  margin-top: 10px;
  padding: 10px;
  background-color: #f5f5f5;
  border-radius: 4px;
  margin-bottom: 15px;
`;

const DetailItem = styled.div`
  display: flex;
  margin-bottom: 5px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const DetailLabel = styled.span`
  font-weight: 600;
  font-size: 14px;
  width: 120px;
`;

const DetailValue = styled.span`
  font-size: 14px;
`;

const EventActions = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 15px;
`;

const ActionButton = styled.button`
  padding: 8px 16px;
  background-color: ${props => props.primary ? colors.primary || '#FF5722' : 'white'};
  color: ${props => props.primary ? 'white' : colors.primary || '#FF5722'};
  border: 1px solid ${colors.primary || '#FF5722'};
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${props => props.primary ? '#E64A19' : '#FFCCBC'};
  }
`;

const NoEventsMessage = styled.div`
  text-align: center;
  padding: 40px;
  background-color: #f9f9f9;
  border-radius: 8px;
  color: #757575;
`;

export default ProfileScreen;
