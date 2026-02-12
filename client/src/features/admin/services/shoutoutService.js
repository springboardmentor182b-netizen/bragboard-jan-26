/**
 * Shoutout API Service
 * Handles all API calls for shoutout management
 */

const BASE_URL = "http://localhost:8000/admin/shoutouts";

/**
 * Fetch all shoutouts with optional filters
 * @param {Object} filters - Filter options (author_id, visibility, skip, limit)
 * @returns {Promise<Array>} Array of shoutouts
 */
export const fetchShoutouts = async (filters = {}) => {
    const params = new URLSearchParams();

    if (filters.author_id) params.append('author_id', filters.author_id);
    if (filters.visibility) params.append('visibility', filters.visibility);
    if (filters.include_deleted) params.append('include_deleted', filters.include_deleted);
    if (filters.skip) params.append('skip', filters.skip);
    if (filters.limit) params.append('limit', filters.limit);

    const url = `${BASE_URL}${params.toString() ? '?' + params.toString() : ''}`;
    const res = await fetch(url);

    if (!res.ok) {
        throw new Error(`Failed to fetch shoutouts: ${res.statusText}`);
    }

    return res.json();
};

/**
 * Create a new shoutout
 * @param {Object} data - Shoutout data (content, recipient_name, visibility)
 * @returns {Promise<Object>} Created shoutout
 */
export const createShoutout = async (data) => {
    const res = await fetch(BASE_URL + '/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.detail || 'Failed to create shoutout');
    }

    return res.json();
};

/**
 * Update an existing shoutout
 * @param {number} id - Shoutout ID
 * @param {Object} data - Update data (content, recipient_name, visibility)
 * @returns {Promise<Object>} Updated shoutout
 */
export const updateShoutout = async (id, data) => {
    const res = await fetch(`${BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.detail || 'Failed to update shoutout');
    }

    return res.json();
};

/**
 * Delete a shoutout (soft delete)
 * @param {number} id - Shoutout ID
 * @returns {Promise<Object>} Deleted shoutout
 */
export const deleteShoutout = async (id) => {
    const res = await fetch(`${BASE_URL}/${id}`, {
        method: 'DELETE'
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.detail || 'Failed to delete shoutout');
    }

    return res.json();
};

/**
 * Fetch a single shoutout by ID
 * @param {number} id - Shoutout ID
 * @returns {Promise<Object>} Shoutout object
 */
export const fetchShoutoutById = async (id) => {
    const res = await fetch(`${BASE_URL}/${id}`);

    if (!res.ok) {
        throw new Error(`Shoutout not found: ${res.statusText}`);
    }

    return res.json();
};
