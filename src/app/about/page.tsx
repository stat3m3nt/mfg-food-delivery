
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>

        {/* Hero */}
        <section
          style={{ background: '#1a0800' }}
          className="py-24 px-6 text-center text-white"
        >
          <p className="font-semibold text-sm uppercase mb-4 tracking-widest" style={{ color: '#f97316' }}>
            Our Story
          </p>
          <h1
            className="text-5xl md:text-7xl font-black mb-6"
            style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
          >
            Meet Mama V
          </h1>
          <p className="text-xl max-w-2xl mx-auto" style={{ color: '#a87860' }}>
            The heart and hands behind every dish at MFG.
          </p>
        </section>

        {/* Story Section */}
        <section style={{ background: '#fdf6ec' }} className="py-24 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-20">
              <div>
                <p className="font-semibold text-sm uppercase mb-4 tracking-widest" style={{ color: '#f97316' }}>
                  Where It All Started
                </p>
                <h2
                  className="text-3xl md:text-4xl font-black mb-6"
                  style={{ fontFamily: 'Playfair Display, Georgia, serif', color: '#1a0800' }}
                >
                  Cooking Has Always Been Her Language
                </h2>
                <p className="leading-relaxed mb-4" style={{ color: '#8a6a50' }}>
                  MFG was built on a simple idea — comfort food should feel bold, indulgent, and unforgettable. 
                  We specialise in fried comfort dishes inspired by West African street flavours, Southern soul food, and modern London food culture. Every dish is crafted around one obsession: texture — crisp, golden, smoky, and deeply satisfying.

                </p>
                
                <p className="leading-relaxed mb-4" style={{ color: '#8a6a50' }}>
                MFG — Mac&apos;s Fried Goods — was born right here in the West End of London, with one simple promise:
                real food, made with real love. 
                This is food made for cravings — late nights, quick lunches, shared meals, and moments when only something rich, warm, and freshly cooked will do.

                </p>

                <p className="leading-relaxed" style={{ color: '#8a6a50' }}>
                  We don’t overcomplicate food. We refine it, crisp it, season it properly, and serve it hot.
                  Mac’s Fried Goods is more than a kitchen — it’s a celebration of fried comfort done properly.
                </p>
              </div>

              <div
                className="rounded-3xl p-10 text-center"
                style={{ background: '#1a0800' }}
              >
                <div className="text-8xl mb-6">👩🏾‍🍳</div>
                <h3
                  className="text-2xl font-black text-white mb-2"
                  style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
                >
                  Mama V
                </h3>
                <p style={{ color: '#f97316' }} className="font-semibold mb-4">Head Chef</p>
                <p className="text-sm" style={{ color: '#a87860' }}>
                  &ldquo;I cook the way my mother taught me — with patience, with love, and never with shortcuts.&rdquo;
                </p>
              </div>
            </div>

            {/* Values */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
              {[
                { title: 'Our Food', description: 'A rotating menu of diverse comfort food with Nigerian dishes always at the heart of it. Jollof rice, puff puff, and a Nigerian soup are guaranteed every single day.' },
                { title: 'Our Promise', description: 'Every order is freshly prepared. No shortcuts, no reheated food. If Mama V wouldn\'t serve it to her own family, it doesn\'t leave the kitchen.' },
                { title: 'Our Community', description: 'MFG is more than a food business — it\'s a piece of home for the Nigerian and African community in London, and a delicious discovery for everyone else.' },
                { title: 'Our Delivery', description: 'Based in the West End, we deliver across London. We\'re always working to reach more neighbourhoods — if you\'re not sure, just ask.' },
              ].map((item) => (
                <div
                  key={item.title}
                  className="p-6 rounded-2xl"
                  style={{ background: '#fff', border: '1px solid #f0e6d3' }}
                >
                  <h3
                    className="text-lg font-bold mb-2"
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

            {/* CTA */}
            <div className="text-center">
              <h2
                className="text-3xl font-black mb-4"
                style={{ fontFamily: 'Playfair Display, Georgia, serif', color: '#1a0800' }}
              >
                Ready to Taste the Difference?
              </h2>
              <p className="mb-8" style={{ color: '#8a6a50' }}>
                Browse MFG&apos;s menu and place your order today.
              </p>
              <Link
                href="/menu"
                className="px-8 py-4 rounded-full text-white font-bold text-lg transition-all hover:scale-105 inline-block"
                style={{ background: '#f97316' }}
              >
                View Our Menu
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
