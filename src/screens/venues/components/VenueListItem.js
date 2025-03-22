import React from 'react';
import styled from 'styled-components';
import { colors } from '../../../theme/colors';

const VenueListItem = ({ venue, activeVenue, handleSelectVenue, getUpcomingEvents }) => {
  return (
    <VenueItem
      active={activeVenue?._id === venue._id}
      onClick={() => handleSelectVenue(venue)}
    >
      <VenueItemName>{venue.name}</VenueItemName>
      <VenueItemEvents>
        {getUpcomingEvents(venue._id).length} upcoming
      </VenueItemEvents>
    </VenueItem>
  );
};

const VenueItem = styled.div`
  padding: 12px;
  border-radius: 4px;
  cursor: pointer;
  background-color: ${props => props.active ? '#FBE9E7' : 'transparent'};
  border-left: 3px solid ${props => props.active ? colors.primary : 'transparent'};
  
  &:hover {
    background-color: ${props => props.active ? '#FBE9E7' : '#f5f5f5'};
  }
`;

const VenueItemName = styled.div`
  font-weight: 500;
  margin-bottom: 4px;
`;

const VenueItemEvents = styled.div`
  font-size: 12px;
  color: #757575;
`;

export default VenueListItem;