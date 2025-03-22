import React from 'react';
import styled from 'styled-components';
import { colors } from '../../../theme/colors';

const VenueForm = ({ 
  venueFormData, 
  handleInputChange, 
  handleVenueSubmit, 
  setShowVenueModal, 
  isEditMode, 
  loading 
}) => {
  return (
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
      
      <ModalFooter>
        <CancelButton type="button" onClick={() => setShowVenueModal(false)}>Cancel</CancelButton>
        <SubmitButton type="submit" disabled={loading}>
          {isEditMode ? 'Update Venue' : 'Create Venue'}
        </SubmitButton>
      </ModalFooter>
    </Form>
  );
};

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

export default VenueForm;