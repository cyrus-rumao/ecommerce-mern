import axios from 'axios';

const baseURL = 'https://ecommerce-mern-2-xtqq.onrender.com/api';

const axiosInstance = axios.create({
	baseURL,
	withCredentials: true, // include cookies
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
	failedQueue.forEach((prom) => {
		if (error) {
			prom.reject(error);
		} else {
			prom.resolve(token);
		}
	});

	failedQueue = [];
};

axiosInstance.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;

		if (
			error.response?.status === 401 &&
			!originalRequest._retry &&
			!originalRequest.url.includes('/auth/refresh-token')
		) {
			originalRequest._retry = true;

			if (isRefreshing) {
				return new Promise((resolve, reject) => {
					failedQueue.push({ resolve, reject });
				})
					.then((token) => {
						originalRequest.headers['Authorization'] = `Bearer ${token}`;
						return axiosInstance(originalRequest);
					})
					.catch((err) => {
						return Promise.reject(err);
					});
			}

			isRefreshing = true;

			try {
				const res = await axios.post(
					`${baseURL}/auth/refresh-token`,
					{},
					{ withCredentials: true }
				);

				const newAccessToken = res.data.accessToken;
				processQueue(null, newAccessToken);
				originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
				return axiosInstance(originalRequest);
			} catch (err) {
				processQueue(err, null);
				return Promise.reject(err);
			} finally {
				isRefreshing = false;
			}
		}

		return Promise.reject(error);
	}
);

export default axiosInstance;

export const checkAuth = async () => {
	try {
		const res = await axiosInstance.get('/auth/profile');
		// console.log(res.data);
		return res.data;
	} catch (err) {
		console.log(err.message);
	}
};
