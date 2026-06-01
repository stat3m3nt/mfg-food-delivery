'use client';

/**
 * DishCard
 * Displays a single menu item with image, name, description, price, and
 * dietary tags. Add to cart triggers the Zustand store action and opens
 * the cart drawer briefly to confirm the action.
 */
import Image from 'next/image';
import { Plus } from 'lucide-react';
import { Dish } from '@/types/menu';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/utils/formatPrice';
import DietaryBadge from './DietaryBadge';
import { cn } from '@/utils/cn';

interface DishCardProps {
  dish: Dish;
}

export default function DishCard({ dish }: DishCardProps) {
  const { addItem, setOpen } = useCartStore();

  const handleAddToCart = () => {
    addItem(dish);
    // Briefly open the cart drawer to confirm the addition
    setOpen(true);
    setTimeout(() => setOpen(false), 1800);
  };

  return (
    <article
      className={cn(
        'group bg-white rounded-2xl',
        'shadow-[0_2px_16px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_40px_rgba(0,0,0,0.12)]',
        'transition-all duration-300',
        dish.featured && 'ring-2 ring-orange-500'
      )}
    >
      {/* Dish image */}
      <div style={{ position: 'relative', height: '192px', width: '100%', overflow: 'hidden', backgroundColor: '#f3f4f6' , borderRadius: '16px 16px 0 0'}}>
      <Image
          src={dish.image}
          alt={dish.imageAlt || dish.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {dish.featured && (
          <span className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
            Chef&apos;s Special
          </span>
        )}
      </div>

      {/* Dish details */}
      <div className="p-5">
        <div className="flex justify-between items-start gap-3 mb-2">
          <h3 className="font-semibold text-gray-900 leading-snug">{dish.name}</h3>
          <span className="text-orange-600 font-bold text-lg shrink-0">
            {formatPrice(dish.price * 100)}
          </span>
        </div>

        <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">
          {dish.description}
        </p>

        {/* Dietary tags */}
        {dish.dietaryTags && dish.dietaryTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {dish.dietaryTags.map((tag) => (
              <DietaryBadge key={tag} tag={tag} />
            ))}
          </div>
        )}

        {/* Add to cart */}
        <button
          onClick={handleAddToCart}
          className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition-colors duration-200 active:scale-95"
          aria-label={`Add ${dish.name} to cart`}
        >
          <Plus size={18} />
          Add to Order
        </button>
      </div>
    </article>
  );
}