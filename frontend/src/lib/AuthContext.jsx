/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';
import { checkAuth } from './axiosInstance';
import axios from 'axios';
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [currentUser, setCurrentUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [cartCount, setCount] = useState(0); // Cart count state
	useEffect(() => {
		const verify = async () => {
			const user = await checkAuth();
			setCurrentUser(user || null);
			setLoading(false);
		};
		verify();
	}, []);

	// Fetch cart count for customer role
	if (currentUser && currentUser.role === 'customer') {
		async () => {
			try {
				const response = await axios.get(
					'https://ecommerce-mern-2-xtqq.onrender.com/api/cart/',
					{}
				);
				setCount(response.data.length);
			} catch (error) {
				console.error('Failed to fetch cart items', error);
			}
		};
	}
	return (
		<AuthContext.Provider
			value={{ currentUser, setCurrentUser, loading, cartCount }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);
