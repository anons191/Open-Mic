import api from './config';

// Get all events
export const getEvents = async (filters = {}) => {
  try {
    const response = await api.get('/events', { params: filters });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

// Get single event by ID
export const getEventById = async (id) => {
  try {
    const response = await api.get(`/events/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

// Create new event (venue owners only)
export const createEvent = async (eventData) => {
  try {
    const response = await api.post('/events', eventData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

// Update event (venue owners only)
export const updateEvent = async (id, eventData) => {
  try {
    const response = await api.put(`/events/${id}`, eventData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

// Register as performer for event
export const registerAsPerformer = async (eventId) => {
  try {
    const response = await api.post(`/events/${eventId}/perform`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

// Register as attendee for event
export const registerAsAttendee = async (eventId) => {
  try {
    const response = await api.post(`/events/${eventId}/attend`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};