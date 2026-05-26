/**
 * Checkout Page
 * Server component wrapper. Redirects to home if cart is somehow empty
 * (handled client-side in CheckoutForm).
 */
import CheckoutForm from '@/components/checkout/CheckoutForm';
import Navbar from '@/components/layout/Navbar';

export default function CheckoutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#faf9f7] py-16">
        <div className="max-w-5xl mx-auto px-6">
          <h1 className="font-display text-4xl font-bold text-gray-900 mb-10">Checkout</h1>
          <CheckoutForm />
        </div>
      </main>
    </>
  );
}