import { Minus, Plus } from "lucide-react";

const CartItem = ({ item, onUpdateQuantity }) => (
  <div className="flex items-center justify-between bg-muted p-3 rounded-lg">
    <div className="flex-1">
      <h4 className="font-medium text-foreground">{item.name}</h4>
      <p className="text-chart-1 font-semibold">${item.price}</p>
    </div>
    <div className="flex items-center space-x-2">
      <button
        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
        className="p-1 bg-background hover:bg-accent rounded transition-colors"
      >
        <Minus className="w-4 h-4" />
      </button>
      <span className="w-8 text-center text-foreground">{item.quantity}</span>
      <button
        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
        className="p-1 bg-background hover:bg-accent rounded transition-colors"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  </div>
);

export default CartItem;