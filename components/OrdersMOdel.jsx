import { X } from "lucide-react";
import OrderItem from './OrderItem';

const OrdersModal = ({ isOpen, onClose, orders, getStatusColor }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="bg-black bg-opacity-50 absolute inset-0" onClick={onClose} />
      <div className="bg-slate-800 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto relative">
        <div className="p-4 border-b border-slate-700">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Recent Orders</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-700 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {orders.map(order => (
            <OrderItem
              key={order.id}
              order={order}
              getStatusColor={getStatusColor}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrdersModal;