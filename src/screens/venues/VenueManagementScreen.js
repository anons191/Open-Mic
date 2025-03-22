import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { colors } from '../../theme/colors';
import { venueService } from '../../services/api';

const VenueManagementScreen = ({ user }) => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showVenueModal, setShowVenueModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeVenue, setActiveVenue] = useState(null);
  const [venueFormData, setVenueFormData] = useState({
    name: '',
    description: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipcode: ''
    },
    capacity: '',
    image: 'no-photo.jpg',
    showTitle: '',
    operatingHours: '',
    price: 0,
    drinkMinimum: 0,
    performerSlots: 10
  });
  
  useEffect(() => {
    // Fetch venues when component loads
    const fetchVenues = async () => {
      try {
        setLoading(true);
        const response = await venueService.getVenues();
        if (response.data && response.data.length > 0) {
          setVenues(response.data);
          setActiveVenue(response.data[0]);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching venues:', err);
        setLoading(false);
      }
    };
    
    fetchVenues();
  }, []);

  const handleEditVenue = (venue) => {
    setVenueFormData({
      ...venue,
      address: {
        street: venue.address?.street || '',
        city: venue.address?.city || '',
        state: venue.address?.state || '',
        zipcode: venue.address?.zipcode || ''
      },
      capacity: venue.capacity?.toString() || '',
      showTitle: venue.showTitle || '',
      operatingHours: venue.operatingHours || '',
      price: venue.price || 0,
      drinkMinimum: venue.drinkMinimum || 0,
      performerSlots: venue.performerSlots || 10
    });
    setIsEditMode(true);
    setShowVenueModal(true);
  };

  const handleCreateVenue = () => {
    setVenueFormData({
      name: '',
      description: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipcode: ''
      },
      capacity: '',
      image: 'no-photo.jpg',
      showTitle: '',
      operatingHours: '',
      price: 0,
      drinkMinimum: 0,
      performerSlots: 10
    });
    setIsEditMode(false);
    setShowVenueModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested address fields
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setVenueFormData({
        ...venueFormData,
        address: {
          ...venueFormData.address,
          [addressField]: value
        }
      });
    } else {
      setVenueFormData({
        ...venueFormData,
        [name]: value
      });
    }
  };
  
  const handleVenueSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      // Format data for API
      const formattedData = {
        ...venueFormData,
        // Convert numeric fields
        capacity: venueFormData.capacity ? parseInt(venueFormData.capacity, 10) : null,
        price: parseFloat(venueFormData.price) || 0,
        drinkMinimum: parseFloat(venueFormData.drinkMinimum) || 0,
        performerSlots: parseInt(venueFormData.performerSlots, 10) || 10
      };
      
      let response;
      
      if (isEditMode) {
        response = await venueService.updateVenue(formattedData._id, formattedData);
        // Update venue in state
        const updatedVenue = response.data;
        setActiveVenue(updatedVenue);
        console.log('Venue updated successfully:', updatedVenue);
      } else {
        response = await venueService.createVenue(formattedData);
        // Add new venue to state
        const newVenue = response.data;
        setActiveVenue(newVenue);
        console.log('Venue created successfully:', newVenue);
      }
      
      // Close the modal and reset form
      setShowVenueModal(false);
      setIsEditMode(false);
      setLoading(false);
      
      // Reload venues after create/update
      const venueResponse = await venueService.getVenues();
      if (venueResponse.data && venueResponse.data.length > 0) {
        setVenues(venueResponse.data);
      }
    } catch (err) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} venue:`, err);
      alert(`Failed to ${isEditMode ? 'update' : 'create'} venue: ${err.message || 'Unknown error'}`);
      setLoading(false);
    }
  };

  return (
    <Container>
      <Header>
        <PageTitle>Venue Management</PageTitle>
        <CreateButton onClick={handleCreateVenue}>+ New Venue</CreateButton>
      </Header>
      
      {activeVenue && (
        <VenueCard>
          <VenueName>{activeVenue.name}</VenueName>
          <VenueDetail>
            <strong>Address:</strong> {activeVenue.address?.street}, {activeVenue.address?.city}, {activeVenue.address?.state} {activeVenue.address?.zipcode}
          </VenueDetail>
          <VenueDetail>
            <strong>Show:</strong> {activeVenue.showTitle || 'N/A'}
          </VenueDetail>
          <VenueDetail>
            <strong>Hours:</strong> {activeVenue.operatingHours || 'N/A'}
          </VenueDetail>
          <VenueDetail>
            <strong>Pricing:</strong> {activeVenue.price ? `$${activeVenue.price} entry` : 'Free entry'} 
            {activeVenue.drinkMinimum > 0 ? `, $${activeVenue.drinkMinimum} drink minimum` : ''}
          </VenueDetail>
          <VenueDetail>
            <strong>Capacity:</strong> {activeVenue.capacity || 'Not specified'}
          </VenueDetail>
          <VenueDetail>
            <strong>Performer Slots:</strong> {activeVenue.performerSlots || 10}
          </VenueDetail>
          <EditButton onClick={() => handleEditVenue(activeVenue)}>Edit Venue</EditButton>
        </VenueCard>
      )}
      
      <VenueList>
        <VenueListTitle>Your Venues</VenueListTitle>
        {venues.length > 0 ? (
          venues.map(venue => (
            <VenueListItem 
              key={venue._id} 
              active={activeVenue?._id === venue._id}
              onClick={() => setActiveVenue(venue)}
            >
              {venue.name}
            </VenueListItem>
          ))
        ) : (
          <NoVenuesMessage>No venues found. Create your first venue!</NoVenuesMessage>
        )}
      </VenueList>
      
      {showVenueModal && (
        <Modal>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>{isEditMode ? 'Edit Venue' : 'Create New Venue'}</ModalTitle>
              <CloseButton onClick={() => setShowVenueModal(false)}>&times;</CloseButton>
            </ModalHeader>
            
            <Form onSubmit={handleVenueSubmit}>
              <FormGroup>
                <Label htmlFor="name">Venue Name*</Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={venueFormData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter venue name"
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="description">Description*</Label>
                <TextArea
                  id="description"
                  name="description"
                  value={venueFormData.description}
                  onChange={handleInputChange}
                  required
                  placeholder="Describe your venue"
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="address.street">Street Address*</Label>
                <Input
                  type="text"
                  id="address.street"
                  name="address.street"
                  value={venueFormData.address.street}
                  onChange={handleInputChange}
                  required
                  placeholder="Street address"
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="address.city">City*</Label>
                <Input
                  type="text"
                  id="address.city"
                  name="address.city"
                  value={venueFormData.address.city}
                  onChange={handleInputChange}
                  required
                  placeholder="City"
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="address.state">State*</Label>
                <Input
                  type="text"
                  id="address.state"
                  name="address.state"
                  value={venueFormData.address.state}
                  onChange={handleInputChange}
                  required
                  placeholder="State"
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="address.zipcode">Zipcode*</Label>
                <Input
                  type="text"
                  id="address.zipcode"
                  name="address.zipcode"
                  value={venueFormData.address.zipcode}
                  onChange={handleInputChange}
                  required
                  placeholder="Zipcode"
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="capacity">Capacity</Label>
                <Input
                  type="number"
                  id="capacity"
                  name="capacity"
                  value={venueFormData.capacity}
                  onChange={handleInputChange}
                  placeholder="Venue capacity"
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="showTitle">Show Title*</Label>
                <Input
                  type="text"
                  id="showTitle"
                  name="showTitle"
                  value={venueFormData.showTitle}
                  onChange={handleInputChange}
                  required
                  placeholder="Comedy Night, Open Mic Monday, etc."
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="operatingHours">Operating Hours*</Label>
                <Input
                  type="text"
                  id="operatingHours"
                  name="operatingHours"
                  value={venueFormData.operatingHours}
                  onChange={handleInputChange}
                  required
                  placeholder="Mon-Fri: 6PM-2AM, Sat-Sun: 4PM-2AM"
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="price">Ticket Price ($)</Label>
                <Input
                  type="number"
                  id="price"
                  name="price"
                  value={venueFormData.price}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  placeholder="0 for free entry"
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="drinkMinimum">Drink Minimum ($)</Label>
                <Input
                  type="number"
                  id="drinkMinimum"
                  name="drinkMinimum"
                  value={venueFormData.drinkMinimum}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  placeholder="0 for no minimum"
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="performerSlots">Number of Performer Slots*</Label>
                <Input
                  type="number"
                  id="performerSlots"
                  name="performerSlots"
                  value={venueFormData.performerSlots}
                  onChange={handleInputChange}
                  required
                  min="1"
                  placeholder="How many comedians can perform"
                />
              </FormGroup>
              
              <ModalFooter>
                <CancelButton type="button" onClick={() => setShowVenueModal(false)}>Cancel</CancelButton>
                <SubmitButton type="submit" disabled={loading}>
                  {isEditMode ? 'Update Venue' : 'Create Venue'}
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

const VenueCard = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;
`;

const VenueName = styled.h2`
  margin: 0 0 16px 0;
  font-size: 20px;
  color: #212121;
`;

const VenueDetail = styled.div`
  margin-bottom: 8px;
  color: #424242;
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

const VenueList = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
`;

const VenueListTitle = styled.h3`
  margin: 0 0 16px 0;
  font-size: 18px;
  color: #212121;
`;

const VenueListItem = styled.div`
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

const NoVenuesMessage = styled.div`
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

export default VenueManagementScreen;