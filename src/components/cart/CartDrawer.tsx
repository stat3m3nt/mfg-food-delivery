'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { X, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import CartItem from './CartItem';
import { formatPrice } from '@/utils/formatPrice';

const DELIVERY_FEE = 299;

export default function CartDrawer() {
  const { items, isOpen, setOpen, total, itemCount } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleCheckout = () => {
    setOpen(false);
    router.push('/checkout');
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl
          flex flex-col transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        aria-label="Shopping cart"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <ShoppingBag className="text-orange-500" size={22} />
            <h2 className="text-xl font-bold text-gray-900">
              Your Order ({itemCount()})
            </h2>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="text-gray-400 hover:text-gray-700 transition-colors"
            aria-label="Close cart"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <ShoppingBag size={48} className="mx-auto mb-4 opacity-30" />
              <p className="font-medium">Your order is empty</p>
              <p className="text-sm mt-1">Add some dishes to get started</p>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 border-t border-gray-100 space-y-4">
            <div className="space-y-2 text-sm">
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
            <button
              onClick={handleCheckout}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-2xl transition-colors duration-200 text-lg"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </aside>
    </>
  );
}