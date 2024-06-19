// frontend/app/api/resultsApi.ts
import axios from 'axios';
const API_URL = process.env.API_URL || 'http://localhost:3000';

export const getAllResults = async (page: number) => {
    try {
        const response = await axios.get(`${API_URL}/results/allResults`, {
            params: { page, limit: 10 },
        });
        const results = response.data.resultSet.map((result: any) => ({ // Add type annotation 'any' to 'result'
            ...result,
            thumbnail: `${API_URL}${result.thumbnail}`
        }));
        return { ...response.data, resultSet: results };
    } catch (error) {
        console.error('Error fetching results: ', error);
        throw error;
    }
};
