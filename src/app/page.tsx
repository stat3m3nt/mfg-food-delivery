import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>

        {/* Hero Section */}
        <section
          style={{ background: '#1a0800', minHeight: '90vh' }}
          className="flex flex-col items-center justify-center text-white px-6 py-24 text-center relative overflow-hidden"
        >
          {/* Background glow */}
          <div
            style={{
              position: 'absolute',
              width: '600px',
              height: '600px',
              background: 'radial-gradient(circle, #c8410a22 0%, transparent 70%)',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none',
            }}
          />

          <p
            className="font-semibold text-sm uppercase mb-6 tracking-widest"
            style={{ color: '#f97316' }}
          >
            West End, London
          </p>

          <h1
            className="text-6xl md:text-8xl font-black mb-6 leading-none"
            style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
          >
            Food Made<br />
            <span style={{ color: '#f97316' }}>With Love.</span>
          </h1>

          <p className="text-xl max-w-2xl mx-auto mb-10" style={{ color: '#a87860' }}>
            Mama V brings the warmth of Nigerian home cooking straight to your door —
            jollof rice, puff puff, hearty soups, and so much more. Fresh, fast, and full of flavour.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/menu"
              className="px-8 py-4 rounded-full text-white font-bold text-lg transition-all hover:scale-105"
              style={{ background: '#f97316' }}
            >
              Order Now
            </Link>
            <Link
              href="/about"
              className="px-8 py-4 rounded-full font-bold text-lg transition-all"
              style={{ border: '2px solid #c8410a', color: '#f97316' }}
            >
              Our Story
            </Link>
          </div>
        </section>

        {/* Why MFG Section */}
        <section style={{ background: '#fdf6ec' }} className="py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <p className="font-semibold text-sm uppercase mb-4 tracking-widest" style={{ color: '#f97316' }}>
                Why Choose Us
              </p>
              <h2
                className="text-4xl md:text-5xl font-black"
                style={{ fontFamily: 'Playfair Display, Georgia, serif', color: '#1a0800' }}
              >
                The MFG Difference
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: '🍛',
                  title: 'Nigerian Heart',
                  description: 'Every dish is rooted in West African tradition. Jollof rice, puff puff, and rich soups are always on the menu — made the way Mama V learned them.',
                },
                {
                  icon: '🔥',
                  title: 'Freshly Prepared',
                  description: 'Nothing sits under a heat lamp here. Every order is prepared fresh when you place it — you can taste the difference.',
                },
                {
                  icon: '🚀',
                  title: 'Fast Delivery',
                  description: 'Based in the West End, we deliver quickly across London. Hot food, on time, every time.',
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="p-8 rounded-3xl text-center"
                  style={{ background: '#fff', border: '1px solid #f0e6d3' }}
                >
                  <div className="text-5xl mb-4">{item.icon}</div>
                  <h3
                    className="text-xl font-bold mb-3"
                    style={{ fontFamily: 'Playfair Display, Georgia, serif', color: '#1a0800' }}
                  >
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#8a6a50' }}>
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Signature Dishes Section */}
        <section style={{ background: '#1a0800' }} className="py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <p className="font-semibold text-sm uppercase mb-4 tracking-widest" style={{ color: '#f97316' }}>
                Always On The Menu
              </p>
              <h2
                className="text-4xl md:text-5xl font-black text-white"
                style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
              >
                Mama V&apos;s Signatures
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {[
                { name: 'Jollof Rice', description: 'The classic West African staple. Smoky, spiced, and cooked to perfection. Every time.', emoji: '🍚' },
                { name: 'Puff Puff', description: 'Light, fluffy, golden fried dough balls dusted with sugar. Mama V\'s most requested dish.', emoji: '🍩' },
                { name: "Mama's Soup", description: 'A rotating Nigerian soup — egusi, pepper soup, or ofe onugbu — served with your choice of swallow.', emoji: '🍲' },
              ].map((dish) => (
                <div
                  key={dish.name}
                  className="p-8 rounded-3xl"
                  style={{ background: '#ffffff10', border: '1px solid #c8410a33' }}
                >
                  <div className="text-5xl mb-4">{dish.emoji}</div>
                  <h3
                    className="text-xl font-bold mb-3 text-white"
                    style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
                  >
                    {dish.name}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#a87860' }}>
                    {dish.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Link
                href="/menu"
                className="px-8 py-4 rounded-full text-white font-bold text-lg transition-all hover:scale-105 inline-block"
                style={{ background: '#f97316' }}
              >
                View Full Menu
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section style={{ background: '#f97316' }} className="py-16 px-6 text-center">
          <h2
            className="text-4xl md:text-5xl font-black text-white mb-4"
            style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
          >
            Hungry? Let&apos;s Fix That.
          </h2>
          <p className="text-white text-lg mb-8 opacity-90">
            Fresh food delivered to your door across London. Order in minutes.
          </p>
          <Link
            href="/menu"
            className="px-8 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 inline-block"
            style={{ background: '#1a0800', color: '#fff' }}
          >
            Order Now
          </Link>
        </section>

      </main>
      <Footer />
    </>
  );
}
