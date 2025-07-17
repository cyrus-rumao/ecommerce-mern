import axios from 'axios';

const axiosInstance = axios.create({
	baseURL: 'https://ecommerce-mern-332.onrender.com/api',
	withCredentials: true,
});

export default axiosInstance;
