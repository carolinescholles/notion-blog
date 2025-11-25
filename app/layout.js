import '../styles/globals.css';

export const metadata = {
  title: {
    default: 'Reinventing Home',
    template: '%s | Reinventing Home',
  },
  description: 'My path to unlearning, releasing, and finding the courage to begin again as a digital nomad from south Brazil.',
  metadataBase: new URL('https://madeinbrazil.com'),
  keywords: ['blog', 'digital nomad', 'south brazil', 'personal growth', 'unlearning', 'courage', 'nomadic life'],
  authors: [{ name: 'Caroline Scholles' }],
  creator: 'Caroline Scholles',
  publisher: 'Reinventing Home',
  openGraph: {
    title: 'Reinventing Home',
    description: 'My path to unlearning, releasing, and finding the courage to begin again as a digital nomad from south Brazil.',
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Reinventing Home',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Reinventing Home',
    description: 'My path to unlearning, releasing, and finding the courage to begin again as a digital nomad from south Brazil.',
    creator: '@madeinbrazil',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://madeinbrazil.com',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body>
        {children}
      </body>
    </html>
  );
}
