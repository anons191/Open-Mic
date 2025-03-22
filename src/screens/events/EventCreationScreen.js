import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { colors } from '../../theme/colors';
import { eventService, venueService } from '../../services/api';

const EventCreationScreen = ({ user }) => {
  const [events, setEvents] = useState([]);
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeEvent, setActiveEvent] = useState(null);
  const [eventFormData, setEventFormData] = useState({
    name: '',
    description: '',
    venue: '',
    date: '',
    startTime: '',
    endTime: '',
    cost: 0,
    totalSlots: 10,
    slotDuration: 5,
    status: 'scheduled'
  });

  useEffect(() => {
    // Fetch events and venues when component loads
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch events created by this host
        const eventsResponse = await eventService.getEvents({ host: user.id });
        if (eventsResponse && eventsResponse.data && eventsResponse.data.length > 0) {
          setEvents(eventsResponse.data);
          setActiveEvent(eventsResponse.data[0]);
        } else {
          setEvents([]);
        }
        
        // Fetch all available venues
        const venuesResponse = await venueService.getVenues();
        if (venuesResponse && venuesResponse.data && venuesResponse.data.length > 0) {
          setVenues(venuesResponse.data);
        } else {
          setVenues([]);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user.id]);

  const handleEditEvent = (event) => {
    // Format date for form input (YYYY-MM-DD)
    const eventDate = new Date(event.date);
    const formattedDate = eventDate.toISOString().split('T')[0];
    
    setEventFormData({
      ...event,
      date: formattedDate,
      venue: event.venue?._id || event.venue,
      startTime: event.startTime || '',
      endTime: event.endTime || '',
      cost: event.cost || 0,
      totalSlots: event.totalSlots || 10,
      slotDuration: event.slotDuration || 5
    });
    setIsEditMode(true);
    setShowEventModal(true);
  };

  const handleCreateEvent = () => {
    // Set default date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowFormatted = tomorrow.toISOString().split('T')[0];
    
    setEventFormData({
      name: '',
      description: '',
      venue: venues.length > 0 ? venues[0]._id : '',
      date: tomorrowFormatted,
      startTime: '19:00',
      endTime: '22:00',
      cost: 0,
      totalSlots: 10,
      slotDuration: 5,
      status: 'scheduled'
    });
    setIsEditMode(false);
    setShowEventModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventFormData({
      ...eventFormData,
      [name]: value
    });
  };
  
  const handleEventSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      // Format data for API
      const formattedData = {
        ...eventFormData,
        // Convert numeric fields
        cost: parseFloat(eventFormData.cost) || 0,
        totalSlots: parseInt(eventFormData.totalSlots, 10) || 10,
        slotDuration: parseInt(eventFormData.slotDuration, 10) || 5
      };
      
      let response;
      
      if (isEditMode) {
        response = await eventService.updateEvent(formattedData._id, formattedData);
        // Update event in state
        const updatedEvent = response.data;
        setActiveEvent(updatedEvent);
        console.log('Event updated successfully:', updatedEvent);
      } else {
        response = await eventService.createEvent(formattedData);
        // Add new event to state
        const newEvent = response.data;
        setActiveEvent(newEvent);
        console.log('Event created successfully:', newEvent);
      }
      
      // Close the modal and reset form
      setShowEventModal(false);
      setIsEditMode(false);
      setLoading(false);
      
      // Reload events after create/update
      const eventsResponse = await eventService.getEvents({ host: user.id });
      if (eventsResponse.data && eventsResponse.data.length > 0) {
        setEvents(eventsResponse.data);
      }
    } catch (err) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} event:`, err);
      alert(`Failed to ${isEditMode ? 'update' : 'create'} event: ${err.message || 'Unknown error'}`);
      setLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Find venue name by ID
  const getVenueName = (venueId) => {
    const venue = venues.find(v => v._id === venueId);
    return venue ? venue.name : 'Unknown Venue';
  };

  return (
    <Container>
      <Header>
        <PageTitle>Event Management</PageTitle>
        <CreateButton onClick={handleCreateEvent}>+ Create New Event</CreateButton>
      </Header>
      
      {activeEvent && (
        <EventCard>
          <EventName>{activeEvent.name}</EventName>
          <EventDetail>
            <strong>Venue:</strong> {activeEvent.venue?.name || getVenueName(activeEvent.venue)}
          </EventDetail>
          <EventDetail>
            <strong>Date:</strong> {formatDate(activeEvent.date)}
          </EventDetail>
          <EventDetail>
            <strong>Time:</strong> {activeEvent.startTime} - {activeEvent.endTime}
          </EventDetail>
          <EventDetail>
            <strong>Entry Fee:</strong> {activeEvent.cost > 0 ? `${activeEvent.cost}` : 'Free'}
          </EventDetail>
          <EventDetail>
            <strong>Performer Slots:</strong> {activeEvent.totalSlots} (each {activeEvent.slotDuration} minutes)
          </EventDetail>
          <EventDetail>
            <strong>Status:</strong> {activeEvent.status.charAt(0).toUpperCase() + activeEvent.status.slice(1)}
          </EventDetail>
          <Description>
            <strong>Description:</strong><br />
            {activeEvent.description}
          </Description>
          <EditButton onClick={() => handleEditEvent(activeEvent)}>Edit Event</EditButton>
        </EventCard>
      )}
      
      <EventList>
        <EventListTitle>Your Events</EventListTitle>
        {events.length > 0 ? (
          events.map(event => (
            <EventListItem 
              key={event._id} 
              active={activeEvent?._id === event._id}
              onClick={() => setActiveEvent(event)}
            >
              <EventListName>{event.name}</EventListName>
              <EventListInfo>
                {formatDate(event.date)} • {event.venue?.name || getVenueName(event.venue)}
              </EventListInfo>
            </EventListItem>
          ))
        ) : (
          <NoEventsMessage>No events found. Create your first event!</NoEventsMessage>
        )}
      </EventList>
      
      {showEventModal && (
        <Modal>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>{isEditMode ? 'Edit Event' : 'Create New Event'}</ModalTitle>
              <CloseButton onClick={() => setShowEventModal(false)}>&times;</CloseButton>
            </ModalHeader>
            
            <Form onSubmit={handleEventSubmit}>
              <FormGroup>
                <Label htmlFor="name">Event Name*</Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={eventFormData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter event name"
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="venue">Venue*</Label>
                <Select
                  id="venue"
                  name="venue"
                  value={eventFormData.venue}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select a venue</option>
                  {venues.map(venue => (
                    <option key={venue._id} value={venue._id}>
                      {venue.name} - {venue.address.city}, {venue.address.state}
                    </option>
                  ))}
                </Select>
                {venues.length === 0 && (
                  <HelpText>No venues available. Please add venues first.</HelpText>
                )}
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="description">Description*</Label>
                <TextArea
                  id="description"
                  name="description"
                  value={eventFormData.description}
                  onChange={handleInputChange}
                  required
                  placeholder="Describe your event"
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="date">Date*</Label>
                <Input
                  type="date"
                  id="date"
                  name="date"
                  value={eventFormData.date}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>
              
              <FormRow>
                <FormGroup style={{ flex: 1 }}>
                  <Label htmlFor="startTime">Start Time*</Label>
                  <Input
                    type="time"
                    id="startTime"
                    name="startTime"
                    value={eventFormData.startTime}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>
                
                <FormGroup style={{ flex: 1 }}>
                  <Label htmlFor="endTime">End Time*</Label>
                  <Input
                    type="time"
                    id="endTime"
                    name="endTime"
                    value={eventFormData.endTime}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>
              </FormRow>
              
              <FormGroup>
                <Label htmlFor="cost">Entry Fee ($)</Label>
                <Input
                  type="number"
                  id="cost"
                  name="cost"
                  value={eventFormData.cost}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  placeholder="0 for free entry"
                />
              </FormGroup>
              
              <FormRow>
                <FormGroup style={{ flex: 1 }}>
                  <Label htmlFor="totalSlots">Number of Performance Slots*</Label>
                  <Input
                    type="number"
                    id="totalSlots"
                    name="totalSlots"
                    value={eventFormData.totalSlots}
                    onChange={handleInputChange}
                    required
                    min="1"
                  />
                </FormGroup>
                
                <FormGroup style={{ flex: 1 }}>
                  <Label htmlFor="slotDuration">Slot Duration (min)*</Label>
                  <Input
                    type="number"
                    id="slotDuration"
                    name="slotDuration"
                    value={eventFormData.slotDuration}
                    onChange={handleInputChange}
                    required
                    min="1"
                  />
                </FormGroup>
              </FormRow>
              
              <FormGroup>
                <Label htmlFor="status">Status*</Label>
                <Select
                  id="status"
                  name="status"
                  value={eventFormData.status}
                  onChange={handleInputChange}
                  required
                >
                  <option value="scheduled">Scheduled</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="completed">Completed</option>
                </Select>
              </FormGroup>
              
              <ModalFooter>
                <CancelButton type="button" onClick={() => setShowEventModal(false)}>Cancel</CancelButton>
                <SubmitButton type="submit" disabled={loading || venues.length === 0}>
                  {isEditMode ? 'Update Event' : 'Create Event'}
                </SubmitButton>
              </ModalFooter>
            </Form>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const PageTitle = styled.h1`
  font-size: 24px;
  color: #212121;
  margin: 0;
`;

const CreateButton = styled.button`
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

const EventCard = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;
`;

const EventName = styled.h2`
  margin: 0 0 16px 0;
  font-size: 20px;
  color: #212121;
`;

const EventDetail = styled.div`
  margin-bottom: 8px;
  color: #424242;
`;

const Description = styled.div`
  margin-top: 12px;
  color: #424242;
  line-height: 1.5;
  white-space: pre-line;
`;

const EditButton = styled.button`
  padding: 8px 16px;
  background-color: ${colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  margin-top: 16px;
  cursor: pointer;
  
  &:hover {
    background-color: #E64A19;
  }
`;

const EventList = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
`;

const EventListTitle = styled.h3`
  margin: 0 0 16px 0;
  font-size: 18px;
  color: #212121;
`;

const EventListItem = styled.div`
  padding: 12px;
  border-radius: 4px;
  cursor: pointer;
  background-color: ${props => props.active ? '#FBE9E7' : 'transparent'};
  border-left: 3px solid ${props => props.active ? colors.primary : 'transparent'};
  margin-bottom: 8px;
  
  &:hover {
    background-color: ${props => props.active ? '#FBE9E7' : '#f5f5f5'};
  }
`;

const EventListName = styled.div`
  font-weight: 500;
  margin-bottom: 4px;
`;

const EventListInfo = styled.div`
  font-size: 13px;
  color: #757575;
`;

const NoEventsMessage = styled.div`
  padding: 20px;
  text-align: center;
  color: #757575;
  font-style: italic;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 24px;
  border-radius: 8px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 20px;
`;

const CloseButton = styled.button`
  background-color: transparent;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #757575;
  
  &:hover {
    color: #212121;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FormRow = styled.div`
  display: flex;
  gap: 16px;
  
  @media (max-width: 600px) {
    flex-direction: column;
    gap: 16px;
  }
`;

const Label = styled.label`
  font-weight: 500;
  color: #424242;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 16px;
  
  &:focus {
    outline: none;
    border-color: ${colors.primary};
  }
`;

const Select = styled.select`
  padding: 10px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 16px;
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: ${colors.primary};
  }
`;

const TextArea = styled.textarea`
  padding: 10px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 16px;
  min-height: 100px;
  
  &:focus {
    outline: none;
    border-color: ${colors.primary};
  }
`;

const HelpText = styled.div`
  font-size: 13px;
  color: #ff5722;
  margin-top: 4px;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
`;

const CancelButton = styled.button`
  padding: 10px 16px;
  background-color: white;
  color: #757575;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

const SubmitButton = styled.button`
  padding: 10px 16px;
  background-color: ${colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  
  &:hover {
    background-color: #E64A19;
  }
  
  &:disabled {
    background-color: #e0e0e0;
    color: #9e9e9e;
    cursor: not-allowed;
  }
`;

export default EventCreationScreen;