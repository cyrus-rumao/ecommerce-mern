import toast from "react-hot-toast";
import {Navigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";
import { handleError, handleSuccess } from "../lib/utils"; // Assuming you have a utility for error handling
const ProductCard = ({ product }) => {
	
	const { user } = useUserStore();
	const { addToCart } = useCartStore();
	const handleAddToCart = () => {

		if (!user) {
			handleError("Please login to add products to cart", { id: "login" });
			return;
		} else {
			// add to cart
			handleSuccess("Product added to cart", { id: "add-to-cart" });
			addToCart(product);
		}

	};
// console.log("ProductCard IMage", product.images.secure_url);
	return (
		<div className='flex w-full relative flex-col overflow-hidden rounded-lg border border-gray-700 shadow-lg'>
			<div className='relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl'>
				<img className='object-cover w-full' src={product.images.secure_url} alt='product image' />
				<div className='absolute inset-0 bg-black bg-opacity-20' />
			</div>

			<div className='mt-4 px-5 pb-5'>
				<h5 className='text-xl font-semibold tracking-tight text-white'>{product.name}</h5>
				<div className='mt-2 mb-5 flex items-center justify-between'>
					<p>
						<span className='text-3xl font-bold text-emerald-400'>${product.price}</span>
					</p>
				</div>
				{<button
					className='flex items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-center text-sm font-medium
					 text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300'
					onClick={user ? handleAddToCart : () => {
						window.location.href = "/login";
						handleError("Please login to add products to cart", { id: "login" });
					}}
				>
					<ShoppingCart size={22} className='mr-2' />
					Add to cart
				</button>}
			</div>
		</div>
	);
};
export default ProductCard;
