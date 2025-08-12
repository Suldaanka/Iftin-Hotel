"use client";

const CategoryNav = ({ categories, activeCategory, onCategoryChange }) => {
  const allCategories = ["All", ...categories];

  return (
    <div className="flex space-x-2 mb-6 overflow-x-auto scrollbar-hide">
      {allCategories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
            activeCategory === category
              ? "bg-primary text-primary-foreground"
              : "bg-card text-card-foreground hover:bg-accent hover:text-accent-foreground"
          }`}
        >
          <span>{category}</span>
        </button>
      ))}
    </div>
  );
};

export default CategoryNav;
