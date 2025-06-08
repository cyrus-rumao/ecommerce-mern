import axios from "axios";

const axiosInstance = axios.create({
	baseURL: import.meta.mode ="http://localhost:5000/api" ,
	withCredentials: true,
});

export default axiosInstance;
