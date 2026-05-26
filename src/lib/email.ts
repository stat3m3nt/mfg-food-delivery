/**
 * Email sending functions using Resend
 * Two emails are sent after a successful order:
 *   1. Customer confirmation with order summary
 *   2. Owner notification with full order details
 */
import { Resend } from 'resend';
import { Order } from '@/types/order';
import { formatPrice } from '@/utils/formatPrice';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOrderConfirmation(order: Order) {
  const itemsList = order.items
    .map((item) => `${item.quantity}x ${item.name} — ${formatPrice(item.price * item.quantity)}`)
    .join('\n');

  await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: order.customer_email,
    subject: `MFG Order Confirmed — #${order.id.slice(0, 8).toUpperCase()}`,
    html: `
      <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; color: #1a1a1a;">
        <h1 style="color: #e85d26;">Order Confirmed! 🎉</h1>
        <p>Hi ${order.customer_name}, thanks for your order. We're getting it ready now.</p>
        <hr style="border: 1px solid #e8e4df; margin: 24px 0;" />
        <h2>Your Order</h2>
        <pre style="font-family: sans-serif; line-height: 1.8;">${itemsList}</pre>
        <hr style="border: 1px solid #e8e4df; margin: 24px 0;" />
        <p><strong>Delivery:</strong> ${formatPrice(order.delivery_fee)}</p>
        <p style="font-size: 1.2em;"><strong>Total: ${formatPrice(order.total)}</strong></p>
        <hr style="border: 1px solid #e8e4df; margin: 24px 0;" />
        <h2>Delivering to</h2>
        <p>
          ${order.delivery_address.line1}<br>
          ${order.delivery_address.line2 ? order.delivery_address.line2 + '<br>' : ''}
          ${order.delivery_address.city}<br>
          ${order.delivery_address.postcode}
        </p>
        ${order.notes ? `<p><strong>Notes:</strong> ${order.notes}</p>` : ''}
        <p style="color: #8a8580; font-size: 0.9em; margin-top: 32px;">
          If you have any issues, reply to this email.
        </p>
      </div>
    `,
  });
}

export async function sendOwnerNotification(order: Order) {
  const itemsList = order.items
    .map((item) => `${item.quantity}x ${item.name}`)
    .join(', ');

  await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: process.env.EMAIL_OWNER!,
    subject: `🆕 New Order — ${formatPrice(order.total)} from ${order.customer_name}`,
    html: `
      <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto;">
        <h1>New Order Received</h1>
        <p><strong>Customer:</strong> ${order.customer_name} (${order.customer_email})</p>
        <p><strong>Phone:</strong> ${order.customer_phone || 'Not provided'}</p>
        <p><strong>Items:</strong> ${itemsList}</p>
        <p><strong>Total:</strong> ${formatPrice(order.total)}</p>
        <p><strong>Address:</strong>
          ${order.delivery_address.line1},
          ${order.delivery_address.city},
          ${order.delivery_address.postcode}
        </p>
        ${order.notes ? `<p><strong>Notes:</strong> ${order.notes}</p>` : ''}
      </div>
    `,
  });
}