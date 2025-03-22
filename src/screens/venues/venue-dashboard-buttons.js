// Button handlers for VenueManagementScreen

/**
 * Handle venue creation or editing when the form is submitted
 */
export const handleVenueSubmit = async (e, {
  isEditMode,
  venueFormData,
  venueService,
  setVenues,
  venues,
  setActiveVenue,
  activeVenue,
  setLoading,
  setShowVenueModal,
  setIsEditMode,
  resetVenueForm
}) => {
  e.preventDefault();
  try {
    setLoading(true);
    let response;
    
    if (isEditMode) {
      // Update existing venue
      response = await venueService.updateVenue(venueFormData._id, venueFormData);
      
      // Update the venue in the venues list
      setVenues(venues.map(venue => 
        venue._id === response.data._id ? response.data : venue
      ));
      
      // Update active venue if it's the one being edited
      if (activeVenue?._id === response.data._id) {
        setActiveVenue(response.data);
      }
    } else {
      // Create new venue
      response = await venueService.createVenue(venueFormData);
      
      // Add the new venue to the venues list
      setVenues([...venues, response.data]);
      
      // Set the new venue as active
      setActiveVenue(response.data);
    }
    
    // Close the modal and reset form
    setShowVenueModal(false);
    setIsEditMode(false);
    resetVenueForm();
    
    setLoading(false);
  } catch (err) {
    console.error(`Error ${isEditMode ? 'updating' : 'creating'} venue:`, err);
    alert(`Failed to ${isEditMode ? 'update' : 'create'} venue: ${err.message || 'Unknown error'}`);
    setLoading(false);
  }
};

/**
 * Prepare for editing a venue
 */
export const handleEditVenue = ({
  activeVenue,
  setVenueFormData,
  setIsEditMode,
  setShowVenueModal
}) => {
  // Populate form with active venue data
  setVenueFormData({
    ...activeVenue,
    // Ensure address is properly formatted
    address: {
      street: activeVenue.address?.street || '',
      city: activeVenue.address?.city || '',
      state: activeVenue.address?.state || '',
      zipcode: activeVenue.address?.zipcode || ''
    },
    // Convert capacity to string if it's a number
    capacity: activeVenue.capacity?.toString() || ''
  });
  
  // Set edit mode and show modal
  setIsEditMode(true);
  setShowVenueModal(true);
};

/**
 * Prepare to create a new event
 */
export const handleCreateEvent = ({
  activeVenue,
  setEventFormData,
  setIsEditingEvent,
  setEditingEventId,
  setShowEventModal
}) => {
  // Reset editing state
  setIsEditingEvent(false);
  setEditingEventId(null);
  
  // Set venue ID in the event form
  setEventFormData({
    name: '',
    description: '',
    date: '',
    startTime: '',
    endTime: '',
    totalSlots: 10,
    cost: 0,
    venue: activeVenue._id
  });
  
  // Show event modal
  setShowEventModal(true);
};

/**
 * Prepare for editing an event
 */
export const handleEditEvent = ({
  event,
  setIsEditingEvent,
  setEditingEventId,
  setEventFormData,
  setShowEventModal
}) => {
  // Set editing state
  setIsEditingEvent(true);
  setEditingEventId(event._id);
  
  // Format date string for input (YYYY-MM-DD)
  const formattedDate = new Date(event.date).toISOString().split('T')[0];
  
  // Populate form with event data
  setEventFormData({
    ...event,
    date: formattedDate,
    cost: event.cost?.toString() || '0',
    totalSlots: event.totalSlots?.toString() || '10',
    venue: event.venue._id
  });
  
  // Show event modal
  setShowEventModal(true);
};

/**
 * Show event details modal
 */
export const handleViewEventDetails = ({
  event,
  setSelectedEvent,
  setShowEventDetailsModal
}) => {
  setSelectedEvent(event);
  setShowEventDetailsModal(true);
};

/**
 * Cancel an event
 */
export const handleCancelEvent = async ({
  eventId,
  eventService,
  setLoading,
  setEvents,
  events
}) => {
  // Confirm cancellation
  if (window.confirm('Are you sure you want to cancel this event? This action cannot be undone.')) {
    try {
      setLoading(true);
      
      // Call API to cancel event
      await eventService.updateEvent(eventId, { status: 'cancelled' });
      
      // Update event in state
      setEvents(events.map(event => 
        event._id === eventId ? { ...event, status: 'cancelled' } : event
      ));
      
      setLoading(false);
    } catch (err) {
      console.error('Error cancelling event:', err);
      alert('Failed to cancel event: ' + (err.message || 'Unknown error'));
      setLoading(false);
    }
  }
};

/**
 * Handle event form submission for creating or editing events
 */
export const handleEventSubmit = async (e, {
  eventFormData,
  isEditingEvent,
  editingEventId,
  eventService,
  setEvents,
  events,
  setActiveTab,
  setShowEventModal,
  setIsEditingEvent,
  setEditingEventId,
  resetEventForm,
  setLoading
}) => {
  e.preventDefault();
  try {
    setLoading(true);
    
    // Format the data for the API
    const formattedData = {
      ...eventFormData,
      cost: parseFloat(eventFormData.cost),
      totalSlots: parseInt(eventFormData.totalSlots, 10)
    };
    
    let response;
    
    if (isEditingEvent) {
      // Update existing event
      response = await eventService.updateEvent(editingEventId, formattedData);
      
      // Update the event in the events list
      setEvents(events.map(event => 
        event._id === editingEventId ? response.data : event
      ));
    } else {
      // Create new event
      response = await eventService.createEvent(formattedData);
      
      // Add the new event to the events list
      setEvents([...events, response.data]);
    }
    
    // Switch to events tab to show the event
    setActiveTab('events');
    
    // Close the modal and reset form
    setShowEventModal(false);
    setIsEditingEvent(false);
    setEditingEventId(null);
    resetEventForm();
    
    setLoading(false);
  } catch (err) {
    console.error(`Error ${isEditingEvent ? 'updating' : 'creating'} event:`, err);
    alert(`Failed to ${isEditingEvent ? 'update' : 'create'} event: ${err.message || 'Unknown error'}`);
    setLoading(false);
  }
};
