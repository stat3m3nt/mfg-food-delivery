/**
 * Home page / Menu page
 *
 * This is a React Server Component — it fetches menu data at request time
 * from Sanity. No useEffect, no loading states on the server.
 *
 * The page revalidates every 60 seconds so new menu items appear quickly
 * after the owner publishes them in Sanity Studio.
 */
import { client } from '@/lib/sanity/client';
import { MENU_QUERY } from '@/lib/sanity/queries';
import { MenuCategory } from '@/types/menu';
import MenuSection from '@/components/menu/MenuSection';
import CartDrawer from '@/components/cart/CartDrawer';
import CartButton from '@/components/cart/CartButton';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

// Next.js ISR — revalidate every 60 seconds
export const revalidate = 60;

export default async function HomePage() {
  // Fetch menu from Sanity (server-side)
  const categories: MenuCategory[] = await client.fetch(MENU_QUERY);

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#faf9f7]">
        {/* Hero Section */}
        <section className="bg-gray-900 text-white py-20 px-6 text-center">
          <p className="text-orange-400 font-semibold tracking-widest text-sm uppercase mb-4">
            Fresh Food Delivered
          </p>
          <h1 className="font-display text-5xl md:text-7xl font-black mb-6 leading-tight">
            Our Menu
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Freshly prepared dishes, delivered to your door. Our menu rotates regularly —
            something new to discover every week.
          </p>
        </section>

        {/* Category Nav (sticky) */}
        {categories.length > 0 && (
          <nav className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
            <div className="max-w-6xl mx-auto px-6 py-4 flex gap-4 overflow-x-auto scrollbar-hide">
              {categories.map((cat) => (
                <a
                  key={cat._id}
                  href={`#${cat.slug}`}
                  className="shrink-0 text-sm font-semibold text-gray-600 hover:text-orange-500 transition-colors"
                >
                  {cat.title}
                </a>
              ))}
            </div>
          </nav>
        )}

        {/* Menu Content */}
        <div className="max-w-6xl mx-auto px-6 py-16">
          {categories.length === 0 ? (
            <p className="text-center text-gray-400 py-24 text-lg">
              Menu coming soon — check back shortly!
            </p>
          ) : (
            categories.map((category) => (
              <MenuSection key={category._id} category={category} />
            ))
          )}
        </div>
      </main>

      <Footer />

      {/* Cart components — client-side */}
      <CartButton />
      <CartDrawer />
    </>
  );
}