/**
 * MenuSection
 * Renders one category (e.g. "Starters") with a heading and grid of dish cards.
 * The id attribute enables smooth scrolling from the category nav.
 */
import { MenuCategory } from '@/types/menu';
import DishCard from './DishCard';

interface MenuSectionProps {
  category: MenuCategory;
}

export default function MenuSection({ category }: MenuSectionProps) {
  if (category.dishes.length === 0) return null;

  return (
    <section id={category.slug} className="mb-16 scroll-mt-24">

      {/* Centered header block */}
      <div>
        <h2 className="font-display text-3xl font-bold text-gray-900 mb-2">
          {category.title}
        </h2>
        <div className="flex justify-center mt-3">
          <div className="w-16 h-1 bg-orange-500 rounded-full mb-8" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {category.dishes.map((dish) => (
          <DishCard key={dish._id} dish={dish} />
        ))}
      </div>
    </section>
  );
}