import axios from 'axios';

const axiosInstance = axios.create({
	baseURL: 'https://ecommerce-mern-2-xtqq.onrender.com/api',
	withCredentials: true,
});

export default axiosInstance;
