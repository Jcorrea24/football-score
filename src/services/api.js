const API_KEY = import.meta.env.VITE_API_TOKEN;

const BASE_URL = '/api';

export const fetchMatches = async (date) => {
    try {
        let url = `${BASE_URL}/matches`;
        if (date) {
            url += `?dateFrom=${date}&dateTo=${date}`;
        }
        const response = await fetch(url, {
            headers: {
                'X-Auth-Token': API_KEY,
            },
        });

        if (!response.ok) {
            if (response.status === 403) {
                throw new Error('Access denied. Check your API key.');
            }
            if (response.status === 429) {
                throw new Error('Too many requests. Please wait a moment.');
            }
            throw new Error(`Failed to fetch matches: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching matches:', error);
        throw error;
    }
};
