import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MFG | Fresh Food Delivered to Your Door',
  description:
    'Order freshly prepared meals from MFG. Fast delivery, rotating seasonal menu, and great flavours.',
  openGraph: {
    title: 'MFG Food Delivery',
    description: 'Fresh food delivered to your door.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}