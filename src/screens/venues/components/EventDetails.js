import React from 'react';
import styled from 'styled-components';
import { colors } from '../../../theme/colors';

const EventDetails = ({ 
  selectedEvent, 
  setShowEventDetailsModal 
}) => {
  return (
    <>
      <DetailSection>
        <DetailRow>
          <DetailLabel>Event Name:</DetailLabel>
          <DetailValue>{selectedEvent.name}</DetailValue>
        </DetailRow>
        
        <DetailRow>
          <DetailLabel>Date:</DetailLabel>
          <DetailValue>{new Date(selectedEvent.date).toLocaleDateString()}</DetailValue>
        </DetailRow>
        
        <DetailRow>
          <DetailLabel>Time:</DetailLabel>
          <DetailValue>{selectedEvent.startTime} - {selectedEvent.endTime}</DetailValue>
        </DetailRow>
        
        <DetailRow>
          <DetailLabel>Status:</DetailLabel>
          <StatusBadge status={selectedEvent.status}>
            {selectedEvent.status === 'completed' ? 'Completed' : 'Cancelled'}
          </StatusBadge>
        </DetailRow>
        
        <DetailRow>
          <DetailLabel>Description:</DetailLabel>
          <DetailValue>{selectedEvent.description}</DetailValue>
        </DetailRow>
        
        <DetailRow>
          <DetailLabel>Ticket Price:</DetailLabel>
          <DetailValue>{selectedEvent.cost === 0 ? 'Free' : `$${selectedEvent.cost}`}</DetailValue>
        </DetailRow>
        
        <DetailRow>
          <DetailLabel>Slots:</DetailLabel>
          <DetailValue>{selectedEvent.performers?.length || 0}/{selectedEvent.totalSlots}</DetailValue>
        </DetailRow>
        
        <DetailRow>
          <DetailLabel>Attendees:</DetailLabel>
          <DetailValue>{selectedEvent.attendees?.length || 0}</DetailValue>
        </DetailRow>
      </DetailSection>
      
      <SectionTitle>Performers</SectionTitle>
      {selectedEvent.performers && selectedEvent.performers.length > 0 ? (
        <PerformersList>
          {selectedEvent.performers.map((performer, index) => (
            <PerformerItem key={performer._id || index}>
              <PerformerImage src="/images/default-avatar.png" alt={performer.user?.name} />
              <PerformerInfo>
                <PerformerName>{performer.user?.name || 'Unknown Performer'}</PerformerName>
                <PerformerSlot>Slot #{index + 1}</PerformerSlot>
              </PerformerInfo>
            </PerformerItem>
          ))}
        </PerformersList>
      ) : (
        <EmptyMessage>No performers signed up for this event.</EmptyMessage>
      )}
      
      <ModalFooter>
        <SubmitButton onClick={() => setShowEventDetailsModal(false)}>Close</SubmitButton>
      </ModalFooter>
    </>
  );
};

const DetailSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
`;

const DetailRow = styled.div`
  display: flex;
  align-items: flex-start;
`;

const DetailLabel = styled.div`
  width: 120px;
  font-weight: 600;
  color: #424242;
`;

const DetailValue = styled.div`
  flex: 1;
  color: #757575;
`;

const StatusBadge = styled.div`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  color: white;
  background-color: ${props => props.status === 'completed' ? '#4CAF50' : '#F44336'};
`;

const SectionTitle = styled.h3`
  font-size: 16px;
  color: #424242;
  margin: 20px 0 12px 0;
`;

const PerformersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const PerformerItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-bottom: 1px solid #f5f5f5;
  
  &:last-child {
    border-bottom: none;
  }
`;

const PerformerImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
`;

const PerformerInfo = styled.div`
  flex: 1;
`;

const PerformerName = styled.div`
  font-weight: 500;
  margin-bottom: 4px;
`;

const PerformerSlot = styled.div`
  font-size: 14px;
  color: #757575;
  background-color: #f5f5f5;
  padding: 4px 8px;
  border-radius: 4px;
`;

const EmptyMessage = styled.div`
  padding: 40px;
  text-align: center;
  color: #757575;
  font-style: italic;
  background-color: #f9f9f9;
  border-radius: 8px;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
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
`;

export default EventDetails;