const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Sends credentials to the server for either logging in or registering.
 * @param {string} mode - 'login' or 'register'
 * @param {string} user_name 
 * @param {string} password 
 */

export const authenticateUser = async(mode, user_name, password) => {
    const response = await fetch(`${API_BASE_URL}/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_name, password })
    });

    return await response.json();
}