'use client';

import Image from 'next/image';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem as CartItemType } from '@/store/cartStore';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/utils/formatPrice';

export default function CartItem({ item }: { item: CartItemType }) {
  const { addItem, removeItem } = useCartStore();

  return (
    <li className="flex gap-4 items-center">
      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100 shrink-0">
        <Image src={item.image} alt={item.name} fill className="object-cover" sizes="64px" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 truncate">{item.name}</p>
        <p className="text-orange-600 font-bold">{formatPrice(item.price)}</p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => removeItem(item.id)}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-red-100 hover:text-red-500 transition-colors"
          aria-label={`Remove one ${item.name}`}
        >
          {item.quantity === 1 ? <Trash2 size={14} /> : <Minus size={14} />}
        </button>
        <span className="w-6 text-center font-semibold">{item.quantity}</span>
        <button
          onClick={() => addItem({ _id: item.id, name: item.name, price: item.price / 100, image: item.image } as any)}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-orange-100 hover:text-orange-500 transition-colors"
          aria-label={`Add another ${item.name}`}
        >
          <Plus size={14} />
        </button>
      </div>
    </li>
  );
}