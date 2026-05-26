'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCartStore } from '@/store/cartStore';
import OrderSummary from './OrderSummary';
import { useEffect, useState } from 'react';

const checkoutSchema = z.object({
  customerName: z.string().min(2, 'Please enter your full name'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid UK phone number'),
  addressLine1: z.string().min(3, 'Please enter your street address'),
  addressLine2: z.string().optional(),
  city: z.string().min(2, 'Please enter your city or town'),
  postcode: z
    .string()
    .regex(
      /^[A-Z]{1,2}[0-9][0-9A-Z]?\s*[0-9][A-Z]{2}$/i,
      'Please enter a valid UK postcode'
    ),
  notes: z.string().max(300).optional(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function CheckoutForm() {
  const router = useRouter();
  const { items, total } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  });

  useEffect(() => {
    if (items.length === 0) {
    router.push('/');
    }
   }, [items.length, router]);
   if(items.length === 0) return null;
  

  const onSubmit = async (data: CheckoutFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          customerDetails: {
            name: data.customerName,
            email: data.email,
            phone: data.phone,
          },
          deliveryAddress: {
            line1: data.addressLine1,
            line2: data.addressLine2,
            city: data.city,
            postcode: data.postcode,
          },
          notes: data.notes,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Something went wrong. Please try again.');
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (err: any) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
      <div className="lg:col-span-3">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <fieldset className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <legend className="text-lg font-bold text-gray-900 mb-5">Contact Details</legend>
            <div className="space-y-4">
              <FormField label="Full Name" error={errors.customerName?.message}>
                <input {...register('customerName')} placeholder="Jane Smith" />
              </FormField>
              <FormField label="Email Address" error={errors.email?.message}>
                <input {...register('email')} type="email" placeholder="jane@example.com" />
              </FormField>
              <FormField label="Phone Number" error={errors.phone?.message}>
                <input {...register('phone')} type="tel" placeholder="07700 900000" />
              </FormField>
            </div>
          </fieldset>

          <fieldset className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <legend className="text-lg font-bold text-gray-900 mb-5">Delivery Address</legend>
            <div className="space-y-4">
              <FormField label="Address Line 1" error={errors.addressLine1?.message}>
                <input {...register('addressLine1')} placeholder="123 High Street" />
              </FormField>
              <FormField label="Address Line 2 (optional)" error={errors.addressLine2?.message}>
                <input {...register('addressLine2')} placeholder="Flat 2B" />
              </FormField>
              <div className="grid grid-cols-2 gap-4">
                <FormField label="City / Town" error={errors.city?.message}>
                  <input {...register('city')} placeholder="London" />
                </FormField>
                <FormField label="Postcode" error={errors.postcode?.message}>
                  <input {...register('postcode')} placeholder="SW1A 1AA" className="uppercase" />
                </FormField>
              </div>
            </div>
          </fieldset>

          <fieldset className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <legend className="text-lg font-bold text-gray-900 mb-5">Special Instructions</legend>
            <FormField label="Notes (optional)" error={errors.notes?.message}>
              <textarea
                {...register('notes')}
                rows={3}
                placeholder="Allergy info, gate code, leave at door..."
              />
            </FormField>
          </fieldset>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-4 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white font-bold py-4 rounded-2xl text-lg transition-colors duration-200"
          >
            {isSubmitting ? 'Redirecting to payment...' : 'Continue to Payment →'}
          </button>
        </form>
      </div>

      <div className="lg:col-span-2">
        <OrderSummary />
      </div>
    </div>
  );
}

function FormField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactElement<{ className?: string }>;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
      {React.cloneElement(children, {
        className: `w-full border ${error ? 'border-red-400' : 'border-gray-200'}
          rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2
          focus:ring-orange-300 transition-shadow text-sm bg-gray-50`,
      })}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}