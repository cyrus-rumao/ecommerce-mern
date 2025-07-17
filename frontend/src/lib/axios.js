import axios from 'axios';

const axiosInstance = axios.create({
	baseURL: 'https://ecommerce-mern-backend-h0g6.onrender.com/api',
	withCredentials: true,
});

export default axiosInstance;
