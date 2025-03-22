import api from './config';

// Get all venues
export const getVenues = async () => {
  try {
    const response = await api.get('/venues');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

// Get single venue by ID
export const getVenueById = async (id) => {
  try {
    const response = await api.get(`/venues/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

// Create new venue (venue owners only)
export const createVenue = async (venueData) => {
  try {
    const response = await api.post('/venues', venueData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

// Update venue (venue owners only)
export const updateVenue = async (id, venueData) => {
  try {
    const response = await api.put(`/venues/${id}`, venueData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

// Delete venue (venue owners only)
export const deleteVenue = async (id) => {
  try {
    const response = await api.delete(`/venues/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};