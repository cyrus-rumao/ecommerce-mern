import React from "react";
// import axiosInstance from '../lib/axiosInstance'
// import jeans from '../assets/jeans.jpg'
// import bag from '../assets/bags.jpg'
import CategoryItem from "../Components/CategoryItem";
const categories = [
  {
    href: "/bags",
    name: "Bags",
    imageUrl: "/assets/bags.jpg",
  },
  {
    href: "/glasses",
    name: "Glasses",
    imageUrl: "/assets/glasses.png",
  },
  {
    href: "/jackets",
    name: "Jackets",
    imageUrl: "assets/jackets.jpg",
  },
  {
    href: "/jeans",
    name: "Jeans",
    imageUrl: "assets/jeans.jpg",
  },
  {
    href: "/shoes",
    name: "Shoes",
    imageUrl: "assets/shoes.jpg",
  },
  {
    href: "/suits",
    name: "Suits",
    imageUrl: "assets/suits.jpg",
  },
  {
    href: "/tshirts",
    name: "T-Shirts",
    imageUrl: "/assets/tshirts.jpg",
  },
];
const Home = () => {
  return (
    // <div className="h-screen w-full bg-[radial-gradient(circle,_rgba(64,0,128,1)_0%,_rgba(18,18,63,1)_100%)]">
    <div className="flex flex-col items-center h-full">
      <span className="text-white text-5xl font-bold flex mt-10">
        Explore our latest Categories!
      </span>
      <span className="text-white text-2xl font-bold flex mt-5 ">
        Discover the Latest Trends!
      </span>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  mt-10">
        {categories.map((category) => (
          <CategoryItem key={category.name} category={category} />
        ))}
      </div>
    </div>
    // </div>
  );
};

export default Home;
