import React from 'react';
import styled from 'styled-components';
import { colors } from '../../../theme/colors';

const EventCardComponent = ({ 
  event, 
  past, 
  handleEditEvent, 
  handleCancelEvent,
  handleViewEventDetails 
}) => {
  return (
    <EventCard past={past}>
      <EventInfo>
        <EventName>{event.name}</EventName>
        <EventDate>
          {new Date(event.date).toLocaleDateString()} • {event.startTime} - {event.endTime}
        </EventDate>
        
        {!past ? (
          <EventStats>
            <EventStat>
              <StatLabel>Slots:</StatLabel>
              <StatValue>{event.performers?.length || 0}/{event.totalSlots}</StatValue>
            </EventStat>
            <EventStat>
              <StatLabel>Attendees:</StatLabel>
              <StatValue>{event.attendees?.length || 0}</StatValue>
            </EventStat>
          </EventStats>
        ) : (
          <EventStatus>
            {event.status === 'completed' ? 'Completed' : 'Cancelled'}
          </EventStatus>
        )}
      </EventInfo>
      
      <EventActions>
        {!past ? (
          <>
            <EventButton primary onClick={() => handleEditEvent(event)}>Edit</EventButton>
            <EventButton onClick={() => handleCancelEvent(event._id)}>Cancel</EventButton>
          </>
        ) : (
          <EventButton onClick={() => handleViewEventDetails(event)}>View Details</EventButton>
        )}
      </EventActions>
    </EventCard>
  );
};

const EventCard = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 16px;
  border-radius: 8px;
  background-color: ${props => props.past ? '#f5f5f5' : 'white'};
  border: 1px solid #e0e0e0;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 12px;
  }
`;

const EventInfo = styled.div`
  flex: 1;
`;

const EventName = styled.div`
  font-weight: 600;
  margin-bottom: 4px;
`;

const EventDate = styled.div`
  font-size: 14px;
  color: #757575;
  margin-bottom: 8px;
`;

const EventStats = styled.div`
  display: flex;
  gap: 16px;
`;

const EventStat = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #757575;
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: #757575;
  margin-right: 4px;
`;

const StatValue = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${colors.primary};
`;

const EventStatus = styled.div`
  font-size: 14px;
  color: #757575;
  font-style: italic;
`;

const EventActions = styled.div`
  display: flex;
  gap: 8px;
  align-items: flex-start;
`;

const EventButton = styled.button`
  padding: 6px 12px;
  background-color: ${props => props.primary ? colors.primary : 'white'};
  color: ${props => props.primary ? 'white' : colors.primary};
  border: 1px solid ${props => props.primary ? 'transparent' : colors.primary};
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.primary ? '#E64A19' : '#FBE9E7'};
  }
`;

export default EventCardComponent;