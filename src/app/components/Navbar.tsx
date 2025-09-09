"use client";

import React from "react";

interface NavbarProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <nav className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 p-4 shadow-lg sticky top-0 z-50">
      <div className="flex items-center justify-center gap-4 scrollbar-hide">
        {categories.map((category) => {
          const isActive = selectedCategory === category;
          return (
            <button
              key={category}
              onClick={() => onSelectCategory(category)}
              className={`
                relative px-6 py-2 font-semibold rounded-full transition-all duration-300 cursor-pointer
                ${isActive ? "bg-white text-blue-600 shadow-xl scale-110" : "text-white hover:bg-white/20 hover:scale-105"}
              `}
            >
              {category}
              {isActive && (
                <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-blue-600 rounded-full animate-pulse"></span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navbar;
