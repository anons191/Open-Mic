import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { colors } from '../../theme/colors';
import moment from 'moment';
import { eventService, venueService } from '../../services/api';

const EventListScreen = ({ userRole = 'guest' }) => {
  const [events, setEvents] = useState([]);
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [showAllVenues, setShowAllVenues] = useState(false);
  
  useEffect(() => {
    // Fetch events and venues from API
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch events
        const eventsResponse = await eventService.getEvents();
        if (eventsResponse && eventsResponse.data) {
          setEvents(eventsResponse.data);
        } else {
          setEvents([]);
        }

        // Fetch all venues
        const venuesResponse = await venueService.getVenues();
        if (venuesResponse && venuesResponse.data) {
          setVenues(venuesResponse.data);
        } else {
          setVenues([]);
        }
        
        setLoading(false);
      } catch (err) {
        setError(err ? (err.message || 'Failed to fetch data') : 'Unknown error');
        setLoading(false);
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, []);
  
  // Filter events based on search query
  const filteredEvents = events.filter(event => 
    event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (event.venue && event.venue.name && event.venue.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (event.venue && event.venue.address && event.venue.address.city && 
     event.venue.address.city.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  // Filter venues based on search query
  const filteredVenues = venues.filter(venue => 
    venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (venue.address && venue.address.city && venue.address.city.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Helper functions
  const formatEventTime = (dateTime) => {
    return moment(dateTime).format('ddd, MMM D • h:mm A');
  };
  
  const handleViewEvent = (event) => {
    setSelectedEvent(event);
    setSelectedVenue(null);
  };

  const handleViewVenue = (venue) => {
    setSelectedVenue(venue);
    setSelectedEvent(null);
  };
  
  const closeDetail = () => {
    setSelectedEvent(null);
    setSelectedVenue(null);
  };
  
  const toggleVenueView = () => {
    setShowAllVenues(!showAllVenues);
  };

  const handleRegisterAsPerformer = async (eventId) => {
    try {
      await eventService.registerAsPerformer(eventId);
      // Refresh the event data
      const response = await eventService.getEventById(eventId);
      setSelectedEvent(response.data);
    } catch (err) {
      console.error('Error registering as performer:', err);
      alert('Failed to register. Please try again.');
    }
  };

  const handleRegisterAsAttendee = async (eventId) => {
    try {
      await eventService.registerAsAttendee(eventId);
      // Refresh the event data
      const response = await eventService.getEventById(eventId);
      setSelectedEvent(response.data);
    } catch (err) {
      console.error('Error registering as attendee:', err);
      alert('Failed to register. Please try again.');
    }
  };
  
  if (loading) {
    return (
      <LoadingContainer>
        <LoadingText>Loading events...</LoadingText>
      </LoadingContainer>
    );
  }

  if (error) {
    return (
      <LoadingContainer>
        <LoadingText>Error: {error}</LoadingText>
      </LoadingContainer>
    );
  }
  
  if (selectedEvent) {
    return (
      <EventDetailContainer>
        <BackButton onClick={closeDetail}>← Back to Events</BackButton>
        
        <EventDetailHeader>
          <EventDetailImage src={selectedEvent.image || '/images/venue1.png'} alt={selectedEvent.name} />
          <EventDetailHeaderOverlay>
            <EventName>{selectedEvent.name}</EventName>
            <EventVenue>{selectedEvent.venue?.name}</EventVenue>
            <EventDateTime>{formatEventTime(selectedEvent.date)}</EventDateTime>
          </EventDetailHeaderOverlay>
        </EventDetailHeader>
        
        <EventDetailContent>
          <DetailItem>
            <DetailLabel>Address:</DetailLabel>
            <DetailValue>
              {selectedEvent.venue?.address?.street}, {selectedEvent.venue?.address?.city}, {selectedEvent.venue?.address?.state}
            </DetailValue>
          </DetailItem>
          
          <DetailItem>
            <DetailLabel>Host:</DetailLabel>
            <DetailValue>{selectedEvent.host?.name || 'Unknown Host'}</DetailValue>
          </DetailItem>
          
          <DetailItem>
            <DetailLabel>Show:</DetailLabel>
            <DetailValue>{selectedEvent.venue?.showTitle || 'N/A'}</DetailValue>
          </DetailItem>
          
          <DetailItem>
            <DetailLabel>Hours:</DetailLabel>
            <DetailValue>{selectedEvent.venue?.operatingHours || 'N/A'}</DetailValue>
          </DetailItem>
          
          <DetailItem>
            <DetailLabel>Pricing:</DetailLabel>
            <DetailValue>
              {selectedEvent.cost === 0 ? 'Free entry' : `$${selectedEvent.cost} entry`}
              {selectedEvent.venue?.drinkMinimum > 0 ? `, $${selectedEvent.venue.drinkMinimum} drink minimum` : ''}
            </DetailValue>
          </DetailItem>
          
          <DetailItem>
            <DetailLabel>Available Slots:</DetailLabel>
            <DetailValue>{selectedEvent.totalSlots - (selectedEvent.performers?.length || 0)} of {selectedEvent.totalSlots}</DetailValue>
          </DetailItem>

          <DetailItem>
            <DetailLabel>Description:</DetailLabel>
            <DetailValue>{selectedEvent.description}</DetailValue>
          </DetailItem>
          
          <ActionButtons>
            {userRole === 'comedian' && (
              <PrimaryButton onClick={() => handleRegisterAsPerformer(selectedEvent._id)}>
                Sign Up to Perform
              </PrimaryButton>
            )}
            <SecondaryButton onClick={() => handleRegisterAsAttendee(selectedEvent._id)}>
              {userRole === 'comedian' ? 'Attend as Guest' : 'Attend Event'}
            </SecondaryButton>
          </ActionButtons>

          {userRole === 'host' && selectedEvent.performers && selectedEvent.performers.length > 0 && (
            <PerformersList>
              <PerformersTitle>Registered Performers</PerformersTitle>
              {selectedEvent.performers.map((performer, index) => (
                <PerformerItem key={performer._id || index}>
                  <PerformerName>{performer.user?.name || 'Unnamed Comedian'}</PerformerName>
                  <PerformerSlot>Slot #{performer.slotNumber}</PerformerSlot>
                </PerformerItem>
              ))}
            </PerformersList>
          )}
        </EventDetailContent>
      </EventDetailContainer>
    );
  }
  
  if (selectedVenue) {
    return (
      <EventDetailContainer>
        <BackButton onClick={closeDetail}>← Back to Events</BackButton>
        
        <EventDetailHeader>
          <EventDetailImage src={selectedVenue.image || '/images/venue1.png'} alt={selectedVenue.name} />
          <EventDetailHeaderOverlay>
            <EventName>{selectedVenue.name}</EventName>
            <EventVenue>{selectedVenue.address?.city}, {selectedVenue.address?.state}</EventVenue>
          </EventDetailHeaderOverlay>
        </EventDetailHeader>
        
        <EventDetailContent>
          <DetailItem>
            <DetailLabel>Address:</DetailLabel>
            <DetailValue>
              {selectedVenue.address?.street}, {selectedVenue.address?.city}, {selectedVenue.address?.state}
            </DetailValue>
          </DetailItem>
          
          <DetailItem>
            <DetailLabel>Show:</DetailLabel>
            <DetailValue>{selectedVenue.showTitle || 'N/A'}</DetailValue>
          </DetailItem>
          
          <DetailItem>
            <DetailLabel>Hours:</DetailLabel>
            <DetailValue>{selectedVenue.operatingHours || 'N/A'}</DetailValue>
          </DetailItem>
          
          <DetailItem>
            <DetailLabel>Pricing:</DetailLabel>
            <DetailValue>
              {selectedVenue.price === 0 ? 'Free entry' : `$${selectedVenue.price} entry`}
              {selectedVenue.drinkMinimum > 0 ? `, $${selectedVenue.drinkMinimum} drink minimum` : ''}
            </DetailValue>
          </DetailItem>
          
          <DetailItem>
            <DetailLabel>Capacity:</DetailLabel>
            <DetailValue>{selectedVenue.capacity} people</DetailValue>
          </DetailItem>

          <DetailItem>
            <DetailLabel>Description:</DetailLabel>
            <DetailValue>{selectedVenue.description}</DetailValue>
          </DetailItem>
          
          {userRole === 'host' && (
            <ActionButtons>
              <PrimaryButton>
                Create Event at This Venue
              </PrimaryButton>
            </ActionButtons>
          )}
        </EventDetailContent>
      </EventDetailContainer>
    );
  }

  return (
    <Container>
      <SearchContainer>
        <SearchBar 
          placeholder="Search events, venues, or locations" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </SearchContainer>
      
      <VenueToggle onClick={toggleVenueView}>
        {showAllVenues ? 'Hide All Venues' : 'Show All Venues'}
      </VenueToggle>
      
      {showAllVenues && (
        <>
          <SectionTitle>All Comedy Venues</SectionTitle>
          <VenuesContainer>
            {filteredVenues.map(venue => (
              <VenueCard key={venue._id} onClick={() => handleViewVenue(venue)}>
                <VenueImageContainer>
                  <VenueImage src={venue.image || '/images/venue1.png'} alt={venue.name} />
                </VenueImageContainer>
                
                <VenueInfo>
                  <VenueTitle>{venue.name}</VenueTitle>
                  <VenueAddress>
                    {venue.address?.city}, {venue.address?.state}
                  </VenueAddress>
                  
                  <VenuePricing>
                    {venue.price === 0 ? 'Free entry' : `$${venue.price} entry`}
                    {venue.drinkMinimum > 0 ? `, $${venue.drinkMinimum} drink minimum` : ''}
                  </VenuePricing>
                  
                  <VenueCapacity>
                    Capacity: {venue.capacity} people
                  </VenueCapacity>
                </VenueInfo>
              </VenueCard>
            ))}
          </VenuesContainer>
        </>
      )}
      
      <SectionTitle>Upcoming Events</SectionTitle>
      <ResultsCount>{filteredEvents.length} events found</ResultsCount>
      
      <EventsContainer>
        {filteredEvents.map(event => (
          <EventCard key={event._id} onClick={() => handleViewEvent(event)}>
            <EventImageContainer>
              <EventImage src={event.image || '/images/venue1.png'} alt={event.venue?.name} />
              <EventCost>{event.cost === 0 ? 'FREE' : `$${event.cost}`}</EventCost>
            </EventImageContainer>
            
            <EventInfo>
              <EventDateTime>{formatEventTime(event.date)}</EventDateTime>
              <EventTitle>{event.name}</EventTitle>
              <EventVenueAddress>
                {event.venue?.name} • {event.venue?.address?.city}
                {event.venue?.showTitle ? ` • ${event.venue.showTitle}` : ''}
              </EventVenueAddress>
              
              <EventHost>
                Hosted by: {event.host?.name || 'Unknown Host'}
              </EventHost>
              
              <EventPricing>
                {event.cost === 0 ? 'Free entry' : `${event.cost} entry`}
                {event.venue?.drinkMinimum > 0 ? `, ${event.venue.drinkMinimum} drink minimum` : ''}
              </EventPricing>
              
              <EventStats>
                {userRole === 'comedian' ? (
                  <EventSlots>
                    {event.totalSlots - (event.performers?.length || 0)} slots available
                  </EventSlots>
                ) : (
                  <EventAttendees>
                    {event.attendees?.length || 0} attending
                  </EventAttendees>
                )}
              </EventStats>
            </EventInfo>
          </EventCard>
        ))}
      </EventsContainer>
      
      <MapViewButton>View on Map</MapViewButton>
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
`;

const SearchContainer = styled.div`
  margin-bottom: 20px;
`;

const SearchBar = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  
  &:focus {
    outline: none;
    border-color: ${colors.primary};
  }
`;

const ResultsCount = styled.div`
  font-size: 16px;
  color: #757575;
  margin-bottom: 20px;
`;

const EventsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 60px;
`;

const EventCard = styled.div`
  display: flex;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const EventImageContainer = styled.div`
  position: relative;
  width: 200px;
  height: 160px;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const EventImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const EventCost = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  padding: 4px 8px;
  background-color: ${props => props.children === 'FREE' ? '#4CAF50' : '#FF5722'};
  color: white;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
`;

const EventInfo = styled.div`
  flex: 1;
  padding: 16px;
  display: flex;
  flex-direction: column;
`;

const EventDateTime = styled.div`
  font-size: 14px;
  color: ${colors.primary};
  margin-bottom: 5px;
  font-weight: 500;
`;

const EventTitle = styled.h3`
  margin: 0 0 5px 0;
  font-size: 18px;
`;

const EventVenueAddress = styled.div`
  font-size: 14px;
  color: #757575;
  margin-bottom: 10px;
`;

const EventPricing = styled.div`
  font-size: 14px;
  color: #757575;
  margin-bottom: 10px;
`;

const EventStats = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: auto;
`;

const EventSlots = styled.div`
  font-size: 14px;
  color: #4CAF50;
`;

const EventAttendees = styled.div`
  font-size: 14px;
  color: #757575;
`;

const MapViewButton = styled.button`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 10px 20px;
  background-color: ${colors.primary};
  color: white;
  border: none;
  border-radius: 20px;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  z-index: 10;
  
  @media (max-width: 768px) {
    bottom: 80px;
  }
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

// Event Detail Styled Components
const EventDetailContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const BackButton = styled.button`
  padding: 8px 16px;
  background-color: transparent;
  color: ${colors.primary};
  border: none;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  
  &:hover {
    text-decoration: underline;
  }
`;

const EventDetailHeader = styled.div`
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 20px;
  height: 250px;
`;

const EventDetailImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const EventDetailHeaderOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  color: white;
`;

const EventName = styled.h1`
  margin: 0 0 5px 0;
  font-size: 24px;
`;

const EventVenue = styled.div`
  font-size: 18px;
  margin-bottom: 5px;
`;

const EventDetailContent = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
`;

const DetailItem = styled.div`
  display: flex;
  margin-bottom: 15px;
`;

const DetailLabel = styled.div`
  font-weight: 600;
  width: 120px;
`;

const DetailValue = styled.div`
  flex: 1;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 30px;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const PrimaryButton = styled.button`
  flex: 1;
  padding: 12px;
  background-color: ${colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  
  &:hover {
    background-color: #E64A19;
  }
`;

const SecondaryButton = styled.button`
  flex: 1;
  padding: 12px;
  background-color: white;
  color: ${colors.primary};
  border: 1px solid ${colors.primary};
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  
  &:hover {
    background-color: #FBE9E7;
  }
`;

const PerformersList = styled.div`
  margin-top: 30px;
  border-top: 1px solid #e0e0e0;
  padding-top: 20px;
`;

const PerformersTitle = styled.h3`
  margin: 0 0 15px 0;
  font-size: 18px;
  color: #424242;
`;

const PerformerItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #f5f5f5;
  
  &:hover {
    background-color: #f9f9f9;
  }
`;

const PerformerName = styled.div`
  font-weight: 500;
`;

const PerformerSlot = styled.div`
  font-size: 14px;
  color: #757575;
  background-color: #f5f5f5;
  padding: 4px 8px;
  border-radius: 4px;
`;

// Venue Styled Components
const VenueToggle = styled.button`
  padding: 8px 16px;
  background-color: transparent;
  border: 1px solid ${colors.primary};
  color: ${colors.primary};
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  margin-bottom: 20px;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #FBE9E7;
  }
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  margin: 25px 0 15px 0;
  color: #212121;
`;

const VenuesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 30px;
`;

const VenueCard = styled.div`
  display: flex;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const VenueImageContainer = styled.div`
  position: relative;
  width: 200px;
  height: 160px;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const VenueImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const VenueInfo = styled.div`
  flex: 1;
  padding: 16px;
  display: flex;
  flex-direction: column;
`;

const VenueTitle = styled.h3`
  margin: 0 0 5px 0;
  font-size: 18px;
`;

const VenueAddress = styled.div`
  font-size: 14px;
  color: #757575;
  margin-bottom: 10px;
`;

const VenuePricing = styled.div`
  font-size: 14px;
  color: #757575;
  margin-bottom: 10px;
`;

const VenueCapacity = styled.div`
  font-size: 14px;
  color: #757575;
  margin-top: auto;
`;

const EventHost = styled.div`
  font-size: 14px;
  color: #555555;
  margin-bottom: 10px;
  font-style: italic;
`;

// EventDateTime is already defined above, removing duplicate declaration

export default EventListScreen;