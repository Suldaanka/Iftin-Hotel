import { ShoppingCart } from "lucide-react";

const CartButton = ({ onClick, itemCount = 0, className = "" }) => (
  <button
    onClick={onClick}
    className={`relative p-2 bg-primary rounded-full hover:bg-primary/90 transition-colors ${className}`}
  >
    <ShoppingCart className="w-4 h-4 text-primary-foreground" />
    {itemCount > 0 && (
      <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
        {itemCount}
      </span>
    )}
  </button>
);

export default CartButton;