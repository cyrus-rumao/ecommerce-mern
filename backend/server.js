import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import path from 'path';
import cors from 'cors';
import authRoutes from './Routes/authRoute.js';
import productRoutes from './Routes/prodRoute.js';
import cartRoutes from './Routes/cartRoutes.js';
import couponRoutes from './Routes/couponRoute.js';
import paymentRoutes from './Routes/paymentRoutes.js';
import analyticsRoutes from './Routes/analyticsRoute.js';

import { connectDB } from './Config/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const __dirname = path.resolve();
app.use(
	cors({
		origin: '*',
		credentials: true, // Allow cookies to be sent
	})
);
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/analytics', analyticsRoutes);

// if (process.env.NODE_ENV === 'production') {
// 	app.use(express.static(path.join(__dirname, '/frontend/dist')));

// 	app.get('*', (req, res) => {
// 		res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'));
// 	});
// }

app.listen(PORT, () => {
	console.log('Server is running on http://localhost:' + PORT);
	connectDB();
});
