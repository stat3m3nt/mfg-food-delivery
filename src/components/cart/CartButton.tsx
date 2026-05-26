'use client';

import { useState, useEffect } from 'react';
import { ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';

export default function CartButton() {
  const { setOpen, itemCount } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const count = itemCount();
  if (count === 0) return null;

  return (
    <button
      onClick={() => setOpen(true)}
      className="fixed bottom-6 right-6 z-40 bg-orange-500 hover:bg-orange-600 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
      aria-label={`Open cart — ${count} item${count !== 1 ? 's' : ''}`}
    >
      <ShoppingBag size={24} />
      <span className="absolute -top-1 -right-1 bg-gray-900 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
        {count}
      </span>
    </button>
  );
}