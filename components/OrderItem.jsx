const OrderItem = ({ order, getStatusColor }) => (
    <div className="bg-slate-900 rounded-lg p-4">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-lg">{order.orderNumber}</h3>
          <p className="text-slate-400 text-sm">
            {order.date.toLocaleDateString()} at {order.date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
          {order.status}
        </span>
      </div>
  
      <div className="space-y-2 mb-3">
        {order.items.map((item, index) => (
          <div key={index} className="flex justify-between text-sm">
            <span>{item.quantity}x {item.name}</span>
            <span className="text-orange-400">${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>
  
      <div className="border-t border-slate-700 pt-3 flex justify-between items-center">
        <span className="font-semibold">Total:</span>
        <span className="font-bold text-orange-400 text-lg">${order.total.toFixed(2)}</span>
      </div>
    </div>
  );
  
  export default OrderItem;