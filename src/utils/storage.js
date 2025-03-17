/**
 * Storage utility for managing local storage
 */

// Get value from storage
export const getStoredValue = async (key) => {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.error(`Error getting value for key ${key}:`, error);
    return null;
  }
};

// Set value in storage
export const setStoredValue = async (key, value) => {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.error(`Error setting value for key ${key}:`, error);
    return false;
  }
};

// Remove value from storage
export const removeStoredValue = async (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing value for key ${key}:`, error);
    return false;
  }
};

// Clear all values from storage
export const clearStorage = async () => {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing storage:', error);
    return false;
  }
};
