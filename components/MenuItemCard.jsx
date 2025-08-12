import { Clock, Plus, Star } from "lucide-react";
import Image from "next/image";

const MenuItemCard = ({ item, onAddToCart }) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
  const imageSrc = `${baseUrl}${item.imageUrl}`;

  console.log("Image URL:", imageSrc);

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
      {/* Image */}
      <div className="relative w-full h-40">
        <Image
          src={imageSrc}
          alt={item.name}
          fill
          className="w-full h-full object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        {/* Name */}
        <h3 className="text-lg font-semibold text-card-foreground truncate">
          {item.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
          {item.description}
        </p>

        {/* Price */}
        <div className="flex items-center justify-between mt-3">
          <span className="text-lg font-bold text-primary">
            ${parseFloat(item.price).toFixed(2)}
          </span>
          <button
            onClick={() => onAddToCart(item)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground p-2 rounded-full transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Optional meta info */}
        {(item.rating || item.prepTime) && (
          <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
            {item.rating && (
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500" />
                {item.rating}
              </div>
            )}
            {item.prepTime && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {item.prepTime}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuItemCard;
