const API_KEY = import.meta.env.VITE_API_TOKEN;

const BASE_URL = import.meta.env.DEV ? '/api' : 'https://api.football-data.org/v4';

export const fetchMatches = async () => {
    try {
        const response = await fetch(`${BASE_URL}/matches`, {
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
