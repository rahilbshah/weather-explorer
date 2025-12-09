import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const weatherAPI = {
    storeWeather: async (data) => {
        const response = await apiClient.post('/store-weather-data', data);
        return response.data;
    },

    listFiles: async () => {
        const response = await apiClient.get('/list-weather-files');
        return response.data;
    },

    getWeatherFile: async (filename) => {
        const response = await apiClient.get(`/weather-file-content/${filename}`);
        return response.data;
    },
};

export default weatherAPI;
