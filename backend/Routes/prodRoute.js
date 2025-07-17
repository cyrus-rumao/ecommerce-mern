import express from 'express';
const router = express.Router();
import {
	getProducts,
	getFeaturedProducts,
	deleteProduct,
	createProduct,
	getRecomendedProducts,
	getProductsByCategory,
	toggleFeatured,
} from '../Controllers/prodController.js';
import { adminRoute, ProtectRoute } from '../Middlewares/Auth.js';
router.get('/', ProtectRoute, adminRoute, getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/category/:category', getProductsByCategory);
router.get('/recommendations', getRecomendedProducts);
router.post('/create-product', ProtectRoute, adminRoute, createProduct);
router.patch('/:id', ProtectRoute, adminRoute, toggleFeatured);
router.delete('/:id', ProtectRoute, adminRoute, deleteProduct);

export default router;
