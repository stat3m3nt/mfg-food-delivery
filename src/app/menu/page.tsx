import { client } from '@/lib/sanity/client';
import { MENU_QUERY } from '@/lib/sanity/queries';
import { MenuCategory } from '@/types/menu';
import MenuSection from '@/components/menu/MenuSection';
import CartDrawer from '@/components/cart/CartDrawer';
import CartButton from '@/components/cart/CartButton';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const revalidate = 60;

export default async function HomePage() {
  const categories: MenuCategory[] = await client.fetch(MENU_QUERY);

  return (
    <>
      <Navbar />
      <main className="min-h-screen" style={{ background: '#fdf6ec' }}>
        <section style={{ background: '#1a0800' }} className="text-white py-20 px-6 text-center">
          <p className="font-semibold text-sm uppercase mb-4" style={{ color: '#f97316', letterSpacing: '0.2em' }}>
            Fresh · Fried · Delivered
          </p>
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
            Our Menu
          </h1>
          <p className="text-lg max-w-xl mx-auto" style={{ color: '#a87860' }}>
            Freshly prepared dishes, delivered to your door. Our menu rotates regularly — something new to discover every week.
          </p>
        </section>

        {categories.length > 0 && (
          <nav className="sticky top-16 z-40 shadow-sm" style={{ background: '#fff', borderBottom: '1px solid #f0e6d3' }}>
            <div className="max-w-6xl mx-auto px-6 py-4 flex gap-6 overflow-x-auto scrollbar-hide justify-start md:justify-center flex-nowrap">
              {categories.map((cat) => (
                <a key={cat._id} href={`#${cat.slug}`} className="shrink-0 text-sm font-semibold transition-colors" style={{ color: '#8a6a50' }}>
                  {cat.title}
                </a>
              ))}
            </div>
          </nav>
        )}

        <div className="max-w-6xl mx-auto px-6 py-16">
          {categories.length === 0 ? (
            <p className="text-center py-24 text-lg" style={{ color: '#8a6a50' }}>
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
      <CartButton />
      <CartDrawer />
    </>
  );
}
