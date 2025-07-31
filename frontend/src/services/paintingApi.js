const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const getAuthHeaders = (token) => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
});

const handleResponse = async (response) => {
    const data = await response.json();

    if (data.success) {
        return { success: true, data: data.data, message: data.message };
    } else {
        return { success: false, error: data.message };
    }
};

export const paintingApi = {
    save: async (paintingData, token) => {
        try {
            const response = await fetch(`${API_BASE_URL}/paintings/save`, {
                method: 'POST',
                headers: getAuthHeaders(token),
                body: JSON.stringify(paintingData),
            });

            return await handleResponse(response);
        } catch (error) {
            return { success: false, error: 'Network error. Please try again.' };
        }
    },

    update: async (paintingData, token) => {
        try {
            const response = await fetch(`${API_BASE_URL}/paintings/update`, {
                method: 'PUT',
                headers: getAuthHeaders(token),
                body: JSON.stringify(paintingData),
            });

            return await handleResponse(response);
        } catch (error) {
            return { success: false, error: 'Network error. Please try again.' };
        }
    },

    load: async (token) => {
        try {
            const response = await fetch(`${API_BASE_URL}/paintings/load`, {
                method: 'GET',
                headers: getAuthHeaders(token),
            });

            return await handleResponse(response);
        } catch (error) {
            return { success: false, error: 'Network error. Please try again.' };
        }
    },

    getStatistics: async (token) => {
        try {
            const response = await fetch(`${API_BASE_URL}/paintings/statistics`, {
                method: 'GET',
                headers: getAuthHeaders(token),
            });

            return await handleResponse(response);
        } catch (error) {
            return { success: false, error: 'Network error. Please try again.' };
        }
    },

    delete: async (token) => {
        try {
            const response = await fetch(`${API_BASE_URL}/paintings/delete`, {
                method: 'DELETE',
                headers: getAuthHeaders(token),
            });

            return await handleResponse(response);
        } catch (error) {
            return { success: false, error: 'Network error. Please try again.' };
        }
    }
};
