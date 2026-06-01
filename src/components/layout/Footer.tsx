export default function Footer() {
  return (
    <footer style={{ background: '#1a0800', color: '#a87860' }} className="py-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <p
            className="font-black tracking-widest text-2xl mb-1"
            style={{ fontFamily: 'Playfair Display, Georgia, serif', color: '#fff' }}
          >
            MFG
          </p>
          <p className="text-sm" style={{ color: '#a87860' }}>Mama's Fried Goods — Fresh, Fried, Delivered</p>
        </div>
        <div className="text-center text-sm" style={{ color: '#a87860' }}>
          <p>📍 Delivering across London</p>
          <p className="mt-1">© {new Date().getFullYear()} MFG. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}