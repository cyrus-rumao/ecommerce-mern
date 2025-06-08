import React from "react";
import { Link } from "react-router-dom";

const CategoryItem = ({ category }) => {
    console.log(category.imageUrl)
  return (
    <div className="relative overflow-hidden h-52 w-52 rounded-lg shadow-lg ">
      <Link to={"/category" + category.href}>
        <div className="w-full h-full cursor-pointer">
          <img
            src={category.imageUrl}
            alt={category.name}
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-50" />
          <div className="relative z-10 flex items-end h-full p-2 text-white font-semibold">
            {category.name}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default CategoryItem;
