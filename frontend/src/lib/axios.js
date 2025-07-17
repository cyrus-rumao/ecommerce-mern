import axios from 'axios';

const axiosInstance = axios.create({
	baseURL: 'https://ecommerce-mern-1-ptoi.onrender.com/api',
	withCredentials: true,
});

export default axiosInstance;
