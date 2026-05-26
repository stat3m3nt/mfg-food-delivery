/**
 * Order Confirmation Page
 * Shown after a successful Stripe payment.
 * Clears the cart on mount.
 */
'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';

export default function OrderConfirmationPage() {
  const clearCart = useCartStore((state) => state.clearCart);

  // Clear the cart once the customer lands here
  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <main className="min-h-screen bg-[#faf9f7] flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-xl p-12 max-w-lg w-full text-center">
        <CheckCircle className="text-green-500 mx-auto mb-6" size={64} />
        <h1 className="font-display text-4xl font-bold text-gray-900 mb-4">
          Order Confirmed!
        </h1>
        <p className="text-gray-500 text-lg mb-8">
          Thank you for your order. We&apos;ve sent a confirmation to your email.
          Your food is being prepared and will be with you shortly.
        </p>
        <Link
          href="/"
          className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-4 rounded-2xl transition-colors"
        >
          Back to Menu
        </Link>
      </div>
    </main>
  );
}