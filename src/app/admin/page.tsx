/**
 * Admin Order Dashboard
 *
 * A simple, password-protected page for the owner to view and manage orders.
 * Protected by checking a secret query param against ADMIN_SECRET env var.
 * (For a real production app, replace this with NextAuth or Supabase Auth.)
 *
 * Usage: /admin?secret=your_admin_secret
 */
import { redirect } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase/server';
import { Order } from '@/types/order';
import { formatPrice } from '@/utils/formatPrice';
import { format } from 'date-fns';

interface AdminPageProps {
  searchParams: { secret?: string };
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  // Simple secret-based protection
  if (searchParams.secret !== process.env.ADMIN_SECRET) {
    redirect('/');
  }

  // Fetch all orders, newest first
  const { data: orders, error } = await supabaseAdmin
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) {
    return <p className="p-8 text-red-500">Error loading orders: {error.message}</p>;
  }

  const statusColour: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    preparing: 'bg-purple-100 text-purple-800',
    out_for_delivery: 'bg-orange-100 text-orange-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-display text-4xl font-bold text-gray-900 mb-2">MFG Orders</h1>
        <p className="text-gray-500 mb-8">{orders?.length} orders total</p>

        <div className="space-y-4">
          {orders?.map((order: Order) => (
            <div key={order.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                <div>
                  <p className="font-bold text-lg text-gray-900">{order.customer_name}</p>
                  <p className="text-gray-500 text-sm">{order.customer_email} · {order.customer_phone}</p>
                  <p className="text-gray-400 text-xs mt-1">
                    {format(new Date(order.created_at), 'dd MMM yyyy HH:mm')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-orange-600 font-bold text-xl">{formatPrice(order.total)}</p>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColour[order.status]}`}>
                    {order.status.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <ul className="text-sm text-gray-700 space-y-1">
                  {order.items.map((item, i) => (
                    <li key={i}>{item.quantity}× {item.name}</li>
                  ))}
                </ul>
                <p className="text-sm text-gray-500 mt-2">
                  📍 {order.delivery_address.line1}, {order.delivery_address.city}, {order.delivery_address.postcode}
                </p>
                {order.notes && (
                  <p className="text-sm text-gray-500 mt-1">📝 {order.notes}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}