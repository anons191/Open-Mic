import React from 'react';
import styled from 'styled-components';
import { colors } from '../../../theme/colors';

const VenueHeaderComponent = ({
  activeVenue,
  handleEditVenue,
  handleCreateEvent
}) => {
  return (
    <VenueHeader>
      <VenueImage src={activeVenue.image || "/images/venue1.png"} alt={activeVenue.name} />
      <VenueInfo>
        <VenueName>{activeVenue.name}</VenueName>
        <VenueAddress>
          {activeVenue.address.street}, {activeVenue.address.city}, {activeVenue.address.state} {activeVenue.address.zipcode}
        </VenueAddress>
        <VenueCapacity>Capacity: {activeVenue.capacity || 'Not specified'}</VenueCapacity>
      </VenueInfo>
      <VenueActions>
        <ActionButton primary onClick={handleEditVenue}>Edit Venue</ActionButton>
        <ActionButton onClick={handleCreateEvent}>Create Event</ActionButton>
      </VenueActions>
    </VenueHeader>
  );
};

const VenueHeader = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const VenueImage = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
`;

const VenueInfo = styled.div`
  flex: 1;
`;

const VenueName = styled.h2`
  margin: 0 0 8px 0;
  font-size: 20px;
  color: #212121;
`;

const VenueAddress = styled.div`
  color: #757575;
  margin-bottom: 4px;
`;

const VenueCapacity = styled.div`
  font-size: 14px;
  color: #757575;
`;

const VenueActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  
  @media (max-width: 768px) {
    flex-direction: row;
  }
`;

const ActionButton = styled.button`
  padding: 8px 16px;
  background-color: ${props => props.primary ? colors.primary : 'white'};
  color: ${props => props.primary ? 'white' : colors.primary};
  border: 1px solid ${props => props.primary ? 'transparent' : colors.primary};
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  
  &:hover {
    background-color: ${props => props.primary ? '#E64A19' : '#FBE9E7'};
  }
`;

export default VenueHeaderComponent;