import React from 'react';
import styled from 'styled-components';
import { colors } from '../../../theme/colors';

const EventForm = ({
  eventFormData,
  handleEventInputChange,
  handleEventSubmit,
  setShowEventModal,
  isEditingEvent,
  loading
}) => {
  return (
    <Form onSubmit={handleEventSubmit}>
      <FormGroup>
        <Label htmlFor="name">Event Name*</Label>
        <Input
          type="text"
          id="name"
          name="name"
          value={eventFormData.name}
          onChange={handleEventInputChange}
          required
          placeholder="Enter event name"
        />
      </FormGroup>
      
      <FormGroup>
        <Label htmlFor="description">Description*</Label>
        <TextArea
          id="description"
          name="description"
          value={eventFormData.description}
          onChange={handleEventInputChange}
          required
          placeholder="Describe your event"
        />
      </FormGroup>
      
      <FormGroup>
        <Label htmlFor="date">Event Date*</Label>
        <Input
          type="date"
          id="date"
          name="date"
          value={eventFormData.date}
          onChange={handleEventInputChange}
          required
          min={new Date().toISOString().split('T')[0]} // Current date as minimum
        />
      </FormGroup>
      
      <FormGroup>
        <Label htmlFor="startTime">Start Time*</Label>
        <Input
          type="time"
          id="startTime"
          name="startTime"
          value={eventFormData.startTime}
          onChange={handleEventInputChange}
          required
        />
      </FormGroup>
      
      <FormGroup>
        <Label htmlFor="endTime">End Time*</Label>
        <Input
          type="time"
          id="endTime"
          name="endTime"
          value={eventFormData.endTime}
          onChange={handleEventInputChange}
          required
        />
      </FormGroup>
      
      <FormGroup>
        <Label htmlFor="totalSlots">Number of Performer Slots*</Label>
        <Input
          type="number"
          id="totalSlots"
          name="totalSlots"
          value={eventFormData.totalSlots}
          onChange={handleEventInputChange}
          required
          min="1"
          max="20"
        />
      </FormGroup>
      
      <FormGroup>
        <Label htmlFor="cost">Ticket Price ($)*</Label>
        <Input
          type="number"
          id="cost"
          name="cost"
          value={eventFormData.cost}
          onChange={handleEventInputChange}
          required
          min="0"
          step="0.01"
          placeholder="0 for free events"
        />
      </FormGroup>
      
      <ModalFooter>
        <CancelButton type="button" onClick={() => setShowEventModal(false)}>Cancel</CancelButton>
        <SubmitButton type="submit" disabled={loading}>
          {isEditingEvent ? 'Update Event' : 'Create Event'}
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

export default EventForm;