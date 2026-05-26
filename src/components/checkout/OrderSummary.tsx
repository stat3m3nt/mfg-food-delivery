'use client';

import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/utils/formatPrice';

const DELIVERY_FEE = 299;

export default function OrderSummary() {
  const { items, total } = useCartStore();

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
      <h2 className="text-lg font-bold text-gray-900 mb-5">Order Summary</h2>
      <ul className="space-y-3 mb-6">
        {items.map((item) => (
          <li key={item.id} className="flex justify-between text-sm">
            <span className="text-gray-600">
              {item.quantity}× {item.name}
            </span>
            <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
          </li>
        ))}
      </ul>
      <div className="border-t pt-4 space-y-2 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span>{formatPrice(total())}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Delivery</span>
          <span>{formatPrice(DELIVERY_FEE)}</span>
        </div>
        <div className="flex justify-between font-bold text-lg text-gray-900 pt-2 border-t">
          <span>Total</span>
          <span className="text-orange-600">{formatPrice(total() + DELIVERY_FEE)}</span>
        </div>
      </div>
    </div>
  );
}