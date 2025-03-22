import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { colors } from '../../theme/colors';
import { venueService, eventService } from '../../services/api';

const MapScreen = () => {
  const [venues, setVenues] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('any'); // 'today', 'tomorrow', 'thisWeek', 'any'
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Fetch venues from API
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Get venues
        const venueResponse = await venueService.getVenues();
        setVenues(venueResponse.data);
        
        // Get events
        const eventResponse = await eventService.getEvents();
        setEvents(eventResponse.data);
        
        // Simulate getting user location
        getUserLocation();
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setMapError('Failed to load venue data');
        setLoading(false);
      }
    };
    
    // Simulate getting user location
    const getUserLocation = () => {
      // In a real app, we would use navigator.geolocation or a location library
      setTimeout(() => {
        setUserLocation({ lat: 40.730215, lng: -74.000144 }); // NYC coordinates
        setMapLoaded(true);
      }, 1000);
    };
    
    fetchData();
  }, []);
  
  // Get upcoming events for a venue
  const getUpcomingEventsCount = (venueId) => {
    return events.filter(event => 
      event.venue._id === venueId && 
      new Date(event.date) > new Date() &&
      event.status === 'scheduled'
    ).length;
  };
  
  // Filter venues based on search query
  const filteredVenues = venues.filter(venue => {
    return venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           venue.address.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
           venue.address.state.toLowerCase().includes(searchQuery.toLowerCase());
  });
  
  const handleVenueSelect = (venue) => {
    setSelectedVenue(venue);
  };
  
  const renderMap = () => {
    if (loading || !mapLoaded) {
      return <MapLoadingContainer>Loading map...</MapLoadingContainer>;
    }
    
    if (mapError) {
      return <MapErrorContainer>{mapError}</MapErrorContainer>;
    }
    
    return (
      <MapContainer>
        {/* This would be a real map component */}
        <MockMap>
          <UserLocationMarker />
          
          {filteredVenues.map(venue => {
            const upcomingEvents = getUpcomingEventsCount(venue._id);
            return (
              <VenueMarker 
                key={venue._id}
                active={selectedVenue?._id === venue._id}
                onClick={() => handleVenueSelect(venue)}
                style={{
                  top: `${Math.random() * 70 + 10}%`,
                  left: `${Math.random() * 70 + 10}%`
                }}
              >
                <MarkerCount>{upcomingEvents}</MarkerCount>
              </VenueMarker>
            );
          })}
          
          {selectedVenue && (
            <InfoWindow style={{
              top: '40%',
              left: '50%',
              transform: 'translate(-50%, -50%)'
            }}>
              <InfoWindowImage src={selectedVenue.image || "/images/venue1.png"} alt={selectedVenue.name} />
              <InfoWindowContent>
                <InfoWindowTitle>{selectedVenue.name}</InfoWindowTitle>
                <InfoWindowAddress>
                  {selectedVenue.address.street}, {selectedVenue.address.city}, {selectedVenue.address.state}
                </InfoWindowAddress>
                <InfoWindowRating>
                  ★ {selectedVenue.rating || "New"} · {getUpcomingEventsCount(selectedVenue._id)} upcoming events
                </InfoWindowRating>
                <InfoWindowButton>View Details</InfoWindowButton>
              </InfoWindowContent>
              <CloseButton onClick={() => setSelectedVenue(null)}>×</CloseButton>
            </InfoWindow>
          )}
        </MockMap>
      </MapContainer>
    );
  };
  
  return (
    <Container>
      <SearchBarContainer>
        <SearchBar 
          placeholder="Search venues or neighborhoods" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <FilterButton onClick={() => setFilterOpen(!filterOpen)}>
          Filter
          <FilterIcon>▼</FilterIcon>
        </FilterButton>
      </SearchBarContainer>
      
      {filterOpen && (
        <FilterPanel>
          <FilterTitle>Filter Events</FilterTitle>
          <FilterGroup>
            <FilterLabel>Date</FilterLabel>
            <FilterOptions>
              <FilterOption 
                active={dateFilter === 'any'}
                onClick={() => setDateFilter('any')}
              >
                Any time
              </FilterOption>
              <FilterOption 
                active={dateFilter === 'today'}
                onClick={() => setDateFilter('today')}
              >
                Today
              </FilterOption>
              <FilterOption 
                active={dateFilter === 'tomorrow'}
                onClick={() => setDateFilter('tomorrow')}
              >
                Tomorrow
              </FilterOption>
              <FilterOption 
                active={dateFilter === 'thisWeek'}
                onClick={() => setDateFilter('thisWeek')}
              >
                This week
              </FilterOption>
            </FilterOptions>
          </FilterGroup>
          
          <FilterGroup>
            <FilterLabel>Event Type</FilterLabel>
            <FilterOptions>
              <FilterOption active={true}>Open Mics</FilterOption>
              <FilterOption>Showcases</FilterOption>
              <FilterOption>Workshops</FilterOption>
            </FilterOptions>
          </FilterGroup>
          
          <FilterGroup>
            <FilterLabel>Experience Level</FilterLabel>
            <FilterOptions>
              <FilterOption active={true}>All Levels</FilterOption>
              <FilterOption>Beginner-friendly</FilterOption>
              <FilterOption>Experienced</FilterOption>
            </FilterOptions>
          </FilterGroup>
          
          <FilterActions>
            <FilterClearButton onClick={() => {
              setDateFilter('any');
              setFilterOpen(false);
            }}>
              Clear Filters
            </FilterClearButton>
            <FilterApplyButton onClick={() => setFilterOpen(false)}>
              Apply Filters
            </FilterApplyButton>
          </FilterActions>
        </FilterPanel>
      )}
      
      {renderMap()}
      
      <VenueListToggle>
        <VenueListButton>
          Show List View
        </VenueListButton>
      </VenueListToggle>
      
      <LocationButton onClick={() => {
        // In a real app, this would recenter the map on the user's location
        alert("This would center the map on your current location");
      }}>
        <LocationIcon>📍</LocationIcon>
      </LocationButton>
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  position: relative;
  height: calc(100vh - 70px);
  width: 100%;
  
  @media (max-width: 768px) {
    height: calc(100vh - 130px);
  }
`;

const SearchBarContainer = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  right: 20px;
  z-index: 10;
  display: flex;
  gap: 10px;
`;

const SearchBar = styled.input`
  flex: 1;
  padding: 12px 16px;
  border: none;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  font-size: 16px;
  
  &:focus {
    outline: none;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }
`;

const FilterButton = styled.button`
  padding: 0 16px;
  background-color: white;
  border: none;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  font-weight: 500;
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const FilterIcon = styled.span`
  font-size: 10px;
  margin-left: 5px;
`;

const FilterPanel = styled.div`
  position: absolute;
  top: 70px;
  right: 20px;
  width: 300px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  padding: 16px;
  z-index: 20;
  
  @media (max-width: 768px) {
    width: calc(100% - 40px);
  }
`;

const FilterTitle = styled.h3`
  margin: 0 0 16px 0;
  font-size: 18px;
`;

const FilterGroup = styled.div`
  margin-bottom: 16px;
`;

const FilterLabel = styled.div`
  font-weight: 600;
  margin-bottom: 8px;
  font-size: 15px;
`;

const FilterOptions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const FilterOption = styled.div`
  padding: 6px 12px;
  background-color: ${props => props.active ? colors.primary : '#f0f0f0'};
  color: ${props => props.active ? 'white' : '#333'};
  border-radius: 16px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${props => props.active ? colors.primary : '#e0e0e0'};
  }
`;

const FilterActions = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

const FilterClearButton = styled.button`
  padding: 8px 16px;
  background-color: white;
  color: #757575;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

const FilterApplyButton = styled.button`
  padding: 8px 16px;
  background-color: ${colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  
  &:hover {
    background-color: #E64A19;
  }
`;

const MapContainer = styled.div`
  height: 100%;
  width: 100%;
  background-color: #f0f0f0;
`;

const MapLoadingContainer = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  color: #757575;
`;

const MapErrorContainer = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  color: #D32F2F;
  padding: 0 20px;
  text-align: center;
`;

const MockMap = styled.div`
  position: relative;
  height: 100%;
  background-color: #e8eaed;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23c5c9d2' fill-opacity='0.4'%3E%3Cpath opacity='.5' d='M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z'/%3E%3Cpath d='M6 5V0H5v5H0v1h5v94h1V6h94V5H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
`;

const UserLocationMarker = styled.div`
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #4285F4;
  border: 2px solid white;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
`;

const VenueMarker = styled.div`
  position: absolute;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: ${props => props.active ? colors.primary : '#FF8A65'};
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  transform: translate(-50%, -50%);
  transition: all 0.2s;
  z-index: ${props => props.active ? 3 : 2};
  
  &:hover {
    background-color: ${colors.primary};
    transform: translate(-50%, -50%) scale(1.1);
  }
`;

const MarkerCount = styled.span`
  font-weight: bold;
  font-size: 14px;
`;

const InfoWindow = styled.div`
  position: absolute;
  width: 280px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
  z-index: 4;
  overflow: hidden;
`;

const InfoWindowImage = styled.img`
  width: 100%;
  height: 120px;
  object-fit: cover;
`;

const InfoWindowContent = styled.div`
  padding: 12px;
`;

const InfoWindowTitle = styled.h3`
  margin: 0 0 5px 0;
  font-size: 16px;
`;

const InfoWindowAddress = styled.div`
  font-size: 14px;
  color: #757575;
  margin-bottom: 5px;
`;

const InfoWindowRating = styled.div`
  font-size: 14px;
  color: #FFA000;
  margin-bottom: 10px;
`;

const InfoWindowButton = styled.button`
  width: 100%;
  padding: 8px;
  background-color: ${colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  
  &:hover {
    background-color: #E64A19;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 24px;
  height: 24px;
  background-color: white;
  border-radius: 50%;
  border: none;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  font-size: 16px;
  line-height: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  z-index: 5;
`;

const VenueListToggle = styled.div`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
`;

const VenueListButton = styled.button`
  padding: 10px 20px;
  background-color: white;
  color: ${colors.primary};
  border: none;
  border-radius: 20px;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  
  &:hover {
    background-color: #f8f8f8;
  }
`;

const LocationButton = styled.button`
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  background-color: white;
  border-radius: 50%;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  z-index: 10;
  
  &:hover {
    background-color: #f8f8f8;
  }
`;

const LocationIcon = styled.span`
  font-size: 18px;
`;

export default MapScreen;